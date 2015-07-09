window.ProfileMenuView = Backbone.View.extend({
  events: {},

  render: function() {
    $(this.el).html(this.template());
    $('.profile-menu', this.el).i18n();
    return this;
  }

});
