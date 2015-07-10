var MongoClient = require('mongodb').MongoClient,
  util = require('util');

var collection;
MongoClient.connect(process.env.CLOUDY_MONGODB, function(err, db) {
  if (err) throw err;
  collection = db.collection('logs');
});


module.exports = function(req, res, next) {

  var request = {
    'params': req.params,
    'body': req.body,
    'address': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    'headers': req.headers,
    'url': req.url,
    'method': req.method
  };

  var transaction = {
    'time': new Date().getTime(),
    'user': req.user.auth.username,
    'request': request
  };

  /*
  console.log('------------------');
  console.log(util.inspect(transaction, {
    showHidden: true,
    depth: null
  }));
  */
  console.log(req.method + ' - ' + req.url);

  if (collection) {
    collection.insert(transaction, {
      safe: true,
      w: 1
    }, function(err, docs) {
      if (err) console.log(err);
    });
  } else {
    console.log('WARNING: TRANSACTION NOT LOGGED!!');
  }

  next();
};
