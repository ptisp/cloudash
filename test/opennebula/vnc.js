var request = require('request');
var cookie = '';
var csrftoken = '';

var host = 'http://127.0.0.1:9869/';
var vmid = 1;
var username = 'oneadmin';
var password = 'opennebula';

request.post({
  'url': host + '/login',
  'auth': {
    'user': username,
    'pass': password,
    'sendImmediately': true
  }
}, function(err, res, body) {
  cookie = res.headers['set-cookie'][0].split(';')[0];
  request.get({
    'url': host + '/',
    headers: {
      'Cookie': cookie
    }
  }, function(err, res, body) {
    cookie = cookie + '; ' + res.headers['set-cookie'][0].split(';')[0];

    var aux = body.indexOf('csrftoken') + 11;
    csrftoken = body.slice(aux, aux + 32);

    request.post({
      'url': host + '/vm/' + vmid + '/startvnc',
      headers: {
        'Cookie': cookie
      },
      formData: {
        'csrftoken': csrftoken
      }
    }, function(err, res, body) {
      if (err) {
        return console.error(err);
      }

      //console.log(res.statusCode);
      console.log(JSON.parse(body).token);
    });
  });
});
