var express = require('express')
  , router = express.Router()
  , __ = require('underscore')
  ;

var Translation = function(target, mode, replacement) {
  this.target = target;
  this.mode = mode;
  this.replacement = replacement;
};

var translations = [
  new Translation("mushroom", "simple", "god-damned mushroom"),
  new Translation("pirogue", "simple", "hot pocket"),
  new Translation("stew", "simple", "meat slop"),
];

router.get('/', function(req, res) {
  res.send(translations);
});

router.get('/:target', function(req, res) {
  var translation = __.findWhere(translations, { target: req.params.target });
  res.send(translation);
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
