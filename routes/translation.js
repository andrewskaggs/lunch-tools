var express = require('express')
  , router = express.Router()
  ;

router.get('/', function(req, res) {
  var collection = req.db.get('translations');
  collection.find({},{}, function(err, result) {
    res.send(result);
  });
});

router.get('/:id', function(req, res) {
  var collection = req.db.get('translations');
  collection.find({ _id: req.params.id},{}, function(err, result) {
    res.send(result);
  });
});

router.get('/target/:target', function(req, res) {
  var collection = req.db.get('translations');
  collection.find({ target: req.params.target},{}, function(err, result) {
    res.send(err,result);
  });
});

router.post('/', function(req, res) {
  if (req.body._id)
    req.body._id = null;

  req.db.get('translations').insert(req.body,
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
  if (! req.body._id || 0 === reg.body._id.length) {
    res.status = 400;
    res.send(err);
  }

  req.db.get('translations').updateById(req.body._id, req.body,
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
  req.db.get('translations').removeById(req.params.id,
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
