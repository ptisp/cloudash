var basicAuth = require('basic-auth'),
  async = require('async'),
  MongoClient = require('mongodb').MongoClient;

module.exports = function(req, res, next) {
  var login = basicAuth(req);

  if (login && login.name) {
    login.name = login.name.toLowerCase();
  }

  var user = login.name;
  var pass = login.pass;

  async.waterfall([

    function(callback) {
      if (!user || !pass || user.trim().length === 0 || pass.trim().length === 0) {
        return callback('no authentication data received');
      }

      MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
        var cursor = db.collection('users').findOne({
          'auth.username': user,
          'auth.password': pass
        }, function(err, doc) {
          db.close();
          if (!err && doc !== null) {
            if (doc.status === 'active') {
              delete doc.auth.password;
              callback(undefined, doc);
            } else {
              callback('contact administrator');
            }
          } else {
            return callback('invalid authentication');
          }
        });
      });
    }
  ], function(err, user) {
    if (err || !user) {
      return res.status(401).json({
        'result': 'nok',
        'message': 'access denied'
      });
    }

    req.user = user;
    req.user.ipaddress = req.headers['x-forwarded-for'] || req._remoteAddress;

    next();
  });
};
