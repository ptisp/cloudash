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
          'password': CryptoJS.MD5($('.iprepass').val()).toString()
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
        'type': $('.iptype').val(),
        'status': 'active'
      };
      modem('POST', 'user',
        function(json) {
          console.log(json);
        },
        function(xhr, ajaxOptions, thrownError) {
          var json = JSON.parse(xhr.responseText);
          console.log(json);
        }, user
      );
    } else {
      console.log('Pls check email and/or password');
    }
  },
  availablemail: function() {
    var self = this;
    if(this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    this.timeout = setTimeout(function (){
      if (self.validateEmail($('.ipemail').val())) {
        modem('GET', 'user/'+$('.ipemail').val(),
          function(json) {
            if (json.auth) {
              self.valemail = false;
              $('.notification').html('Email already in use');
            } else {
              self.valemail = true;
              $('.notification').html('Valid Email');
            }
          },
          function(xhr, ajaxOptions, thrownError) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
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
