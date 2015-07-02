window.MenuView = Backbone.View.extend({
  events: {
    'click #gotohome': 'gthome',
    'click #gotosupport': 'gtsupport'
  },
  gtsupport: function(e) {
    this.highlight(e);
    app.navigate('/support', {
      trigger: true
    });
  },
  gthome: function(e) {
    this.highlight(e);
    app.navigate('/home', {
      trigger: true
    });
  },
  highlight: function(e) {
    $('.likehref').removeClass('active');
    $(e.target).parent().addClass('active');
  },
  ticketnumbers: function() {
    var self = this;
    modem('GET', 'support',
      function(json) {
        var count = 0;
        for (var i = 0; i < json.length; i++) {
          if (json[i].status !== 'Closed') {
            count ++;
          }
        }
        $('.badge', self.el).html(count);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Lista Tickets', json.error);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    this.ticketnumbers();
    if (this.model.get('type') !== 'admin') {
      $('.adminonly', this.el).hide();
    }
    $('.menu', this.el).i18n();
    return this;
  }

});
