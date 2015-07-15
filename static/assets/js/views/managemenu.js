window.ManageMenuView = Backbone.View.extend({
  events: {
    'click #useraccounts': 'gtusers',
    'click #createaccount': 'gtnewuser'
  },
  gtusers: function() {
    app.navigate('/config/users', {
      trigger: true
    });
  },
  gtnewuser: function() {
    app.navigate('/config/newuser', {
      trigger: true
    });
  },
  render: function() {
    $(this.el).html(this.template());
    $('.managemenu', this.el).i18n();
    $('.menulateral li').removeClass('active');
    return this;
  }

});
