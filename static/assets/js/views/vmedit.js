window.VMEditView = Backbone.View.extend({
  events: {
  },

  render: function() {
    $(this.el).html(this.template());
    $('.vm-edit', this.el).i18n();

    return this;
  }

});
