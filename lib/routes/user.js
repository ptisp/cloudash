var ObjectId = require('mongodb').ObjectID,
  vendors = require('../../vendors');

exports.validateLogin = function(req, res) {
  return res.status(200).json(req.user);
};

exports.listUsers = function(req, res) {
  var cursor = vendors.mongo.collection('users').find();
  var found = [];
  cursor.each(function(err, doc) {
    if (doc !== null) {
      delete doc.auth.password;
      found.push(doc);
    } else {
      if (found.length < 1) {
        return res.status(404).json({
          'error': 'Error fetching users (DB)'
        });
      } else {
        return res.status(200).json(found);
      }
    }
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
  var cursor = vendors.mongo.collection('users').findOne(query, function(err, doc) {
    if (err || !doc) {
      return res.status(200).json({
        'error': 'Error fetching user (DB)'
      });
    }
    return res.status(200).json(doc);
  });
};

exports.removeUser = function(req, res) {
  if (req.user.type !== 'admin' && req.params.user !== req.user.auth.username) {
    return res.status(401).json({
      'error': 'access denied'
    });
  }


  var cursor = vendors.mongo.collection('users').remove({
    _id: ObjectId(req.params.user)
  }, function(err, doc) {
    if (err) return res.status(500).json({
      'error': 'Error deleting user (DB)'
    });
    return res.status(200).json({
      'id': doc._id
    });
  });

};

exports.createUser = function(req, res) {
  var data = req.body;

  var cursor = vendors.mongo.collection('users').insertOne({
    'auth': data.auth,
    'about': data.about,
    'address': data.address,
    'details': {
      'created': new Date().getTime(),
      'lastlogin': '',
      'lastip': ''
    },
    'maxresources': data.maxresources,
    'type': data.type,
    'status': 'active'
  }, function(err, result) {
    if (err) return res.status(500).json(err);
    return res.status(200).json({
      'username': data.auth.username
    });
  });
};

exports.updateUser = function(req, res) {
  var id = req.params.user || req.user._id;

  if (req.user.type !== 'admin' && req.params.user !== req.user._id.toString()) {
    return res.status(401).json({
      'error': 'access denied'
    });
  }

  query = {
    _id: ObjectId(id)
  };
  var data = req.body;

  var user = vendors.mongo.collection('users');
  user.findOne(query, function(err, doc) {
    if (err || !doc) {
      return res.status(500).json({
        'error': 'Error fetching user (DB)'
      });
    }
    if (data.auth && data.auth.password) {
      doc.auth.password = data.auth.password;
    }
    if (data.auth && data.auth.ssh) {
      doc.auth.ssh = data.auth.ssh;
    }
    doc.about = data.about;
    doc.address = data.address;
    doc.maxresources = data.maxresources;
    doc.type = data.type;
    doc.status = data.status;
    user.update({
      _id: ObjectId(doc._id)
    }, doc, function(err, output) {
      if (err) {
        return res.status(500).json({
          'error': 'Error saving USER details (DB)'
        });
      }
      return res.status(200).json(doc);
    });
  });
};

exports.getLogs = function(req, res) {
  var query = {};
  if (req.user.type !== 'admin') query.user = req.user.auth.username;

  var cursor = vendors.mongo.collection('logs').find(query);
  var output = [];
  cursor.each(function(err, doc) {
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
};
