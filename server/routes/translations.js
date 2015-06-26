var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  req.db.get('translations').find({},{},
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.jsonp(result);
    });
});

router.get('/:id', function(req, res) {
  if (false == validateObjectId(req)) {
    return res.sendStatus(404);
  }

  req.db.get('translations').find({ _id: req.params.id},{},
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result.length > 0) {
        return res.jsonp(result);
      } else {
        return res.sendStatus(404);
      }
    });
});

router.post('/', function(req, res) {
  if (req.body._id || req.body.id) {
    return res.status(400).send( { message: 'id field is not allowed. Use PUT for updates' } );
  }

  if (!req.body.target) {
    return res.status(400).send( { message: 'target field is required' } );
  }

  if (!req.body.replacement) {
    return res.status(400).send( { message: 'replacement field is required' } );
  }

  var newTranslation = {
    target: req.body.target,
    replacement: req.body.replacement
  }

  req.db.get('translations').insert(newTranslation,
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.sendStatus(204);
    });
});

router.put('/:id', function(req, res) {
  if (false == validateObjectId(req)) {
    return res.sendStatus(404);
  }

  if (!req.body.target) {
    return res.status(400).send( { message: 'target field is required' } );
  }

  if (!req.body.replacement) {
    return res.status(400).send( { message: 'replacement field is required' } );
  }

  req.db.get('translations').findAndModify(
    { _id: req.params.id },
    {$set: { target: req.body.target, replacement: req.body.replacement }},
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result == 0) {
        return res.sendStatus(404);
      }
      return res.sendStatus(204);
    }
  );

});

router.delete('/:id', function(req, res) {
  if (false == validateObjectId(req)) {
    return res.sendStatus(404);
  }

  req.db.get('translations').removeById(req.params.id,
    function(err, result) {
      if (err != null) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (result == 0) {
        return res.sendStatus(404);
      }
      return res.sendStatus(204);
    });
});

// mongo explodes if id is not in right format so we need to validate it
function validateObjectId(req) {
  try {
    var id = req.db.get('translations').id(req.params.id);
    return true;
  } catch (e) {
    console.log('Bad/Missing ObjectId: ' + req.params.id)
    return false;
  }
}

module.exports = router;
