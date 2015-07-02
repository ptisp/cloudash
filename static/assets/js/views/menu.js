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
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    if (this.model.get('type') !== 'admin') {
      $('.adminonly', this.el).hide();
    }
    $('.menu', this.el).i18n();
    return this;
  }

});
