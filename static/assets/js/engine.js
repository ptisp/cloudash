window.templateLoader = {
  load: function(views, callback) {
    async.mapSeries(views, function(view, callbacki) {
      if (window[view] === undefined) {
        $.getScript('assets/js/views/' + view.replace('View', '').toLowerCase() + '.js', function() {
          if (window[view].prototype.template === undefined) {
            $.get('templates/' + view + '.html', function(data) {
              window[view].prototype.template = _.template(data);
              callbacki();
            }, 'html');
          } else {
            callbacki();
          }
        });
      } else {
        callbacki();
      }
    }, function(error, data) {
      callback();
    });
  }
};
