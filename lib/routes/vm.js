var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

exports.createVm = function(req, res) {
  var data = req.body;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('vm').insertOne({
      'type': 'opennebula',
      'provider_id': 'xxx',
      'owner': data.owner,
      'details': data.details
    }, function(err, result) {
      if (err) return res.status(500).json(err);
      return res.status(200).json('Vm adicionada');
    });
  });
};

exports.deleteVm = function(req, res) {};

exports.vmDetails = function(req, res) {
  var data = req.params.id;
  var query = {  _id: ObjectId(data) };
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('vm').findOne(query, function(err, doc) {
      db.close();
      if (!err) {
        if (doc !== null) {
          return res.status(200).json(doc);
        } else {
          return res.status(200).json('no vm found');
        }
      } else {
        return res.status(500).json('ERROR');
      }
    });
  });
};

exports.vmList = function(req, res) {
  var data = req.body;
  var query = {};
  if (data.type !== 'admin') query.owner = data.owner;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('vm').find(query);
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
