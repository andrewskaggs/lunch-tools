var express = require('express');
var router = express.Router();
var moment = require('moment');
var MarkovChain = require('markovchain-generate');
var _ = require('underscore');

router.get('/', function(req, res) {
  req.db.get('lunches').find({},
    {fields: { _id:0, date: 1, menu: 1 }},
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
  req.db.get('lunches').findOne({ date: targetDate},
    { fields: {_id: 0, ratings: 0, comments: 0 }},
    function(err, result) {
      if (result) {
        //return res.jsonp(result);
        appendComments(req,res,result);
      } else {
        return res.sendStatus(404);
      }
    });
});

function appendComments(req, res, lunch) {
  req.db.get('comments').find({date: lunch.date}, function(err, result) {
    if (err == null) {
      lunch.comments = result;
      appendRatings(req,res,lunch);
    } else {
      console.log(err);
      return res.sendStatus(500);
    }
  });
}

function appendRatings(req, res, lunch) {
  return res.jsonp(lunch);
  req.db.get('ratings').find({date: lunch.date}, function(err, result) {
    if (err == null) {
      lunch.ratings = result;
      return res.jsonp(lunch);
    } else {
      console.log(err);
      return res.sendStatus(500);
    }
  });
}

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
  if (req.is('json')) {
    jsonPost(req,res);
  } else {
    formPost(req,res);
  }
});

function jsonPost(req, res) {
  var newLunches = _.map(req.body, function(x) {
    return {
      date: moment(x.date).format('YYYY-MM-DD'),
      menu: x.menu
    }
  });

  var validLunches = _.reject(newLunches, function(x) {
    return x.menu == "";
  });

  req.db.get('lunches').insert(validLunches,
    function(err, result) {
      if (err == null) {
        refreshMarkovChain(req.db);
        return res.sendStatus(204);
      } else {
        console.log(err);
        return res.sendStatus(500);
      }
    });
};

function formPost(req, res) {
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
            refreshMarkovChain(req.db);
            return res.sendStatus(204);
          } else {
            console.log(err);
            return res.sendStatus(500);
          }
        });
    });
};

router.post('/:date/ratings', function(req, res) {
  var targetDate = moment(req.params.date).format('YYYY-MM-DD');

  if (!req.body.rating || (parseInt(req.body.rating) != -1 && parseInt(req.body.rating)!= 1)) {
    return res.status(400).send( { message: 'rating must be either -1 or 1' } );
  }

  var newRating = {
    date: targetDate,
    dish: req.body.dish,
    createDate: moment().format(),
    ip: req.ip,
    rating: parseInt(req.body.rating),
    type: 'UpDownVote',
    source: req.body.source
  }

  if (newRating.source == null || newRating.source == "") {
    newRating.source = "API";
  }

  req.db.get('lunches').findOne({ date: targetDate}, {}, function(err, result) {
    if (err != null) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (result && buildDishes(result.menu).indexOf(newRating.dish) >= 0) {
      req.db.get('ratings').insert(newRating, {}, function(err, result) {
        if (err == null) {
          return res.sendStatus(204);
        } else {
          console.log(err);
          return res.sendStatus(500);
        }
      });
    } else {
      return res.sendStatus(404);
    }
  })
});

router.post('/:date/comments', function(req, res) {
  var targetDate = moment(req.params.date).format('YYYY-MM-DD');

  if (!req.body.message) {
    return res.status(400).send( { message: 'message field is required' } );
  }

  var newComment = {
    date: targetDate,
    createDate: moment().format(),
    ip: req.ip,
    name: req.body.name,
    message: req.body.message,
  }

  if (newComment.name == null || newComment == "") {
    newComment.name = "Anonymous";
  }

  req.db.get('lunches').findOne({date: targetDate}, {}, function(err, result) {
    if (err != null) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (result == null) {
      return res.sendStatus(404);
    }
    req.db.get('comments').insert(newComment, function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      } else {
        return res.sendStatus(204);
      }
    });
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

function getMarkovChain(db) {
  var chains = db.get('lunch_markov_chains');
  return chains.findOne({key: 'primary_chain'});
}

function refreshMarkovChain(db, next) {
  getMarkovChain(db)
      .on('error', function(err) {
        console.log(err);
      })
      .on('success', function(dbchain) {
        var chain = new MarkovChain();
        db.get('lunches').find({})
          .success(function(lunches) {
            var menus = [];
            lunches.forEach(function(lunch) {
              menus.push(_.unescape(lunch.menu.replace(new RegExp("[\.\$]"), '').replace(/(<([^>]+)>)/ig, '')));
            });
            chain.generateChain(menus.join(". "));
            db.get('lunch_markov_chains').findAndModify(
              { key: 'primary_chain'},
              { $set: { key: 'primary_chain', dictionary: chain.dump() }},
              { upsert: true},
              function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  //console.log(result);
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
        var chain = new MarkovChain();
        chain.load(dbchain.dictionary);
        var generatedMenu = chain.generateString();
        res.jsonp({ menu: generatedMenu});
      })
      .on('error', function(err) {
        console.log(err);
        res.sendStatus(500);
      });
}

function buildDishes(menu) {
  menu = cleanMenu(menu);
  var rawDishes = menu.split(";");
  var dishes = [];
  for (var i = 0; i < rawDishes.length; i++) {
    dishes.push(rawDishes[i].trim());
  }
  dishes.push("Salad Bar");
  return dishes;
}

// HACK: This needs to be refactored and done with libraries instead of this trash
function cleanMenu(menu) {
  var noHtmlMenu = menu.replace(/<(?:.|\n)*?>/gm, '');
  var decodedMenu = noHtmlMenu;
  var decodedMenu = decodedMenu.replace(/&amp;/g, '&');
  var decodedMenu = decodedMenu.replace(/&lt;/g, '<');
  var decodedMenu = decodedMenu.replace(/&gt;/g, '>');
  var decodedMenu = decodedMenu.replace(/&quot;/g, '"');
  var decodedMenu = decodedMenu.replace(/&#39;/g, "'");
  return decodedMenu;
}

module.exports = router;
