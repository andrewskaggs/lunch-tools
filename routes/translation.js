var express = require('express')
  , router = express.Router()
  ;

var Translation = function(target, mode, replacement) {
  this.target = target;
  this.mode = mode;
  this.replacement = replacement;
};

router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('translations');
  collection.find({},{}, function(e, t) {
    res.send(t);
  });
});

router.get('/:target', function(req, res) {
  var db = req.db;
  var collection = db.get('translations');
  collection.find({ target: req.params.target},{}, function(e, t) {
    res.send(t);
  });
});

router.post('/', function(req, res) {
  var translation = __.findWhere(translations, { target: req.body.target});
  if (typeof translation === "undefined") {
    translation = new Translation(req.body.target, req.body.mode, req.body.replacement);
    translations.push(translation);
  } else {
    translation.mode = req.body.mode;
    translation.replacement = req.body.replacement;
  }
  res.status = 200;
  res.send();
});

router.delete('/:target', function(req, res) {
  translations = __.reject(translations, { target: req.params.target });
  res.status = 200;
  res.send();
});


module.exports = router;
