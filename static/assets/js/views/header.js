window.HeaderView = Backbone.View.extend({
  events: {
    'click .newvm': 'gtnewvm',
    'click .manprofile': 'gtmprofile',
    'click .manusers': 'gtmusers',
    'click .btn-config': 'gtconfig',
    'click .logout': 'gtlogout',
    'click .gotohome': 'gthome',
    'click .gotologs': 'gtlogs',
    'click .gotosupport': 'gtsupport'
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
    localStorage.removeItem('keyo');
    app.navigate('/login', {
      trigger: true
    });
  },
  gtmprofile: function() {
    app.navigate('/profile/user', {
      trigger: true
    });
  },
  gtmusers: function() {
    app.navigate('/config/users', {
      trigger: true
    });
  },
  gtlogs: function(e) {
    this.highlight(e);
    app.navigate('/logs', {
      trigger: true
    });
  },
  gtsupport: function(e) {
    this.highlight(e);
    app.navigate('/support/open', {
      trigger: true
    });
  },
  gthome: function(e) {
    this.highlight(e);
    app.navigate('/home', {
      trigger: true
    });
  },
  highlight: function(e) {
    $('.likehref').removeClass('active');
    $(e.target).parent().addClass('active');
  },
  getgravatar: function() {
    var pic = this.model.get('gravatar');
    $('.headgravatar', this.el).attr('src', 'https://www.gravatar.com/avatar/' + pic);
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
