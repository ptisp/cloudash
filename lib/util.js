var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  OpenNebula = require('opennebula'),
  config = require('../config');

var one = new OpenNebula(process.env.ONE_CREDENTIALS_DEV, process.env.ONE_HOST_DEV);

module.exports.validateGlobalResources = function(mem, cpu, hdd, cb, req) {
  var cursor = vendors.mongo.collection('vms').find();
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
      if (totalMemory + (parseInt(mem) || 0) <= config.resources.memory && totalCPU + (parseInt(cpu) || 0) <= config.resources.cpu && totalDisk + (parseInt(hdd) || 0) <= config.resources.storage) {
        if (req.user.type !== 'admin') {
          module.exports.validateUserResources(mem, cpu, hdd, function(err, available) {
            cb(undefined, available);
          }, req);
        } else {
          cb(undefined, true);
        }
      } else {
        cb(undefined, false);
      }
    }
  });
};

module.exports.validateUserResources = function(mem, cpu, hdd, cb, req) {
  var cursor = vendors.mongo.collection('vms').find({
    'owner': req.user.auth.username
  });
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
      if (totalMemory + (mem || 0) <= req.user.maxresources.memory && totalCPU + (cpu || 0) <= req.user.maxresources.cpu && totalDisk + (hdd || 0) <= req.user.maxresources.storage) {
        cb(undefined, true);
      } else {
        cb(undefined, false);
      }
    }
  });
};
