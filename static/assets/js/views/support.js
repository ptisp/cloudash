window.SupportView = Backbone.View.extend({
  events: {
    'click #gotoopen': 'gtopen',
    'click #gotoclosed': 'gtclosed',
  },
  gtopen: function() {
    app.navigate('/support/open', {
      trigger: true
    });
  },
  gtclosed: function() {
    app.navigate('/support/closed', {
      trigger: true
    });
  },
  getconfig: function() {
    var self = this;
    modem('GET', 'config',
      function(json) {
        if (json.support == 'false') {
          app.navigate('/home', {
            trigger: true
          });
        }
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template());
    $('.menulateral li').removeClass('active');
    $('.gotosupport').addClass('active');
    $('.support', this.el).i18n();
    this.getconfig();
    return this;
  }

});
