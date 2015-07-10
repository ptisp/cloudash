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
  var cursor = vendors.mongo.collection('configs').update({
    'name': 'logo'
  }, {
    'name': 'logo',
    'value': data.rawfile,
  }, {
    upsert: true
  }, function(err, result) {
    if (err) return res.status(500).json(err);
    return res.status(200).json({});
  });
};

exports.updateSupport = function(req, res) {
  var data = req.body;
  var cursor = vendors.mongo.collection('configs').update({
    'name': 'support'
  }, {
    'name': 'support',
    'value': data.support
  }, {
    upsert: true
  }, function(err, result) {
    if (err) return res.status(500).json(err);
    return res.status(200).json({});
  });
};

exports.getConfigs = function(req, res) {
  var cursor = vendors.mongo.collection('configs').find({});
  var found = [];
  cursor.each(function(err, doc) {
    if (doc !== null) {
      found.push(doc);
    } else {
      return res.status(200).json(found);
    }
  });
};

exports.clearLogo = function(req, res) {
  var support = req.body;
  var config = vendors.mongo.collection('configs');
  config.deleteMany({}, function(err, doc) {
    if (!err) {
      config.insertOne({
        'name': 'logo'
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
