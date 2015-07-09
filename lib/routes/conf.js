var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  config = require('../../config');

exports.getResources = function(req, res) {
  if (req.user.type !== 'admin') {
    res.status(200).json(req.user.maxresources);
  } else {
    res.status(200).json(config.resources);
  }
};

exports.updateLogo = function(req, res) {
  var data = req.body;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('config').update({
      'type': 'logo'
    }, {
      $set: {
        file: data.rawfile,
      }
    }, function(err, result) {
      if (err) return res.status(500).json(err);
      return res.status(200).json({});
    });
  });
};

exports.updateSupport = function(req, res) {
  var data = req.body;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('config').update({
      'type': 'logo'
    }, {
      $set: {
        support: data.support,
      }
    }, function(err, result) {
      if (err) return res.status(500).json(err);
      return res.status(200).json({});
    });
  });
};

exports.getLogo = function(req, res) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('config').findOne({
      'type': 'logo'
    }, function(err, doc) {
      db.close();
      if (!err) {
        //console.log(doc)
        if (doc !== null) {
          return res.status(200).json(doc);
        }
      } else {
        return res.status(500).json({
          'error': 'Failed to fetch logo'
        });
      }
    });
  });
};

exports.clearLogo = function(req, res) {
  var support = req.body;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var config = db.collection('config');
    config.deleteMany({}, function(err, doc) {
      if (!err) {
        config.insertOne({
          'type': 'logo',
          support: support.support
        }, function(err, result) {
          db.close();
          return res.status(200).json({});
        });
      } else {
        db.close();
        return res.status(500).json({
          'error': 'Failed to reset logo'
        });
      }
    });
  });
};
