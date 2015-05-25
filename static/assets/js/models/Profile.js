 var Profile = Backbone.Model.extend({
  initialize: function() {
  },
  fetch: function(after_fetch, after_fetch2) {
    var self = this;
    var encrip = sessionStorage.getItem('keyo');

    if (encrip !== null) {
      encrip = atob(encrip);
      var user = encrip.split(':')[0];
      var pass = encrip.replace(user+':','');

      modem('GET', 'user/login',
        function(json) {
          self.set('username', json.output.auth.username);
          self.set('gravatar', CryptoJS.MD5(json.output.auth.username).toString());
          self.set('name', json.output.about.name);
          self.set('phone', json.output.about.phone);
          self.set('nif', json.output.about.nif);
          self.set('street', json.output.address.street);
          self.set('city', json.output.address.city);
          self.set('country', json.output.address.country);
          self.set('zip', json.output.address.zip);
          self.set('type', json.output.type);
          self.set('created', json.output.details.created);
          self.set('lastlogin', json.output.details.lastlogin);
          self.set('flastip', json.output.details.lastip);
          after_fetch();
        },
        function(xhr, ajaxOptions, thrownError) {
          window.profile = null;
          window.sessionStorage.clear();
          if (after_fetch2) after_fetch2();
        }
      );
    } else {
      window.profile = null;
      window.sessionStorage.clear();
      if (after_fetch2) after_fetch2();
    }
  }
});
