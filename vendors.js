require('colors');

var MongoClient = require('mongodb').MongoClient,
  OpenNebula = require('opennebula'),
  config = require('./config'),
  emailjs = require('emailjs');

MongoClient.connect(config.mongodb || process.env.CLOUDY_MONGODB, function(err, db) {
  if (err) throw err;
  exports.mongo = db;
  console.log('(SYSTEM) Connected to MongoDB.'.green);
});

exports.email = function(message, destination, subject, from, callback) {
  var email = emailjs.server.connect({
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    host: process.env.MAIL_HOST
  });

  email.send({
    text: message,
    'reply-to': from || process.env.MAIL_USER,
    from: from || process.env.MAIL_USER,
    to: destination || 'pedrodias@ptisp.pt',
    subject: subject || 'API Notification!'
  }, function(err, message) {
    if (callback) callback(err, message);
  });
};


var onehost = process.env.ONE_HOST_DEV || process.env.ONE_HOST;
var oneauth = process.env.ONE_CREDENTIALS_DEV || process.env.ONE_CREDENTIALS;

if(config.providers.one) {
  onehost = config.providers.one.host;
  oneauth = config.providers.one.auth;
}

exports.one = new OpenNebula(oneauth, onehost);
exports.onehost = onehost.replace(':2633/RPC2', '');
exports.oneauth = oneauth;
exports.onesunstone = config.providers.one.sunstone;
exports.onenetwork = config.providers.one.network;
