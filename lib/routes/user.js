var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

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
  if (req.user.type !== 'admin' && req.params.user !== req.user.auth.username) {
    return res.status(401).json({
      'result': 'nok',
      'message': 'access denied'
    });
  }

  var data = req.params.user;

  var query = {};
  if (data.indexOf('@') > -1) {
    query = {
      'auth.username': data
    };
  } else {
    query = {
      _id: ObjectId(data)
    };
  }
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('users').findOne(query, function(err, doc) {
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

exports.createUser = function(req, res) {
  var data = req.body;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('users').insertOne({
      'auth': data.auth,
      'about': data.about,
      'address': data.address,
      'details': {
        'created': new Date().getTime(),
        'lastlogin': '',
        'lastip': ''
      },
      'type': data.type,
      'status': 'active'
    }, function(err, result) {
      if (err) return res.status(500).json(err);
      return res.status(200).json('Utilizador Adicionado');
    });
  });
};

exports.updateUser = function(req, res) {
  if (req.user.type !== 'admin' && req.params.user !== req.user.auth.username) {
    return res.status(401).json({
      'result': 'nok',
      'message': 'access denied'
    });
  }

  query = {
    _id: ObjectId(req.params.id)
  };
  var data = req.body;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var user = db.collection('users');
    user.findOne(query, function(err, doc) {
      if (err) {
        db.close();
        return res.status(500).json('ERROR');
      }
      if (doc === null) {
        db.close();
        return res.status(404).json('no user found');
      }
      doc.about = data.about;
      doc.address = data.address;
      doc.maxresources = data.maxresources;
      doc.type = data.type;
      doc.status = data.status;
      user.update({
        _id: ObjectId(doc._id)
      }, doc, function(err, output) {
        db.close();
        if (err) {
          return res.status(500).json({
            'error': 'Error saving USER details (DB)'
          });
        }
        return res.status(200).json(doc);
      });
    });
  });
};

exports.getLogs = function(req, res) {
  var query = {};
  if (req.user.type !== 'admin') query.user = req.user.auth.username;

  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('logs').find(query);
    var output = [];
    cursor.each(function(err, doc) {
      db.close();
      if (doc !== null) {
        output.push({
          'user': doc.user,
          'time': doc.time,
          'action': doc.request.method + ' - ' + doc.request.url
        });
      } else {
        return res.status(200).json(output);
      }
    });
  });
};
