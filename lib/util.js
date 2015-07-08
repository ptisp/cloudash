var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  OpenNebula = require('opennebula'),
  config = require('../config');

var one = new OpenNebula(process.env.ONE_CREDENTIALS_DEV, process.env.ONE_HOST_DEV);

module.exports.validateGlobalResources = function(mem, cpu, hdd, cb, req) {
  var mmemory = config.resources.memory;
  var mcpu = config.resources.cpu;
  var mstorage = config.resources.storage;

  if (req && req.user) {
    mmemory = req.user.maxresources.memory;
    mcpu = req.user.maxresources.cpu;
    mstorage = req.user.maxresources.storage;
  }

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
        if (totalMemory + (mem || 0) <= mmemory && totalCPU + (cpu || 0) <= mcpu && totalDisk + (hdd || 0) <= mstorage) {
          cb(undefined, true);
        } else {
          cb(undefined, false);
        }
      }
    });
  });
};
