var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  ObjectId = require('mongodb').ObjectID,
  url = 'mongodb://localhost:27017/cloudy';

exports.validatelogin = function(req, res) {
  var user = req.params.user;
  var pass = req.params.pass;
  //console.log(user +' - '+pass);
  var finduserexist = function(db) {
    var cursor = db.collection('users').find({ 'auth.username': user, 'auth.password': pass });
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
        if (doc.status === 'active'){
          delete doc.auth.password;
          db.close();
          return res.status(200).json({
            'result': 'ok',
            'output': doc
          });
        } else {
          db.close();
          return res.status(500).json({
            'result': 'nok',
            'message': 'Please contact admin'
          });
        }
      } else {
        db.close();
        return res.status(500).json({
          'result': 'nok',
          'message': 'Invalid User / Password'
        });
      }
    });
  };
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    finduserexist(db, function() {
      db.close();
    });
  });
};

exports.updateuser = function(req, res) {
  var update = function(db) {
    db.collection('restaurants').updateOne(
      {

      },
      function(err, results) {
        console.log(results);
        callback();
      }
    );
  };
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    update(db, function() {
      db.close();
    });
  });
};
