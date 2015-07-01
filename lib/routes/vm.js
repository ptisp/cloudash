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
      var cursor = db.collection('vms').insertOne({
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
    var vms = db.collection('vms');

    vms.findOne({
      '_id': ObjectId(vmID)
    }, function(err, doc) {

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
          _id: ObjectId(doc._id)
        }, function(err, result) {
          db.close();
          if (err) return res.status(500).json({
            'error': 'Error deleting VM (DB1)'
          });
          return res.status(200).json({
            'id': doc._id
          });
        });
      });
    });
  });
};

exports.vmDetails = function(req, res) {
  var vmID = req.params.id;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var vms = db.collection('vms');
    vms.findOne({
      _id: ObjectId(vmID)
    }, function(err, doc) {
      if (err) {
        db.close();
        return res.status(500).json({
          'error': 'Error getting VM details (VIRT)'
        });
      }
      if (doc === null) {
        db.close();
        return res.status(404).json({
          'error': 'VM not found'
        });
      }

      var vm = one.getVM(doc.providerId);
      vm.info(function(err, data) {
        if (err) {
          db.close();
          return res.status(500).json({
            'error': 'Error getting VM details (VIRT)'
          });
        }

        if (parseInt(data.VM.STATE) >= 3 && parseInt(data.VM.LCM_STATE) === 3) {
          doc.details.status = 'running';
        } else if (parseInt(data.VM.STATE) === 8 && parseInt(data.VM.LCM_STATE) === 0) {
          doc.details.status = 'stopped';
        } else if (parseInt(data.VM.STATE) === 5 && parseInt(data.VM.LCM_STATE) === 0) {
          doc.details.status = 'suspended';
        } else {
          doc.details.status = 'pending';
        }

        doc.details.ip = [];
        doc.details.ip.push(data.VM.TEMPLATE.NIC.IP);

        vms.update({
          _id: ObjectId(doc._id)
        }, doc, function(err, output) {
          db.close();
          if (err) {
            return res.status(500).json({
              'error': 'Error saving VM details (DB)'
            });
          }
          return res.status(200).json(doc);
        });
      });
    });
  });
};

exports.vmList = function(req, res) {
  var query = {};
  if (req.user.type !== 'admin') query.owner = req.user.username;
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('vms').find(query);
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

exports.imageList = function(req, res) {
  one.getImages(function(err, images) {
    if (err) {
      return res.status(500).json({
        'error': 'Error fetching image list (VIRT)'
      });
    }

    var output = [];
    for (var i = 0; i < images.length; i++) {
      output.push(images[i].NAME);
    }

    return res.status(200).json({
      'images': output
    });
  });
};

exports.startVm = function(req, res) {
  var vmID = req.params.id;

  getVM(vmID, function(err, doc) {
    if (err) {
      return res.status(500).json({
        'error': 'Error fetching VM (DB)'
      });
    }

    var vm = one.getVM(doc.providerId);
    vm.action('resume', function(err, data) {
      if (err) {
        console.log(err.toString());
        return res.status(500).json({
          'error': 'Error starting VM (VIRT)'
        });
      }

      return res.status(200).json({
        'id': vmID
      });
    });
  });
};

exports.pauseVm = function(req, res) {
  var vmID = req.params.id;

  getVM(vmID, function(err, doc) {
    if (err) {
      return res.status(500).json({
        'error': 'Error fetching VM (DB)'
      });
    }

    var vm = one.getVM(doc.providerId);
    vm.action('suspend', function(err, data) {
      if (err) {
        console.log(err.toString());
        return res.status(500).json({
          'error': 'Error suspending VM (VIRT)'
        });
      }

      return res.status(200).json({
        'id': vmID
      });
    });
  });
};

exports.stopVm = function(req, res) {
  var vmID = req.params.id;
  var forced = req.params.forced;
  var action = 'poweroff';
  if (forced === true) {
    action = 'poweroff-hard';
  }

  getVM(vmID, function(err, doc) {
    if (err) {
      return res.status(500).json({
        'error': 'Error fetching VM (DB)'
      });
    }

    var vm = one.getVM(doc.providerId);
    vm.action(action, function(err, data) {
      if (err) {
        console.log(err.toString());
        return res.status(500).json({
          'error': 'Error powering off VM (VIRT)'
        });
      }
      return res.status(200).json({
        'id': vmID
      });
    });
  });
};

exports.restartVm = function(req, res) {
  var vmID = req.params.id;
  var forced = req.params.forced;
  var action = 'reboot';
  if (forced === true) {
    action = 'reboot-hard';
  }

  getVM(vmID, function(err, doc) {
    if (err) {
      return res.status(500).json({
        'error': 'Error fetching VM (DB)'
      });
    }

    var vm = one.getVM(doc.providerId);
    vm.action(action, function(err, data) {
      if (err) {
        console.log(err.toString());
        return res.status(500).json({
          'error': 'Error rebooting VM (VIRT)'
        });
      }
      return res.status(200).json({
        'id': vmID
      });
    });
  });
};

exports.statsVm = function(req, res) {
  var vmID = req.params.id;

  getVM(vmID, function(err, doc) {
    if (err) {
      return res.status(500).json({
        'error': 'Error fetching VM (DB)'
      });
    }

    var vm = one.getVM(doc.providerId);
    vm.monitoring(function(err, data) {
      console.log(data);
      if (err) {
        console.log(err.toString());
        return res.status(500).json({
          'error': 'Error fetching VM statistics (VIRT)'
        });
      }

      var output = [];

      for (var i = 0; i < data.MONITORING_DATA.VM.length; i++) {
        output.push({
          'time': data.MONITORING_DATA.VM[i].LAST_POLL,
          'cpu': data.MONITORING_DATA.VM[i].CPU,
          'memory': data.MONITORING_DATA.VM[i].MEMORY,
          'nettx': data.MONITORING_DATA.VM[i].NET_TX,
          'netrx': data.MONITORING_DATA.VM[i].NET_RX
        });
      }

      return res.status(200).json({
        'stats': output
      });
    });
  });
};

function getVM(vmID, callback) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var vms = db.collection('vms');

    vms.findOne({
      '_id': ObjectId(vmID)
    }, function(err, doc) {
      db.close();
      callback(err, doc);
    });
  });
}
