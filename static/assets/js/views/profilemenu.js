window.ProfileMenuView = Backbone.View.extend({
  events: {
    'click #profileuser': 'gtuser',
    'click #profilesecurity': 'gtsecurity'
  },
  gtuser: function() {
    app.navigate('/profile/user', {
      trigger: true
    });
  },
  gtsecurity: function() {
    app.navigate('/profile/security', {
      trigger: true
    });
  },
  render: function() {
    $(this.el).html(this.template());
    $('.profile-menu', this.el).i18n();
    $('.menulateral li').removeClass('active');
    return this;
  }

});
