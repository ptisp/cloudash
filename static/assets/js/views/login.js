window.LoginView = Backbone.View.extend({
  events: {
    'click .btnlogin': 'logina'
  },
  createhash: function(input) {
    return CryptoJS.MD5(input).toString();
  },
  logina: function() {
    var self = this;
    var user = $('.usernameinput').val();
    var pass = this.createhash($('.passwordinput').val());
    modem('GET', 'login/'+user+'/'+pass,
      function(json) {
        self.log(user, pass);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json.message);
      }
    );
  },

  log: function (user, hash) {
    var credential = user + ':' + hash;
    window.sessionStorage.setItem('keyo', btoa(credential));

    window.profile = new Profile();
    window.profile.fetch(function () {
      window.logged = true;
      app.navigate('/home', {
        trigger: true
      });
    }, function () {
      console.log('Login failed');
    });

  },

  render: function() {
    $(this.el).html(this.template());

    return this;
  }

});
