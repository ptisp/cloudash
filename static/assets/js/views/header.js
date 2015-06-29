window.HeaderView = Backbone.View.extend({
  events: {
    'click .newvm': 'gtnewvm',
    'click .manprofile': 'gtmprofile',
    'click .manusers': 'gtmusers',
    'click .btn-config': 'gtconfig',
    'click .logout': 'gtlogout'
  },
  gtconfig: function() {
    app.navigate('/config', {
      trigger: true
    });
  },
  gtnewvm: function() {
    app.navigate('/vm/add', {
      trigger: true
    });
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
    $('.overme', this.el).tooltip();
    if (this.model.get('type') !== 'admin') {
      $('.adminonly', this.el).hide();
    }
    return this;
  }

});
