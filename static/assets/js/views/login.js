window.LoginView = Backbone.View.extend({
  events: {
    'submit .form-login': 'logina'
  },
  createhash: function(input) {
    return CryptoJS.MD5(input).toString();
  },
  logina: function() {
    var self = this;

    var user = $('.usernameinput').val();
    var hash = this.createhash($('.passwordinput').val());

    var credential = user + ':' + hash;
    window.sessionStorage.setItem('keyo', btoa(credential));

    modem('POST', 'user/login',
      function(json) {
        self.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },

  log: function (json) {
    window.profile = new Profile();
    window.profile.fetch(json, function () {
      window.logged = true;
      app.navigate('/home', {
        trigger: true
      });
    }, function () {
      console.log('Login failed');
    });

  },

  getlogo: function(){
    var self = this;
    modem('GET', 'config/logo',
      function(json) {
        if (json.file) {
          $('.img-responsive', self.el).attr('src',json.file);
        }
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },

  render: function() {
    $(this.el).html(this.template());
    this.getlogo();
    return this;
  }

});
