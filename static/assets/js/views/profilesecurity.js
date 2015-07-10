window.ProfileSecurityView = Backbone.View.extend({
  events: {
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.profile-security', this.el).i18n();

    $('.profilemenu li').removeClass('active');
    $('#profilesecurity').parent().addClass('active');

    return this;
  }
});
