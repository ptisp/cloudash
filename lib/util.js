var vendors = require('../vendors'),
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
    'owner': ObjectId(req.user._id)
  });
  var totalMemory = 0;
  var totalCPU = 0;
  var totalDisk = 0;
  var totalVMs = 0;
  cursor.each(function(err, doc) {
    if (err) cb(err);
    if (doc !== null) {
      totalMemory += parseInt(doc.details.ram);
      totalCPU += parseInt(doc.details.vcpu);
      totalDisk += parseInt(doc.details.disk);
      totalVMs++;
    } else {
      if ((_isUnlimited(req.user.maxresources.vms) || totalVMs + 1 <= parseInt(req.user.maxresources.vms)) &&
      ((_isUnlimited(req.user.maxresources.memory) || totalMemory + (parseInt(mem) || 0) <= parseInt(req.user.maxresources.memory))) &&
      ((_isUnlimited(req.user.maxresources.cpu) || totalCPU + (parseInt(cpu) || 0) <= parseInt(req.user.maxresources.cpu))) &&
      ((_isUnlimited(req.user.maxresources.storage) || totalDisk + (parseInt(hdd) || 0) <= parseInt(req.user.maxresources.storage)))) {
        cb(undefined, true);
      } else {
        cb(undefined, false);
      }
    }
  });
};

var _isUnlimited = function(value){
  return parseInt(value) === -1;
};
