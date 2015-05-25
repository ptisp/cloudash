var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var ObjectId = require('mongodb').ObjectID;
var insertUser = function(db, callback) {
  db.collection('users').insertOne({
    'auth': {
      'username': 'admin',
      'password': '685fdb8ff67c6916d71dca92be127c72'
    },
    'about': {
      'name': 'ADMIN',
      'phone': '+000.000000000',
      'nif': '000000000'
    },
    'address': {
      'street': 'Constancia',
      'city': 'Constancia',
      'country': 'Portugal',
      'zip': '0000-00'
    },
    'details': {
      'created': '',
      'lastlogin': '',
      'lastip': ''
    },
    'type': 'suadmin',
    'status': 'active'
  }, function(err, result) {
    assert.equal(err, null);
    console.log("User Inserted into DB");
    callback(result);
  });
};

MongoClient.connect(process.env.CLOUDY, function(err, db) {
  assert.equal(null, err);
  insertUser(db, function() {
    db.close();
  });
});
