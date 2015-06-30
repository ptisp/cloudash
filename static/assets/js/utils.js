var timer = 2500;
var errTimer = 15000;

var showError = function (title, msg) {
  window.scrollTo(0,0);
  $('.dng-title').html(title);
  $('.dng-msg').html(msg);
  $('.alert-danger').show();
  setTimeout(function () {
    $('.alert-danger').hide();
  }, errTimer);
};

var formatdate = function(date) {
  var mes = '' + (date.getMonth() + 1);
  if (mes.length == 1) {
    mes = '0' + mes;
  }
  var dia = '' + date.getDate();
  if (dia.length == 1) {
    dia = '0' + dia;
  }
  var sdate = date.getFullYear() + '/' + mes + '/' + dia;
  var horas = '' + date.getHours();
  if (horas.length == 1) {
    horas = '0' + horas;
  }
  var min = '' + date.getMinutes();
  if (min.length == 1) {
    min = '0' + min;
  }
  var seg = '' + date.getSeconds();
  if (seg.length == 1) {
    seg = '0' + seg;
  }
  sdate += ' - ' + horas + ':' + min + ':' + seg;
  return sdate;
};

var showSuccess = function (title, msg) {
  window.scrollTo(0,0);
  $('.suc-title').html(title);
  $('.suc-msg').html(msg);
  $('.alert-success').show();
  setTimeout(function () {
    $('.alert-success').hide();
  }, errTimer);
};

var showWarning = function (title, msg) {
  window.scrollTo(0,0);
  $('.wrn-title').html(title);
  $('.wrn-msg').html(msg);
  $('.alert-warning').show();
  setTimeout(function () {
    $('.alert-warning').hide();
  }, errTimer);
};

var showInfo = function (title, msg) {
  window.scrollTo(0,0);
  $('.info-title').html(title);
  $('.info-msg').html(msg);
  $('.alert-info').show();
  setTimeout(function () {
    $('.alert-info').hide();
  }, errTimer);
};

var modem = function(type, url, sucess, error, data) {
  $.ajax({
    async: true,
    cache: false,
    type: type || 'GET',
    url: '/api/' + url,
    dataType: 'json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + sessionStorage.keyo);
    },
    data: data,
    success: sucess,
    error: error
  });
};

var base64ArrayBuffer= function(arrayBuffer) {
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;

    var a, b, c, d;
    var chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63; // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];

      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
  };
