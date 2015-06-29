var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var OpenNebula = require('opennebula');

var one = new OpenNebula(process.env.ONE_CREDENTIALS_DEV, process.env.ONE_HOST_DEV);

exports.createVm = function(req, res) {
  var data = req.body;

  var template = one.getTemplate(0);

  //data.details.ram - megas
  //data.details.vcpu - cores
  //data.details.disk - gb
  //data.details.image - centos6, centos7, ubuntu14.04, debian7, sandbox

  //template.instantiate(data.details.hostname, undefined, undefined, function(err, vm) {
  one.createVM('NAME="' + data.details.hostname + '"\nGRAPHICS=[TYPE="vnc",LISTEN="0.0.0.0"]\nMEMORY="' + (data.details.ram || 1024) + '"\nVCPU="' + (data.details.vcpu || 1) + '"\nOS=[ARCH="x86_64"]\nNIC=[NETWORK="cloud"]\nCPU="0.5"\n DISK=[IMAGE="' + (data.details.image) + '",IMAGE_UNAME="oneadmin"]\n', false, function(err, vm) {

    if (err) {
      console.log(err.toString());
      return res.status(500).json({
        'error': 'Error creating VM (VIRT)'
      });
    }

    MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
      var cursor = db.collection('vm').insertOne({
        'type': 'opennebula',
        'providerId': vm.id,
        'owner': data.owner,
        'details': data.details
      }, function(err, result) {
        if (err) return res.status(500).json({
          'error': 'Error creating VM (DB)'
        });
        return res.status(200).json({
          'id': result.insertedId
        });
      });
    });
  });
};

exports.deleteVm = function(req, res) {
  var vmID = req.params.id;

  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var vms = db.collection('vm');
    
    vms.findOne(query, function(err, doc) {

      if (err) {
        db.close();
        return res.status(500).json({
          'error': 'Error deleting VM (DB1)'
        });
      }

      var vm = one.getVM(doc.providerId);
      vm.action('delete', function(err, data) {
        if (err) {
          db.close();
          console.log(err.toString());
          return res.status(500).json({
            'error': 'Error deleting VM (VIRT)'
          });
        }

        vms.remove({
          _id: ObjectID(doc._id)
        }, function(err, result) {
          db.close();
          if (err) return res.status(500).json({
            'error': 'Error deleting VM (DB1)'
          });
          return res.status(200).json({
            'id': doc_id
          });
        });
      });

    });
  });
};

exports.vmDetails = function(req, res) {
  var vmID = req.params.id;
  var query = {
    _id: ObjectId(vmID)
  };
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
