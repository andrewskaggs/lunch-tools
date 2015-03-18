var express = require('express')
  , router = express.Router()
  ;

router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('lunches');
  collection.find({},{}, function(e, lunches) {
    res.send(lunches);
  });
});

router.get('/:date', function(req, res) {
  var db = req.db;
  var collection = db.get('lunches');
  collection.find({ date: req.params.date},{}, function(e, lunch) {
    res.send(lunch);
  });
});

module.exports = router;
