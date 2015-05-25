window.HeaderView = Backbone.View.extend({
  events: {
    'click .manprofile': 'gtmprofile',
    'click .manusers': 'gtmusers',
    'click .logout': 'gtlogout'
  },
  gtlogout: function() {
    app.navigate('/login', {
      trigger: true
    });
  },
  gtmprofile: function() {
    app.navigate('/manage/profile', {
      trigger: true
    });
  },
  gtmusers: function() {
    app.navigate('/manage/account', {
      trigger: true
    });
  },
  getgravatar: function() {
    var pic = this.model.get('gravatar');
    $('.headgravatar',this.el).attr('src','http://www.gravatar.com/avatar/'+pic);
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    this.getgravatar();
    $('.header', this.el).i18n();
    return this;
  }

});
