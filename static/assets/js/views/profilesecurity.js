window.ProfileSecurityView = Backbone.View.extend({
  events: {
    'click .update': 'updatepwd',
  },
  updatepwd: function(evt) {
    var user = {
      'auth': {}
    };
    if ($(evt.target).attr('data-action') === 'pwd') {
      if (! this.passwordcheck($('.ippass').val(), $('.iprepass').val())) {
        var ettl = ['Error!','Erro!','Error!'];
        var emsg = ['Please check your password', 'Por favor, verifique a sua password', 'Por favor, consultar su contraseña'];
        showError(ettl[getlang()], emsg[getlang()]);
        return;
      } else {
        user.auth.password = $('.iprepass').val();
      }
    } else {
      user.auth.ssh = $('.sshkey').val();
    }
    modem('PUT', 'user/'+this.model.get('id'),
      function(json) {
        var sttl = ['Success!','Sucesso!','Éxito!'];
        var smsg = ['User updated', 'Utilizador actualizado', 'Usuario se actualiza'];
        showSuccess(sttl[getlang()], smsg[getlang()]);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var ettl = ['Error!','Erro!','Error!'];
        var emsg = ['Failed to update user', 'Falha ao atualizar utilizador', 'Error al actualizar el usuario'];
        showError(ettl[getlang()], emsg[getlang()]+'<br>'+json.error);
        showError('ERRO! ', json.error);
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
