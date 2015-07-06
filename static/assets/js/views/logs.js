window.LogsView = Backbone.View.extend({
  events: {
  },
  render: function() {
    $(this.el).html(this.template());
    $('.logs', this.el).i18n();
    return this;
  }

});
