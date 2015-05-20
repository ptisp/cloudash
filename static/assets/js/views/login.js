window.LoginView = Backbone.View.extend({
  events: {
    'click .btnlogin': 'login'
  },
  createhash: function(input) {
    return CryptoJS.MD5(input).toString();
  },
  login: function() {
    console.log(this.createhash($('.usernameinput').val()));
    sessionStorage.setItem('user',this.createhash($('.usernameinput').val()));
    app.navigate("/home", {
      trigger: true
    });
  },
  render: function() {
    $(this.el).html(this.template());

    return this;
  }

});
