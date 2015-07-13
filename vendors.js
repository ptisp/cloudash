require('colors');

var MongoClient = require('mongodb').MongoClient,
  OpenNebula = require('opennebula');

MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
  if (err) throw err;
  exports.mongo = db;
  console.log('(SYSTEM) Connected to MongoDB.'.green);
});


exports.one = new OpenNebula(process.env.ONE_CREDENTIALS_DEV || process.env.ONE_CREDENTIALS, process.env.ONE_HOST_DEV || process.env.ONE_HOST);
