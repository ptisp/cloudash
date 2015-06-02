window.VMDetailsView = Backbone.View.extend({
  events: {
  },

  render: function() {
    $(this.el).html(this.template());
    $('.vm-details', this.el).i18n();

    return this;
  }

});
