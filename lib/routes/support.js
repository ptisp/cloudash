var ObjectId = require('mongodb').ObjectID,
  vendors = require('../../vendors');

exports.ticketList = function(req, res) {
  var cursor = vendors.mongo.collection('tickets').find();
  var found = [];
  cursor.each(function(err, doc) {
    if (doc !== null) {
      if (req.user.type !== 'admin') {
        if (req.user.auth.username === doc.owner) {
          found.push(doc);
        }
      } else {
        found.push(doc);
      }
    } else {
      return res.status(200).json(found);
    }
  });
};

exports.closeticket = function(req, res) {
  var ticketID = req.params.id;
  var data = req.body;
  data.email = req.user.auth.username;
  var ticket = vendors.mongo.collection('tickets');

  ticket.findOne({
    _id: ObjectId(ticketID)
  }, function(err, doc) {
    if (err) {

      return res.status(500).json({
        'error': 'Error getting Ticket'
      });
    }
    if (doc === null) {
      return res.status(404).json({
        'error': 'Ticket not found'
      });
    }

    doc.status = 'Closed';

    ticket.update({
      _id: ObjectId(ticketID),
    }, doc, function(err, output) {
      if (err) {
        return res.status(500).json({
          'error': 'Error saving Ticket details (DB)'
        });
      }
      return res.status(200).json({
        'result': 'Ticket Closed'
      });
    });
  });
};

exports.replyticket = function(req, res) {
  var ticketID = req.params.id;
  var data = req.body;
  data.email = req.user.auth.username;
  var ticket = vendors.mongo.collection('tickets');

  ticket.findOne({
    _id: ObjectId(ticketID)
  }, function(err, doc) {
    if (err) {
      return res.status(500).json({
        'error': 'Error getting Ticket'
      });
    }
    if (doc === null) {
      return res.status(404).json({
        'error': 'Ticket not found'
      });
    }

    if (doc.status === 'Closed') {
      doc.status = 'Open';
    }
    doc.messages.push(data);

    ticket.update({
      _id: ObjectId(ticketID),
    }, doc, function(err, output) {
      if (err) {
        return res.status(500).json({
          'error': 'Error saving Ticket details (DB)'
        });
      }
      return res.status(200).json({
        'result': 'Reply sent'
      });
    });
  });
};

exports.openTicket = function(req, res) {
  var data = req.body;
  data.message.email = req.user.auth.username;
  var cursor = vendors.mongo.collection('tickets').insertOne({
    'owner': req.user.auth.username,
    'subject': data.subject,
    'messages': data.message,
    'status': 'Open',
    'created': new Date().getTime(),
  }, function(err, result) {
    if (err) return res.status(500).json(err);
    return res.status(200).json({
      'result': 'Ticket criado',
      'id': result.insertedId
    });
  });
};

exports.ticketDetails = function(req, res) {
  var ticketID = req.params.id;

  var ticket = vendors.mongo.collection('tickets');
  ticket.findOne({
    _id: ObjectId(ticketID)
  }, function(err, doc) {
    if (err) {
      return res.status(500).json({
        'error': 'Error getting Ticket'
      });
    }
    if (doc === null) {
      return res.status(404).json({
        'error': 'Ticket not found'
      });
    }
    return res.status(200).json(doc);
  });
};
