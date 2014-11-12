var __ = require('underscore');
var express = require('express');
var router = express.Router();

var Translation = function(target, mode, replacement) {
  this.target = target;
  this.mode = mode;
  this.replacement = replacement;
};

var translations = [
  new Translation("mushrooms", "simple", "FUCKING MUSHROOMS"),
  new Translation("pirogue", "simple", "hot pocket"),
];

/* GET home page. */
router.get('/', function(req, res) {
  res.send(translations);
});

router.get('/:target', function(req, res) {
  var lunch = __.findWhere(translations, { target: req.params.date })
  var translation = translations[0];
  res.send(translation);
});

module.exports = router;
