window.ProfileMenuView = Backbone.View.extend({
  events: {},

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.profile-menu', this.el).i18n();
    return this;
  }

});
