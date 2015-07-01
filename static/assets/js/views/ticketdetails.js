window.TicketDetailsView = Backbone.View.extend({
  events: {

  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    console.log(this.model);
    return this;
  }

});
