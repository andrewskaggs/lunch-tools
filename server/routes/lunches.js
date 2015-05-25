var express = require('express');
var router = express.Router();
var parser = require('rssparser');
var moment = require('moment');

router.get('/', function(req, res) {
  var collection = req.db.get('lunches');
  collection.find({},{},
    function(err, result) {
      if (err === null) {
        res.send(result);
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

router.get('/update', function(req, res) {
  checkFeed(req, res);
});

router.get('/date/:date', function(req, res) {
  var date = moment(req.params.date).format('YYYY-MM-DD');
  var collection = req.db.get('lunches');
  collection.find({ date: date},{}, function(err, result) {
    res.send(result);
  });
});

router.get('/:id', function(req, res) {
  var collection = req.db.get('lunches');
  collection.find({ _id: req.params.id},{},
    function(err, result) {
      if (err === null) {
        res.send(result);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

router.post('/', function(req, res) {
  if (req.body._id) {
    res.status(400).send( { message: '\'_id\' field is not allowed. Use PUT for updates' } );
  }

  if (!req.body.date) {
    res.status(400).send( { message: 'date field is required' } );
  }

  if (!req.body.menu) {
    res.status(400).send( { message: 'menu field is required' } );
  }

  req.db.get('lunches').insert(req.body,
    function(err, result) {
      if (err === null) {
        res.send();
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

router.put('/:id', function(req, res) {
  req.db.get('lunches').findById(req.params.id,
    function(err, result){
      if (err === null) {
        update(result, req, res);
      } else {
        res.status(400).send();
      }
    });
});

router.delete('/:id', function(req, res) {
  req.db.get('lunches').removeById(req.params.id,
    function(err, result) {
      if (err === null) {
        res.status(204).send();
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

function checkFeed(req, res) {
  if (process.env.LUNCH_TRANSLATOR_RSS) {
    var rssAddress = process.env.LUNCH_TRANSLATOR_RSS;
    var options = {};
    parser.parseURL(rssAddress, options, function(err, out){
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else {
        var lunches = [];
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
          lunches.push(lunch);

          req.db.get('lunches').find({ date: lunch.date },{}, function(err, result) {
            if (result.length == 0) {
              req.db.get('lunches').insert( lunch ,{});
            }
          });

        });
        res.status(200).send(lunches);
      }
    });
  } else {
    var errorMessage = 'LUNCH_TRANSLATOR_RSS variable not found';
    console.log(errorMessage);
    res.status(500).send(errorMessage);
  }
};

function update(lunch, req, res) {
  if (req.body.date)
    lunch.date = req.body.date;

  if (req.body.menu)
    lunch.menu = req.body.menu;

  req.db.get('lunches').updateById(lunch._id, lunch,
    function(err, result) {
      if (err === null) {
        res.send();
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
};

module.exports = router;
