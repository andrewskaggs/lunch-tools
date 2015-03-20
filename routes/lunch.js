var express = require('express')
  , router = express.Router()
  ;

router.get('/', function(req, res) {
  var collection = req.db.get('lunches');
  collection.find({},{}, function(err, result) {
    res.send(result);
  });
});

router.get('/:id', function(req, res) {
  var collection = req.db.get('lunches');
  collection.find({ _id: req.params.id},{}, function(err, result) {
    res.send(result);
  });
});

router.get('/date/:date', function(req, res) {
  var collection = req.db.get('lunches');
  collection.find({ date: req.params.date},{}, function(err, result) {
    res.send(result);
  });
});

router.post('/', function(req, res) {
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

router.put('/', function(req, res) {
  req.db.get('lunches').updateById(req.body._id, req.body,
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
