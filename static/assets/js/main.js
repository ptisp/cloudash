Backbone.View.prototype.close = function() {
  this.remove();
  this.unbind();
  this.undelegateEvents();
};

var Router = Backbone.Router.extend({
  header: undefined,
  footer: undefined,
  sidemenu: undefined,
  vmdetailsmenu: undefined,
  supportmenu: undefined,
  currentView: undefined,
  managemenu: undefined,
  profilemenu: undefined,
  showView: function(view, elem, sub) {
    elem.show();

    if (this.currentView) {
      this.currentView.close();
    }
    this.currentView = view;
    this.currentView.delegateEvents();
    if (!sub) {
      elem.removeClass('col-sm-12');
      elem.addClass('col-sm-9');
    }

    var rendered = view.render();
    elem.html(rendered.el);
  },
  routes: {
    '': 'index',
    'login': 'login',
    'home': 'home',
    'vm/add': 'vmadd',
    'vm/info/:id/summary': 'vmdsummary',
    'vm/info/:id/graphs': 'vmdgraphs',
    'vm/info/:id/console': 'vmdconsole',
    'vm/info/:id/resize': 'vmdresize',
    'vm/info/:id/options': 'vmdoptions',
    'config/users': 'manusers',
    'config/newuser': 'mannewuser',
    'config/user/:id': 'manuserdetails',
    'profile/user': 'profileuser', //tb done
    'profile/security': 'profilesecurity', //tb done
    'support': 'support',
    'support/open': 'supportopen',
    'support/closed': 'supportclosed',
    'support/:id': 'ticket',
    'logs': 'logs',
    'config': 'config',
    '*notFound': 'index'
  },
  logs: function() {
    var self = this;
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["LogsView"], function() {
      self.verifyLogin(function() {
        self.loadProfile(function () {
          var v = new LogsView({
            model: window.profile
          });
          self.showView(v, $('#content'));
        });
      });
    });
  },
  profileuser: function(id) {
    var self = this;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.managemenu = undefined;
    templateLoader.load(["ProfileMenuView", "ProfileUserView"], function() {
      self.verifyLogin(function() {
        if (!self.profilemenu) {
          self.profilemenu = $('#content').html(new ProfileMenuView({}).render().el);
        }
        var vs = new ProfileUserView({
          model: window.profile
        });
        self.showView(vs, $('#tab-content'), true);
      });
    });
  },
  profilesecurity: function(id) {
    var self = this;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.managemenu = undefined;
    templateLoader.load(["ProfileMenuView", "ProfileSecurityView"], function() {
      self.verifyLogin(function() {
        if (!self.profilemenu) {
          self.profilemenu = $('#content').html(new ProfileMenuView({}).render().el);
        }
        var vs = new ProfileSecurityView({
          model: window.profile
        });
        self.showView(vs, $('#tab-content'), true);
      });
    });
  },
  manuserdetails: function(id) {
    var self = this;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["ManageMenuView", "ManageUserDetailsView"], function() {
      self.verifyLogin(function() {
        if (!self.managemenu) {
          self.managemenu = $('#content').html(new ManageMenuView({}).render().el);
        }
        var vs = new ManageUserDetailsView({
          id: id
        });
        self.showView(vs, $('#tab-content'), true);
      });
    });
  },
  manusers: function() {
    var self = this;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu = undefined;
    templateLoader.load(["ManageMenuView", "ManageUsersView"], function() {
      self.verifyLogin(function() {
        if (!self.managemenu) {
          self.managemenu = $('#content').html(new ManageMenuView({}).render().el);
        }
        var vs = new ManageUsersView({
          model: window.profile
        });
        self.showView(vs, $('#tab-content'), true);
      });
    });
  },
  mannewuser: function() {
    var self = this;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["ManageMenuView", "ManageNewUserView"], function() {
      self.verifyLogin(function() {
        if (!self.managemenu) {
          self.managemenu = $('#content').html(new ManageMenuView({}).render().el);
        }
        var vs = new ManageNewUserView({
          model: window.profile
        });
        self.showView(vs, $('#tab-content'), true);
      });
    });
  },
  supportopen: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["SupportView", "SupportOpenView"], function() {
      self.verifyLogin(function() {
        if (!self.supportmenu) {
          self.supportmenu = $('#content').html(new SupportView({

          }).render().el);
        }
        var vs = new SupportOpenView({
          model: window.profile
        });
        self.showView(vs, $('#tab-content'), true);
      });
    });
  },
  supportclosed: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["SupportView", "SupportClosedView"], function() {
      self.verifyLogin(function() {

          if (!self.supportmenu) {
            self.supportmenu = $('#content').html(new SupportView({

            }).render().el);
          }
          var vs = new SupportClosedView({
            model: window.profile
          });
          self.showView(vs, $('#tab-content'), true);

      });
    });
  },
  vmdsummary: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["VMDetailsView", "VMDSummaryView"], function() {
      self.verifyLogin(function() {
          var vm = new VM();
          vm.fetch(id, function() {
            if (!self.vmdetailsmenu) {
              self.vmdetailsmenu = $('#content').html(new VMDetailsView({
                id:id,
                model: window.profile
              }).render().el);
            }
            var vs = new VMDSummaryView({
              user: window.profile,
              model: vm
            });
            self.showView(vs, $('#tab-content'), true);
          });
      });
    });
  },
  vmdgraphs: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["VMDetailsView", "VMDGraphsView"], function() {
      self.verifyLogin(function() {
          var vm = new VM();
          vm.fetch(id, function() {
            if (!self.vmdetailsmenu) {
              self.vmdetailsmenu = $('#content').html(new VMDetailsView({
                id:id,
                model: window.profile
              }).render().el);
            }

            var vs = new VMDGraphsView({
              model: vm
            });
            self.showView(vs, $('#tab-content'), true);
          });
      });
    });
  },
  vmdconsole: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["VMDetailsView", "VMDConsoleView"], function() {
      self.verifyLogin(function() {
          var vm = new VM();
          vm.fetch(id, function() {
            if (!self.vmdetailsmenu) {
              self.vmdetailsmenu = $('#content').html(new VMDetailsView({
                id:id,
                model: window.profile
              }).render().el);
            }

            var vs = new VMDConsoleView({
              model: vm
            });
            self.showView(vs, $('#tab-content'), true);
          });
      });
    });
  },
  vmdresize: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["VMDetailsView", "VMDResizeView"], function() {
      self.verifyLogin(function() {
          var vm = new VM();
          vm.fetch(id, function() {
            if (!self.vmdetailsmenu) {
              self.vmdetailsmenu = $('#content').html(new VMDetailsView({
                id:id,
                model: window.profile
              }).render().el);
            }

            var vs = new VMDResizeView({
              model: vm
            });
            self.showView(vs, $('#tab-content'), true);
          });
      });
    });
  },
  vmdoptions: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
    templateLoader.load(["VMDetailsView", "VMDOptionsView"], function() {
      self.verifyLogin(function() {
          var vm = new VM();
          vm.fetch(id, function() {
            if (!self.vmdetailsmenu) {
              self.vmdetailsmenu = $('#content').html(new VMDetailsView({
                id:id,
                model: window.profile
              }).render().el);
            }
            var vs = new VMDOptionsView({
              user: window.profile,
              model: vm
            });
            self.showView(vs, $('#tab-content'), true);
          });
      });
    });
  },
  ticket: function(id) {
    var self = this;
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
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
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.profilemenu= undefined;
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
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
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
  vmadd: function() {
    var self = this;
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
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
  initialize: function() {
    var self = this;
    this.on('route', function(e) {
      var self = this;
        this.verifyLogin(function() {
          self.loadProfile(function () {
            if (!self.header) {
              self.header = $('#header').html(new HeaderView({
                model: window.profile
              }).render().el);
              window.scrollTo(0, 0);
            }
            if (!self.sidemenu) {
              self.sidemenu = $('#sidemenu').html(new MenuView({
                model: window.profile
              }).render().el);
            }
            if (!self.footer) {
              self.footer = $('#footer').html(new FooterView().render().el);
            }
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
    this.managemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu= undefined;
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
    this.header = undefined;
    this.footer = undefined;
    this.sidemenu = undefined;
    this.vmdetailsmenu = undefined;
    this.supportmenu = undefined;
    this.profilemenu = undefined;
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
    console.log(getKeyo());
    if (!getKeyo()) {
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
    var language = localStorage.getItem('cloudylang');
    if (language === null) {
      language = 'en-US';
    }

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
