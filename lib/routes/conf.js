var ObjectId = require('mongodb').ObjectID,
  config = require('../../config'),
  vendors = require('../../vendors');

exports.getResources = function(req, res) {
  if (req.user.type !== 'admin') {
    res.status(200).json(req.user.maxresources);
  } else {
    res.status(200).json(config.resources);
  }
};

exports.updateLogo = function(req, res) {
  var data = req.body;
  var cursor = vendors.mongo.collection('config').update({
    'type': 'logo'
  }, {
    $set: {
      file: data.rawfile,
    }
  }, function(err, result) {
    if (err) return res.status(500).json(err);
    return res.status(200).json({});
  });
};

exports.updateSupport = function(req, res) {
  var data = req.body;
  var cursor = vendors.mongo.collection('config').update({
    'type': 'logo'
  }, {
    $set: {
      support: data.support,
    }
  }, function(err, result) {
    if (err) return res.status(500).json(err);
    return res.status(200).json({});
  });
};

exports.getLogo = function(req, res) {
  var cursor = vendors.mongo.collection('config').findOne({
    'type': 'logo'
  }, function(err, doc) {
    if (!err) {
      if (doc !== null) {
        return res.status(200).json(doc);
      } else {
        return res.status(404).json({
          'error': 'Not Found'
        });
      }
    } else {
      return res.status(500).json({
        'error': 'Failed to fetch logo'
      });
    }
  });
};

exports.clearLogo = function(req, res) {
  var support = req.body;
  var config = vendors.mongo.collection('config');
  config.deleteMany({}, function(err, doc) {
    if (!err) {
      config.insertOne({
        'type': 'logo',
        support: support.support
      }, function(err, result) {
        return res.status(200).json({});
      });
    } else {
      return res.status(500).json({
        'error': 'Failed to reset logo'
      });
    }
  });
};
