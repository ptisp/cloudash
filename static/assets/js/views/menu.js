window.MenuView = Backbone.View.extend({
  events: {
    'click .gotohome': 'gthome'
  },
  gthome: function() {
    app.navigate('/home', {
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
