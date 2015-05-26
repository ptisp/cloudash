var MongoClient = require('mongodb').MongoClient;

exports.validateLogin = function(req, res) {
  return res.status(200).json(req.user);
};

exports.listUsers = function(req, res) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('users').find();
    var found = [];
    cursor.each(function(err, doc) {
      db.close();
      if (doc !== null) {
        delete doc.auth.password;
        found.push(doc);
      } else {
        if (found.length < 1) {
          return res.status(404).json('contact support');
        } else {
          return res.status(200).json(found);
        }
      }
    });
  });
};

exports.removeUser = function(req, res) {};

exports.createUser = function(req, res) {};

exports.updateUser = function(req, res) {};
