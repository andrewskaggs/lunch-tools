var express = require('express')
  , router = express.Router()
  ;

router.get('/', function(req, res) {
  var collection = req.db.get('lunches');
  collection.find({},{},
    function(err, result) {
      if (err === null) {
        res.send(result);
      } else {
        res.status = 500;
        res.send(err);
      }
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
        res.status = 500;
        res.send(err);
      }
    });
});

router.get('/date/:date', function(req, res) {
  var collection = req.db.get('lunches');
  collection.find({ date: req.params.date},{}, function(err, result) {
    res.send(result);
  });
});

router.post('/', function(req, res) {
  if (req.body._id) {
    res.status = 400;
    res.send( { message: '\'_id\' field is not allowed. Use PUT for updates' } );
  }

  if (!req.body.date) {
    res.status = 400;
    res.send( { message: 'date field is required' } );
  }

  if (!req.body.menu) {
    res.status = 400;
    res.send( { message: 'menu field is required' } );
  }

  req.db.get('lunches').insert(req.body,
    function(err, result) {
      if (err === null) {
        res.status = 200;
        res.send();
      } else {
        res.status = 500;
        res.send(err);
      }
    });
});

router.put('/:id', function(req, res) {
  req.db.get('lunches').findById(req.params.id,
    function(err, result){
      if (err === null) {
        update(result, req, res);
      } else {
        res.status = 404;
        res.send();
      }
    });
});

function update(lunch, req, res) {
  if (req.body.date)
    lunch.date = req.body.date;

  if (req.body.menu)
    lunch.menu = req.body.menu

  req.db.get('lunches').updateById(lunch._id, lunch,
    function(err, result) {
      if (err === null) {
        res.status = 200;
        res.send();
      } else {
        res.status = 500;
        res.send(err);
      }
    });
};

router.delete('/:id', function(req, res) {
  req.db.get('lunches').removeById(req.params.id,
    function(err, result) {
      if (err === null) {
        res.status = 200;
        res.send();
      } else {
        res.status = 500;
        res.send(err);
      }
    });
});

module.exports = router;
