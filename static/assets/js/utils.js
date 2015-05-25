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
