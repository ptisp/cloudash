window.ProfileSecurityView = Backbone.View.extend({
  events: {
    'click .updatepwd': 'updatepwd',
    'click .updatekey': 'updatekey',
  },
  updatepwd: function(evt) {
    var user = {
      'auth': {}
    };

    if (!this.passwordcheck($('.ippass').val(), $('.iprepass').val())) {
      var emsg = ['Please check your password', 'Por favor, verifique a sua password', 'Por favor, consultar su contraseña'];
      showError(emsg[getlang()]);
      return;
    } else {
      user.auth.password = $('.iprepass').val();
    }

    this.save(user);
  },
  updatekey: function(evt) {
    var user = {
      'auth': {
        'ssh': $('.sshkey').val()
      }
    };
    this.save(user);
  },
  save: function(user) {
    modem('PUT', 'user',
      function(json) {
        var smsg = ['User updated', 'Utilizador actualizado', 'Usuario se actualiza'];
        showSuccess(smsg[getlang()]);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to update user', 'Falha ao atualizar utilizador', 'Error al actualizar el usuario'];
        showError(emsg[getlang()] + '<br>' + json.error);
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

    if (this.model.get('ssh')) {
      $('.sshkey', this.el).val(this.model.get('ssh'));
    }

    $('.profilemenu li').removeClass('active');
    $('#profilesecurity').parent().addClass('active');

    return this;
  }
});
