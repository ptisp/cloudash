window.HomeView = Backbone.View.extend({
  events: {
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));

    return this;
  }

});
