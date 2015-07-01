var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

exports.ticketList = function(req, res) {
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('tickets').find();
    var found = [];
    cursor.each(function(err, doc) {
      db.close();
      if (doc !== null) {
        if (req.user.type !== 'admin') {
          if (req.user.auth.username === doc.owner) {
            found.push(doc);
          }
        } else {
          found.push(doc);
        }
      } else {
        if (found.length < 1) {
          return res.status(404).json('contact support');
        } else {
          return res.status(200).json(found);
        }
      }
    });
  });
};

exports.replyticket = function(req, res) {
  var ticketID = req.params.id;
  var data = req.body;

};

exports.openTicket = function(req, res) {
  var data = req.body;

  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var cursor = db.collection('tickets').insertOne({
      'owner': req.user.auth.username,
      'subject': data.subject,
      'messages': data.message,
      'status': 'InQueue',
      'created': new Date().getTime(),
    }, function(err, result) {
      if (err) return res.status(500).json(err);
      return res.status(200).json('Ticket Enviado');
    });
  });

};

exports.ticketDetails = function(req, res) {
  var ticketID = req.params.id;

  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    var vms = db.collection('tickets');
    vms.findOne({
      _id: ObjectId(ticketID)
    }, function(err, doc) {
      if (err) {
        db.close();
        return res.status(500).json({
          'error': 'Error getting Ticket'
        });
      }
      if (doc === null) {
        db.close();
        return res.status(404).json({
          'error': 'Ticket not found'
        });
      }

      return res.status(200).json(doc);

    });
  });


};
