var express = require('express');
var router = express.Router();
var parser = require('rssparser');
var moment = require('moment');
var Markov = require('blather');

router.get('/', function(req, res) {
  req.db.get('lunches').find({},
    {fields: { _id:0, date:1, menu:1 }},
    function(err, result) {
      if (err == null) {
        return res.jsonp(result);
      } else {
        console.log(err);
        return res.sendStatus(500);
      }
    });
});

router.get('/update', function(req, res) {
  checkFeed(req, res);
});

router.get('/generate', function(req, res) {
  generate(req, res);
});

router.get('/:date', function(req, res) {
  var targetDate = moment(req.params.date).format('YYYY-MM-DD');
  req.db.get('lunches').find({ date: targetDate},
    { fields: {_id: 0}},
    function(err, result) {
    if (result.length > 0) {
      return res.jsonp(result);
    } else {
      return res.sendStatus(404);
    }
  });
});

router.put('/:date', function(req, res) {
  var targetDate = moment(req.params.date).format('YYYY-MM-DD');

  if (req.body.menu == null) {
    return res.status(400).send({ message: "menu field is required"});
  }

  req.db.get('lunches').update({date: targetDate},
    { $set: { menu: req.body.menu } },
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result == 0) {
        return res.sendStatus(404);
      }
      return res.sendStatus(204);
    });
});

router.post('/', function(req, res) {
  if (!req.body.date) {
    return res.status(400).send( { message: 'date field is required' } );
  }
  if (!req.body.menu) {
    return res.status(400).send( { message: 'menu field is required' } );
  }

  var newLunch = {
    date: moment(req.body.date).format('YYYY-MM-DD'),
    menu: req.body.menu
  }

  req.db.get('lunches').find({date: newLunch.date}, {},
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result.length != 0) {
        return res.status(400).send( { message: 'duplicate date' } );
      }
      req.db.get('lunches').insert(newLunch,
        function(err, result) {
          if (err == null) {
            return res.sendStatus(204);
          } else {
            console.log(err);
            return res.sendStatus(500);
          }
        });
    });

});

router.post('/:date/ratings', function(req, res) {
  var targetDate = moment(req.params.date).format('YYYY-MM-DD');

  if (!req.body.rating || (parseInt(req.body.rating) != -1 && parseInt(req.body.rating)!= 1)) {
    return res.status(400).send( { message: 'rating must be either -1 or 1' } );
  }

  var newRating = {
    date: moment().format(),
    ip: req.ip,
    rating: parseInt(req.body.rating),
    type: "UpDownVote"
  }

  req.db.get('lunches').findAndModify({ date: targetDate},
    {$push: { ratings: newRating }},
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result == null) {
        return res.sendStatus(404);
      }
      return res.sendStatus(204);
  });

});

router.post('/:date/comments', function(req, res) {
  var targetDate = moment(req.params.date).format('YYYY-MM-DD');

  if (!req.body.message) {
    return res.status(400).send( { message: 'message field is required' } );
  }

  var newComment = {
    date: moment().format(),
    ip: req.ip,
    message: req.body.message,
    name: req.body.name
  }

  if (newComment.name == null || newComment == "")
    newComment.name = "Anonymous";

  req.db.get('lunches').findAndModify({ date: targetDate},
    {$push: { comments: newComment }},
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result == null) {
        return res.sendStatus(404);
      }
      return res.sendStatus(204);
  });

});

router.delete('/:date', function(req, res) {
  var targetDate = moment(req.params.date).format('YYYY-MM-DD');
  req.db.get('lunches').remove({date: targetDate},
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result == 0) {
        return res.sendStatus(404);
      }
      return res.sendStatus(204);
    });
});

function checkFeed(req, res) {
  if (process.env.LUNCH_TOOLS_RSS) {
    var rssAddress = process.env.LUNCH_TOOLS_RSS;
    var options = {};
    parser.parseURL(rssAddress, options, function(err, out){
      if (err) {
        console.log(err);
        res.status(500).send( { message: err } );
      }
      else {
        var newLunches = [];
        out.items.forEach(function(item){
          var date = moment(item.published_at).format('YYYY-MM-DD');
          var description = '';

          // lunch parsing regexs shamelessly stolen from Cory's hubot script
          // https://git.kabbage.com/projects/HUB/repos/kbot/browse/scripts/lunch.coffee
          var ptag = item.summary.match(/<p(.*?)?>(.+)<\/p>/);
          var tdtag =  item.summary.match(/<td(.*?)?>(.+)<\/td>/);

          if (ptag)
            description = ptag[2];
          else if (tdtag)
            description = tdtag[2];

          var lunch = {
            date: date,
            menu: description
          };

          req.db.get('lunches').find({ date: lunch.date },{}, function(err, result) {
            if (result.length === 0) {
              req.db.get('lunches').insert( lunch ,{});
              newLunches.push(lunch);
            }
          });

        });
        if (newLunches.length > 0) {
          refreshMarkovChain(req, res);
        }
        return res.jsonp(newLunches);
      }
    });
  } else {
    console.log('LUNCH_TOOLS_RSS variable not found');
    return res.sendStatus(500);
  }
}

function getMarkovChain(db) {
  var chains = db.get('lunch_markov_chains');
  return chains.findOne({key: 'primary_chain'});
}

function refreshMarkovChain(req, res, next) {
  getMarkovChain(req.db)
      .on('error', function(err) {
        res.status(500).send(err);
      })
      .on('success', function(dbchain) {
        var chain = new Markov();
        req.db.get('lunches').find({})
          .success(function(lunches) {
            lunches.forEach(function(lunch) {
              var sanitizedLunch = lunch.menu.replace(new RegExp("[\.\$]"), '');
              chain.addText(sanitizedLunch);
            });
            console.log(chain);
            req.db.get('lunch_markov_chains').findAndModify(
              { key: 'primary_chain'},
              { $set: { key: 'primary_chain', dictionary: chain.dictionary }},
              { upsert: true},
              function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(result);
                  if (next)
                    return next;
                }
              }
            );
          });
        });
}

function generate(req, res, next) {
  getMarkovChain(req.db)
      .on('success', function(dbchain) {
        var chain = new Markov();
        chain.dictionary = dbchain.dictionary;
        var generatedMenu = chain.sentence();
        res.jsonp({ menu: generatedMenu});
      })
      .on('error', function(err) {
        console.log(err);
        res.sendStatus(500);
      });
}

module.exports = router;
