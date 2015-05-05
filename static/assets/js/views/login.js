window.LoginView = Backbone.View.extend({
  events: {
  },

  render: function() {
    $(this.el).html(this.template());

    return this;
  }

});
