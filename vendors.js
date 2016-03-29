require('colors');

var MongoClient = require('mongodb').MongoClient,
  OpenNebula = require('opennebula'),
  config = require('./config'),
  emailjs = require('emailjs');

MongoClient.connect(config.mongodb, function(err, db) {
  if (err) throw err;
  exports.mongo = db;
  console.log('(SYSTEM) Connected to MongoDB.'.green);
});


exports.email = function(message, destination, subject, from, callback) {
  var email = emailjs.server.connect({
    user: config.email.user,
    password: config.email.password,
    host: config.email.smtp
  });

  email.send({
    text: message,
    'reply-to': from || config.email.user,
    from: from || config.email.user,
    to: destination,
    subject: subject || 'Cloudash'
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
