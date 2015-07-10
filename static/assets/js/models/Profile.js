 var Profile = Backbone.Model.extend({
  initialize: function() {
  },
  setuser: function(user, after_fetch) {
    var self = this;
    self.set('id', user._id);
    self.set('username', user.auth.username);
    self.set('gravatar', CryptoJS.MD5(user.auth.username).toString());
    self.set('name', user.about.name);
    self.set('phone', user.about.phone);
    self.set('nif', user.about.nif);
    self.set('street', user.address.street);
    self.set('city', user.address.city);
    self.set('country', user.address.country);
    self.set('zip', user.address.zip);
    self.set('type', user.type);
    self.set('status', user.status);
    self.set('memory', user.maxresources.memory);
    self.set('storage', user.maxresources.storage);
    self.set('cpu', user.maxresources.cpu);
    self.set('created', user.details.created);
    self.set('lastlogin', user.details.lastlogin);
    self.set('flastip', user.details.lastip);
    after_fetch();
  },
  fetch: function(user, after_fetch, after_fetch2) {
    var self = this;
    if (user !== null) {
      self.setuser(user, after_fetch);
    } else {
      modem('POST', 'user/login',
        function(json) {
          self.setuser(json, after_fetch);
        },
        function(xhr, ajaxOptions, thrownError) {
          window.profile = null;
          window.sessionStorage.clear();
          if (after_fetch2) after_fetch2();
        }
      );
    }
  }
});
