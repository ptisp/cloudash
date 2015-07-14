require('colors');

var MongoClient = require('mongodb').MongoClient,
  OpenNebula = require('opennebula'),
  config = require('./config');


MongoClient.connect(config.mongodb || process.env.CLOUDY_MONGODB, function(err, db) {
  if (err) throw err;
  exports.mongo = db;
  console.log('(SYSTEM) Connected to MongoDB.'.green);
});


var onehost = config.onehost || process.env.ONE_HOST_DEV || process.env.ONE_HOST;
var oneauth = config.oneauth || process.env.ONE_CREDENTIALS_DEV || process.env.ONE_CREDENTIALS;

exports.one = new OpenNebula(oneauth, onehost);
exports.onehost = onehost.replace(':2633/RPC2', '');
exports.oneauth = oneauth;
