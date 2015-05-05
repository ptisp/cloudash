require('colors');

var express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(bodyParser());
app.use(errorhandler());


var port = process.env.PORT || 8080;

console.log('(SYSTEM) Cloudy Panel'.green);

app.listen(port, function () {
  console.log('(PLAIN) Server listening on port %d.'.green, port);
});
