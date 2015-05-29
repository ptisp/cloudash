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

exports.getUser = function(req, res) {
  var data = req.params.user;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('users').findOne({
      'auth.username': data,
    }, function(err, doc) {
      db.close();
      if (!err) {
        if (doc !== null) {
          return res.status(200).json(doc);
        } else {
          return res.status(200).json('no user found');
        }
      } else {
        return res.status(500).json('ERROR');
      }
    });
  });
};

exports.removeUser = function(req, res) {};

exports.createUser = function(req, res) {};

exports.updateUser = function(req, res) {};
