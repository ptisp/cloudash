Backbone.View.prototype.close = function() {
  this.remove();
  this.unbind();
  this.undelegateEvents();
};

var Router = Backbone.Router.extend({
  currentView: undefined,
  showView: function(view, elem, sub) {
    elem.show();

    if (sub === false) {
      if (this.currentView)
        this.currentView.close();

      this.currentView = view;
      this.currentView.delegateEvents();
    }
    var rendered = view.render();
    elem.html(rendered.el);
  },
  routes: {
    '': 'index',
    'login': 'login',
    'home': 'home',
    'vm/add': 'vmadd',
    'vm/edit': 'vmedit',
    'manage/profile': 'manprofile',
    'manage/account': 'manaccount',
    '*notFound': 'index'
  },
  vmadd: function() {
    var self = this;
    templateLoader.load(["VMAddView"], function() {
      self.verifyLogin(function() {
        var v = new VMAddView({
          model: window.profile
        });
        self.showView(v, $('#content'));
      });
    });
  },
  vmedit: function() {
    var self = this;
    templateLoader.load(["VMEditView"], function() {
      self.verifyLogin(function() {
        var v = new VMEditView({
          model: window.profile
        });
        self.showView(v, $('#content'));
      });
    });
  },
  manprofile: function() {
    var self = this;
    templateLoader.load(["UserProfileView"], function() {
      self.verifyLogin(function() {
        var v = new UserProfileView({
          model: window.profile
        });
        self.showView(v, $('#content'));
      });
    });
  },
  manaccount: function() {
    var self = this;
    templateLoader.load(["UserAccView"], function() {
      self.verifyLogin(function() {
        var v = new UserAccView({
          model: window.profile
        });
        self.showView(v, $('#content'));
      });
    });
  },
  initialize: function() {
    this.on('route', function(e) {
      var self = this;
      this.verifyLogin(function() {
        $('#header').html(new HeaderView({
          model: window.profile
        }).render().el);
        window.scrollTo(0, 0);
        $('#footer').html(new FooterView().render().el);
      });
    });
  },
  index: function() {
    this.verifyLogin(function() {
      app.navigate('/home', {
        trigger: true
      });
    });
  },
  home: function() {
    var self = this;
    this.verifyLogin(function() {
      var homeView = new HomeView({
        model: window.profile
      });
      self.showView(homeView, $('#content'));
    });
  },
  login: function() {
    var login = new LoginView();
    $('#header').html('');
    $('#footer').html('');
    $('#content').html(login.render().el);
  },
  verifyLogin: function(loggedFunction) {
    var self = this;
    if (!sessionStorage.keyo) {
      app.navigate('/login', {
        trigger: true
      });
    } else {
      window.logged = true;
      loggedFunction();
    }
  }
});


templateLoader.load(['FooterView', 'LoginView', 'HomeView', 'HeaderView'],
  function() {
    var language = localStorage.getItem('lang');
    if (language === null) {
      language = 'pt-PT';
    }

    window.language = language;

    app = new Router();
    Backbone.history.start();
  }
);
