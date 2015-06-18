window.MenuView = Backbone.View.extend({
  events: {
    'click .gotohome': 'gthome',
    'click .gotodns': 'gtdns',
    'click .gotosupport': 'gtsupport'
  },
  gtsupport: function() {
    app.navigate('/support', {
      trigger: true
    });
  },
  gthome: function() {
    app.navigate('/home', {
      trigger: true
    });
  },
  gtdns: function() {
    app.navigate('/domain/dns', {
      trigger: true
    });
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    if (this.model.get('type') !== 'admin') {
      $('.adminonly', this.el).hide();
    }
    $('.menu', this.el).i18n();
    return this;
  }

});
