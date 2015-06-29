var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

exports.updateLogo = function(req, res) {
  var data = req.body;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('config').update({'type':'logo'},{
      $set: {file: data.rawfile}
    }, function(err, result) {
      if (err) return res.status(500).json(err);
      return res.status(200).json('updated');
    });
  });

};

exports.getLogo = function(req, res) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('config').findOne({'type': 'logo'}, function(err, doc) {
      db.close();
      if (!err) {
        //console.log(doc)
        if (doc !== null && doc.file) {
          return res.status(200).json(doc);
        } else {
          return res.status(200).json('no logo found');
        }
      } else {
        return res.status(500).json('ERROR');
      }
    });
  });
};

exports.clearLogo = function(req, res) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('config').deleteMany({}, function(err, doc) {
      if (!err) {
        db.collection('config').insertOne({
          'type': 'logo'
        }, function(err, result) {
          db.close();
          return res.status(200).json('Logo Cleared');
        });
      } else {
        db.close();
        return res.status(500).json('ERROR');
      }
    });
  });
};
