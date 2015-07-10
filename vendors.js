require('colors');

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
  if (err) throw err;
  exports.mongo = db;
  console.log('(SYSTEM) Connected to MongoDB.'.green);
});
