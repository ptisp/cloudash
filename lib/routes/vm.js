var MongoClient = require('mongodb').MongoClient;

exports.createVm = function(req, res) {};
exports.deleteVm = function(req, res) {};
exports.vmDetails = function(req, res) {};

exports.vmList = function(req, res) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('vm').find();
    var found = [];
    cursor.each(function(err, doc) {
      db.close();
      if (doc !== null) {
        found.push(doc);
      } else {
        return res.status(200).json(found);
      }
    });
  });
};
