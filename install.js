var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  fs = require('fs');

console.log('Running install script.');

try {
  fs.statSync('./config').isFile();
} catch (err) {
  console.log('ERROR: config.js missing!');
  process.exit(1);
}

var config = require('./config');

var insertUser = function(db, callback) {
  db.collection('users').insertOne({
    'auth': {
      'username': 'admin',
      'password': '21232f297a57a5a743894a0e4a801fc3'
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
    'maxresources': {
      'memory': '',
      'storage': '',
      'cpu': ''
    },
    'type': 'admin',
    'status': 'active'
  }, function(err, result) {
    console.log("User Inserted into DB");
    callback(result);
  });
};

MongoClient.connect(config.mongodb || process.env.CLOUDASH_MONGODB, function(err, db) {
  insertUser(db, function() {
    db.close();
    console.log('Installation finished.');
    console.log('Use credentials admin:admin at ' + config.url);
  });
});