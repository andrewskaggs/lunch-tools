var express = require('express')
  , router = express.Router()
  ;

router.get('/', function(req, res) {
  res.render('translate.html', { title: 'Lunch Translator API' });
});

router.post('/', function(req, res) {
  if (req.body === 'undefined' || req.body.lunch === 'undefined') {
    res.status = 400;
    res.send('must POST a "lunch" param param');
  } else {
    var lunch = req.body.lunch;
    req.db.get('translations').find({},{},
      function(err, result) {
        result.forEach(
          function(value, index, array1){
            lunch = lunch.replace(value.target, value.replacement);
          });
        res.status = 200;
        res.send(lunch);
      });
  }
});

module.exports = router;
