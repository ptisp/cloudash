require('colors');

var vendors = require('./vendors'),
  express = require('express'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  api = require('./lib/routes/index'),
  auth = require('./lib/http/auth.js'),
  logger = require('./lib/http/logger.js'),
  admin = require('./lib/http/admin.js'),
  config = require('./config');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(bodyParser());
app.use(errorhandler());

app.post('/api/user/login', auth, api.user.validateLogin);
app.get('/api/user/:user/recover/:token', api.user.recoverUserToken);
app.post('/api/user/:user/recover', api.user.recoverUser);
app.post('/api/user', auth, admin, logger, api.user.createUser);
app.put('/api/user/:user', auth, admin, logger, api.user.updateUser);
app.put('/api/user', auth, logger, api.user.updateProfile);
app.get('/api/user/listusers', auth, admin, api.user.listUsers);
app.get('/api/user/:user', auth, api.user.getUser);
app.delete('/api/user/remove/:user', auth, admin, logger, api.user.removeUser);

app.get('/api/logs', auth, api.user.getLogs);

app.post('/api/vm/:id/start', auth, logger, api.vm.startVm);
app.post('/api/vm/:id/pause', auth, logger, api.vm.pauseVm);
app.post('/api/vm/:id/stop/:forced', auth, logger, api.vm.stopVm);
app.post('/api/vm/:id/stop', auth, logger, api.vm.stopVm);
app.post('/api/vm/:id/restart/:forced', auth, logger, api.vm.restartVm);
app.post('/api/vm/:id/restart', auth, logger, api.vm.restartVm);
app.post('/api/vm', auth, logger, api.vm.createVm);
app.put('/api/vm/:id/owner', auth, admin, logger, api.vm.updateVm);
app.get('/api/vm/:id/metrics', auth, api.vm.statsVm);
app.get('/api/vm/:id/vnc', auth, api.vm.vmVNC);
app.delete('/api/vm/:id', auth, logger, api.vm.deleteVm);
app.get('/api/vm/:id', auth, api.vm.vmDetails);
app.put('/api/vm/:id', auth, logger, api.vm.vmResize);
app.get('/api/vm', auth, api.vm.vmList);

app.post('/api/vm/:id/network', auth, api.vm.interfaceAdd);
app.delete('/api/vm/:id/network/:nid', auth, api.vm.interfaceDel);

app.get('/api/image', auth, api.vm.imageList);
app.get('/api/template', auth, api.vm.templateList);

app.get('/api/support/:id', auth, api.support.ticketDetails);
app.post('/api/support/:id', auth, logger, api.support.replyticket);
app.delete('/api/support/:id', auth, logger, api.support.closeticket);
app.get('/api/support', auth, api.support.ticketList);
app.post('/api/support', auth, logger, api.support.openTicket);

app.get('/api/config/resources', auth, api.conf.getResources);
app.get('/api/config', api.conf.getConfigs);
app.delete('/api/config/logo', auth, admin, api.conf.clearLogo);
app.post('/api/config/logo', auth, admin, api.conf.updateLogo);
app.post('/api/config/support', auth, admin, api.conf.updateSupport);

var port = config.port || process.env.CLOUD_PORT || 8080;

console.log('(SYSTEM) Cloudash Dashboard - github.com/ptisp/cloudash'.green);

console.log('(SYSTEM) Starting...'.green);
setTimeout(function() {
  app.listen(port, function() {
    console.log('(SYSTEM) Server listening on port %d.'.green, port);
  });
}, 2000);
