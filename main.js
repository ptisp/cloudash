require('colors');

var express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  api = require('./lib/routes/index'),
  auth = require('./lib/http/auth.js'),
  admin = require('./lib/http/admin.js');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(bodyParser());
app.use(errorhandler());

app.post('/api/user/login', auth, api.user.validateLogin);
app.post('/api/user', auth, admin, api.user.createUser);
app.put('/api/user', auth, api.user.updateUser);
app.get('/api/listusers', auth, admin, api.user.listUsers);
app.get('/api/user/:user', auth, api.user.getUser);
app.delete('/api/remove/:user', auth, admin, api.user.removeUser);

app.post('/api/vm/:id/start', auth, api.vm.startVm);
app.post('/api/vm/:id/pause', auth, api.vm.pauseVm);
app.post('/api/vm/:id/stop/:forced', auth, api.vm.stopVm);
app.post('/api/vm/:id/stop', auth, api.vm.stopVm);
app.post('/api/vm/:id/restart/:forced', auth, api.vm.restartVm);
app.post('/api/vm/:id/restart', auth, api.vm.restartVm);
app.post('/api/vm', auth, api.vm.createVm);
app.get('/api/vm/:id/metrics', auth, api.vm.statsVm);

app.get('/api/vm/:id/vnc', auth, api.vm.vmVNC);
app.delete('/api/vm/:id', auth, api.vm.deleteVm);
app.get('/api/vm/:id', auth, api.vm.vmDetails);
app.put('/api/vm/:id', auth, api.vm.vmResize);
app.get('/api/vm', auth, api.vm.vmList);

app.get('/api/image', auth, api.vm.imageList);

app.get('/api/support/:id', auth, api.support.ticketDetails);
app.post('/api/support/:id', auth, api.support.replyticket);
app.delete('/api/support/:id', auth, api.support.closeticket);
app.get('/api/support', auth, api.support.ticketList);
app.post('/api/support', auth, api.support.openTicket);

app.get('/api/config/logo', api.conf.getLogo);
app.delete('/api/config/logo', auth, admin, api.conf.clearLogo);
app.post('/api/config/logo', auth, admin, api.conf.updateLogo);
app.post('/api/config/support', auth, admin, api.conf.updateSupport);
app.get('/api/config/resources', auth, admin, api.conf.getResources);

var port = process.env.PORT || 8080;

console.log('(SYSTEM) Cloudy Panel'.green);

app.listen(port, function () {
  console.log('(PLAIN) Server listening on port %d.'.green, port);
});
