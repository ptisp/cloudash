require('colors');

var express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  api = require('./lib/routes/index'),
  auth = require('./lib/http/auth.js');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(bodyParser());
app.use(errorhandler());

app.post('/api/user/login', auth, api.user.validateLogin);
app.post('/api/user', auth, api.user.createUser);
app.put('/api/user', auth, api.user.updateUser);

app.post('/api/vm', auth, api.vm.createVm);
app.del('/api/vm/:id', auth, api.vm.deleteVm);
app.get('/api/vm/:id', auth, api.vm.vmDetails);
app.get('/api/vm', auth, api.vm.vmList);

var port = process.env.PORT || 8080;

console.log('(SYSTEM) Cloudy Panel'.green);

app.listen(port, function () {
  console.log('(PLAIN) Server listening on port %d.'.green, port);
});
