window.ProfileSecurityView = Backbone.View.extend({
  events: {
    'click .update': 'updatepwd',
  },
  updatepwd: function(evt) {

    var user = {
      'auth': {},
      'about': {
        'name': this.model.get('name'),
        'phone': this.model.get('phone'),
        'nif': this.model.get('nif')
      },
      'address': {
        'street': this.model.get('street'),
        'city': this.model.get('city'),
        'country': this.model.get('country'),
        'zip': this.model.get('zip')
      },
      'maxresources': {
        'memory': this.model.get('memory'),
        'storage': this.model.get('storage'),
        'cpu': this.model.get('cpu')
      },
      'type': this.model.get('type'),
      'status': this.model.get('status')
    };
    if ($(evt.target).attr('data-action') === 'pwd') {
      if (! this.passwordcheck($('.ippass').val(), $('.iprepass').val())) {
        showError('ERRO! ', 'Verifique a password');
        return;
      } else {
        user.auth.password = CryptoJS.MD5($('.iprepass').val()).toString();
      }
    } else {
      user.auth.ssh = $('.sshkey').val();
    }
    console.log(user);
    modem('PUT', 'user/'+this.model.get('id'),
      function(json) {
        showSuccess('Sucesso!', 'Utilizador Modificado');
        //console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }, user
    );
  },
  passwordcheck: function(pass, repass) {
    pass = pass.trim();
    repass = repass.trim();
    if (pass == repass && pass.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.profile-security', this.el).i18n();

    $('.profilemenu li').removeClass('active');
    $('#profilesecurity').parent().addClass('active');

    return this;
  }
});
