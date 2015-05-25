var MongoClient = require('mongodb').MongoClient;

exports.validateLogin = function(req, res) {
  return res.status(200).json(req.user);
};

exports.updateUser = function(req, res) {
  var update = function(db) {
    db.collection('restaurants').updateOne(
      {

      },
      function(err, results) {
        console.log(results);
        callback();
      }
    );
  };
  MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
    update(db, function() {
      db.close();
    });
  });
};

exports.createUser = function(req, res) {
};
