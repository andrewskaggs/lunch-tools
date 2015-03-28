var express = require('express')
  , router = express.Router()
  ;

router.get('/', function(req, res) {
  res.render('translate.html', { title: 'Lunch Translator API' });
});

router.post('/', function(req, res) {
  if (req.body === null || req.body.lunch === null) {
    res.status = 400;
    res.send( { message: '\'lunch\' missing' } );
  } else {
    var lunch = req.body.lunch;
    req.db.get('translations').find({},{},
      function(err, result) {
        result.forEach(
          function(value, index, array1){
            lunch = lunch.replace(new RegExp(value.target, 'i'), value.replacement);
          });
        res.status = 200;
        res.send(lunch);
      });
  }
});

module.exports = router;
