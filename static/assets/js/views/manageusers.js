window.ManageUsersView = Backbone.View.extend({
  events: {
    'keyup .ipemail': 'availablemail',
    'keyup .iprepass': 'matchpass',
    'click .btnadduser': 'adduser',
    'click .btnedit': 'edituser',
    'click .btndelete': 'deleteuser'
  },
  edituser: function(e) {
    console.log($(e.target).attr('data-id'));
    app.navigate('config/user/'+$(e.target).attr('data-id'), {
      trigger: true
    });
  },
  deleteuser: function(e) {
    console.log($(e.target).attr('data-id'));
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
  fillusertable: function(users) {
    var html = '';
    for (var i = 0; i < users.length; i++) {
      html = '<tr><td>'+users[i].about.name+'</td>';
      html += '<td>'+users[i].about.phone+'</td>';
      html += '<td>'+users[i].auth.username+'</td>';
      html += '<td>'+users[i].type+'</td>';
      var enabled = '';
      if (this.model.get('username') === users[i].auth.username) {
        enabled = 'disabled';
      }
      html += '<td><button type="button" class="btn btn-xs btn-success btnedit" data-id="'+users[i]._id+'"><i class="icon-managed"></i> Edit</button><button type="button" class="btn btn-xs btn-danger btndelete" data-id="'+users[i]._id+'" '+enabled+'><i class="icon-delete"></i> Delete</button></td></tr>';
      $('.userstable', this.el).append(html);
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
  getusers: function() {
    var self = this;
    modem('GET', 'listusers',
      function(json) {
        self.fillusertable(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.userstable', this.el).html('');
    this.timeout = null;
    this.valemail = false;
    this.getusers();
    $('.manageusers', this.el).i18n();

    $('.managemenu li').removeClass('active');
    $('#useraccounts').parent().addClass('active');

    return this;
  }

});
