window.ManageNewUserView = Backbone.View.extend({
  events: {
    'keyup .ipemail': 'availablemail',
    'keyup .iprepass': 'matchpass',
    'click .btnadduser': 'adduser',
  },
  adduser: function() {
    if (this.valemail && this.passwordcheck($('.ippass').val(), $('.iprepass').val())) {
      var user = {
        'auth': {
          'username': $('.ipemail').val(),
          'password': $('.iprepass').val()
        },
        'about': {
          'name': $('.ipname').val(),
          'phone': $('.ipphone').val(),
          'nif': $('.ipvat').val()
        },
        'address': {
          'street': $('.ipaddress').val(),
          'city': $('.ipcity').val(),
          'country': $('.ipcountry option:selected').text(),
          'zip': $('.ipzipcode').val()
        },
        'maxresources': {
          'memory': parseInt($('#newram').val()/2*1024),
          'storage': parseInt($('#newdisk').val()),
          'cpu': parseInt($('#newvcpu').val())
        },
        'type': $('.iptype').val(),
        'status': 'active'
      };
      modem('POST', 'user',
        function(json) {
          var smsg = ['User created', 'Utilizador criado', 'Usuario creado'];
          showSuccess(smsg[getlang()]);
        },
        function(xhr, ajaxOptions, thrownError) {
          var json = JSON.parse(xhr.responseText);
          var emsg = ['Failed to add user', 'Falha ao adicionar utilizador', 'Error al agregar el usuario'];
          showError(emsg[getlang()]+'<br>'+json.error);
        }, user
      );
    } else {
      var wttl = ['Warning!','Aviso!','Advertencia!'];
      var wmsg = ['Please check your email and/or password', 'Por favor, verifique seu e-mail e/ou password', 'Por favor, consultar su correo electrónico y / o contraseña'];
      showWarning(wttl[getlang()], wmsg[getlang()]);
    }
  },
  availablemail: function() {
    var self = this;
    if(this.timeout) {
        clearTimeout(this.timeout);
        $('#invalidemail').hide();
        this.timeout = null;
    }
    this.timeout = setTimeout(function (){
      if (self.validateEmail($('.ipemail').val())) {
        modem('GET', 'user/'+$('.ipemail').val(),
          function(json) {
            if (json.auth) {
              self.valemail = false;
              $('.notificat').html('Email already in use');
              $('#invalidemail').show();
            } else {
              self.valemail = true;
              $('.notification').html('Valid Email');
              $('#invalidemail').show();
            }
          },
          function(xhr, ajaxOptions, thrownError) {
            var json = JSON.parse(xhr.responseText);
            self.valemail = false;
          }
        );
      } else {
        $('.notification').html('Invalid Email');
      }
    }, 2500);
  },
  matchpass: function() {
    if (this.passwordcheck($('.ippass').val(), $('.iprepass').val()) === true) {
      $('.iprepass').css("border-color", "green");
    } else {
      $('.iprepass').css("border-color", "red");
    }
  },
  validateEmail: function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
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
  setslider: function() {
    var self = this;
    modem('GET', 'config/resources',
      function(json) {
        $('#newram', self.el).attr('max',parseInt(json.memory)/1024*2);
        $('#newdisk', self.el).attr('max',parseInt(json.storage));
        $('#newvcpu', self.el).attr('max',parseInt(json.cpu));
      },
      function(xhr, ajaxOptions, thrownError) {}
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.userstable', this.el).html('');
    this.timeout = null;
    this.valemail = false;
    $('.managenewuser', this.el).i18n();
    this.setslider();

    $('.managemenu li').removeClass('active');
    $('#createaccount').parent().addClass('active');

    return this;
  }

});
