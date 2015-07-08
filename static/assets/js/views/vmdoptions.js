window.VMDOptionsView = Backbone.View.extend({
  initialize: function(options) {
    this.user = options.user;
  },
  events: {

  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();

    if (this.user.get('type') !== 'admin') {
      app.navigate('/vm/info/'+this.model.get('id')+'/summary', {
        trigger: true
      });
    }

    $('.topmenudetails li').removeClass('active');
    $('#gotooptions').parent().addClass('active');

    return this;
  }

});
