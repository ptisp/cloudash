require('colors');

var MongoClient = require('mongodb').MongoClient,
  OpenNebula = require('opennebula'),
  config = require('./config');


MongoClient.connect(config.mongodb || process.env.CLOUDY_MONGODB, function(err, db) {
  if (err) throw err;
  exports.mongo = db;
  console.log('(SYSTEM) Connected to MongoDB.'.green);
});


exports.one = new OpenNebula(config.oneauth || process.env.ONE_CREDENTIALS_DEV || process.env.ONE_CREDENTIALS, config.onehost || process.env.ONE_HOST_DEV || process.env.ONE_HOST);
