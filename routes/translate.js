var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('translate.html', { title: 'Lunch Translater API' });
});

module.exports = router;
