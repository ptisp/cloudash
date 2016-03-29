var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  fs = require('fs'),
  crypto = require('crypto');

console.log('Running install script.');

try {
  fs.statSync('./config.js').isFile();
} catch (err) {
  console.log('ERROR: config.js missing!');
  process.exit(1);
}

var config = require('./config');
var password = Math.random().toString(36).substr(2, 12);

var insertUser = function(db, callback) {
  db.collection('users').insertOne({
    'auth': {
      'username': 'admin',
      'password': crypto.createHash('md5').update(password).digest("hex")
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
    console.log('Login with username: admin and password: ' + password + ' at ' + config.url);
  });
});
