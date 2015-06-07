var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var collection = req.db.get('translations');
  collection.find({},{},
    function(err, result) {
      if (err === null) {
        res.send(result);
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

router.get('/:id', function(req, res) {
  var collection = req.db.get('translations');
  collection.find({ _id: req.params.id},{},
    function(err, result) {
      if (err === null) {
        res.send(result);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

router.post('/', function(req, res) {
  if (req.body._id) {
    res.status(400).send( { message: '\'_id\' field is not allowed. Use PUT for updates' } );
  }

  if (!req.body.target) {
    res.status(400).send( { message: 'target field is required' } );
  }

  if (!req.body.replacement) {
    res.status(400).send( { message: 'replacement field is required' } );
  }

  req.db.get('translations').insert(req.body,
    function(err, result) {
      if (err === null) {
        res.send();
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

router.put('/:id', function(req, res) {
  req.db.get('translations').findById(req.params.id,
    function(err, result){
      if (err === null) {
        update(result, req, res);
      } else {
        res.status(404).send();
      }
    });
});

function update(translation, req, res) {
  if (req.body.target)
    translation.target = req.body.target;

  if (req.body.replacement)
    translation.replacement = req.body.replacement;

  req.db.get('translations').updateById(translation._id, translation,
    function(err, result) {
      if (err === null) {
        res.send();
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
}

router.delete('/:id', function(req, res) {
  req.db.get('translations').removeById(req.params.id,
    function(err, result) {
      if (err === null) {
        res.send();
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

module.exports = router;
