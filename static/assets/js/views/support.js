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
  render: function() {
    $(this.el).html(this.template());
    $('#gotohome').removeClass('active');
    $('#gotosupport').addClass('active');
    $('.support', this.el).i18n();
    return this;
  }

});
