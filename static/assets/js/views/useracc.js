window.UserAccView = Backbone.View.extend({
  events: {
  },

  render: function() {
    $(this.el).html(this.template());

    return this;

    // POPOVER & TOOLTIP
	$("[rel='popover']").popover();
	$("[rel='tooltip']").tooltip();
  }

});
