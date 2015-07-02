Backbone.View.prototype.close = function() {
  this.remove();
  this.unbind();
  this.undelegateEvents();
};

var Router = Backbone.Router.extend({
  currentView: undefined,
  showView: function(view, elem, sub) {
    elem.show();

    if (this.currentView)
      this.currentView.close();
    this.currentView = view;
    this.currentView.delegateEvents();

    var rendered = view.render();
    elem.removeClass('col-sm-12');
    elem.addClass('col-sm-9');
    elem.html(rendered.el);
  },
  routes: {
    '': 'index',
    'login': 'login',
    'home': 'home',
    'vm/add': 'vmadd',
    'vm/edit': 'vmedit',
    'vm/edit/:id': 'vmdetails',
    'manage/profile': 'manprofile',
    'manage/user/:id': 'manuserdetails',
    'manage/account': 'manaccount',
    'domain/dns': 'domaindns',
    'domain/dns/:domain': 'domaindnsdetails',
    'support': 'support',
    'support/:id': 'ticket',
    'config': 'config',
    '*notFound': 'index'
  },
  ticket: function(id) {
    var self = this;
    templateLoader.load(["TicketDetailsView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var t = new Ticket();
          t.fetch(id, function() {
            var v = new TicketDetailsView({
              model: t
            });
            self.showView(v, $('#content'));
          });
        });
      });
    });
  },
  support: function() {
    var self = this;
    templateLoader.load(["SupportView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new SupportView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  config: function() {
    var self = this;
    templateLoader.load(["ConfigView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new ConfigView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  domaindns: function() {
    var self = this;
    templateLoader.load(["DomDnsView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new DomDnsView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  domaindnsdetails: function(domain) {
    var self = this;
    templateLoader.load(["DomDnsDetailsView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new DomDnsDetailsView({
            model: window.profile,
            domain: domain
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  vmadd: function() {
    var self = this;
    templateLoader.load(["VMAddView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new VMAddView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  vmedit: function() {
    var self = this;
    templateLoader.load(["VMEditView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new VMEditView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  vmdetails: function(id) {
    var self = this;
    templateLoader.load(["VMDetailsView"], function() {
      self.verifyLogin(function() {
          var vm = new VM();
          vm.fetch(id, function() {
            var v = new VMDetailsView({
              vm: vm,
              model: vm
            });
            self.showView(v, $('#content'));
          });
      });
    });
  },
  manuserdetails: function(id) {
    var self = this;
    templateLoader.load(["UserDetailsView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new UserDetailsView({
            id: id
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  manprofile: function() {
    var self = this;
    templateLoader.load(["UserProfileView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new UserProfileView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  manaccount: function() {
    var self = this;
    templateLoader.load(["UserAccView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new UserAccView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  initialize: function() {
    this.on('route', function(e) {
      var self = this;
      this.verifyLogin(function() {
        self.loadProfile(function () {
          $('#header').html(new HeaderView({
            model: window.profile
          }).render().el);
          window.scrollTo(0, 0);
          $('#sidemenu').html(new MenuView({
            model: window.profile
          }).render().el);
          $('#footer').html(new FooterView().render().el);
        });
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
      self.loadProfile(function () {
        var homeView = new HomeView({
          model: window.profile
        });
        self.showView(homeView, $('#content'));
      });
    });
  },
  login: function() {
    window.profile = null;
    window.sessionStorage.clear();

    $('#header').html('');
    $('#footer').html('');
    $('#sidemenu').html('');

    $('#content').removeClass('col-sm-9');
    $('#content').addClass('col-sm-12');

    $('#content').html(new LoginView().render().el);

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
  },
  loadProfile: function (dof) {
    if (!window.profile) {
      window.calls = [];
      window.calls.push(dof);
      window.profile = new Profile();
      window.profile.fetch(null, function () {
        var call;
        do {
          call = window.calls.shift();
          if(call) call();
        } while(call !== undefined);
      });
    } else if(!window.profile.get("username")) {
      window.calls.push(dof);
    } else {
      dof();
    }

  },
});


templateLoader.load(['FooterView', 'LoginView', 'HomeView', 'HeaderView', 'MenuView'],
  function() {
    //var language = localStorage.getItem('lang');
    //if (language === null) {
    var  language = 'pt-PT';
    //}

    window.language = language;

    $.i18n.init({
      lng: language,
      ns: {
        namespaces: ['ns.common'],
        defaultNs: 'ns.common'
      },
      useLocalStorage: false,
      useCookie: false,
    }, function (t) {
      app = new Router();
      Backbone.history.start();
    });
  }
);
