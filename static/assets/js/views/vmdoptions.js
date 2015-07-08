window.VMDOptionsView = Backbone.View.extend({
  initialize: function(options) {
    this.vm = options.vm;
  },
  events: {

  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();

    $('.topmenudetails li').removeClass('active');
    $('#gotooptions').parent().addClass('active');

    return this;
  }

});
