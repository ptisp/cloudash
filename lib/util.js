var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  OpenNebula = require('opennebula'),
  config = require('../config');

var one = new OpenNebula(process.env.ONE_CREDENTIALS_DEV, process.env.ONE_HOST_DEV);

module.exports.validateGlobalResources = function(mem, cpu, hdd, cb) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    if (err) cb(err);
    var cursor = db.collection('vms').find();
    var totalMemory = 0;
    var totalCPU = 0;
    var totalDisk = 0;
    cursor.each(function(err, doc) {
      if (err) cb(err);
      if (doc !== null) {
        totalMemory += parseInt(doc.details.ram);
        totalCPU += parseInt(doc.details.vcpu);
        totalDisk += parseInt(doc.details.disk);
      } else {
        db.close();
        if (totalMemory + (mem || 0) <= config.resources.memory && totalCPU <= config.resources.cpu + (cpu || 0) && totalDisk + (hdd || 0) <= config.resources.storage) {
          cb(undefined, true);
        } else {
          cb(undefined, false);
        }
      }
    });
  });
};
