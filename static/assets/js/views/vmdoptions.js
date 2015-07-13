window.VMDOptionsView = Backbone.View.extend({
  initialize: function(options) {
    this.user = options.user;
  },
  events: {
    'click .btn_change': 'changeowner'
  },
  changeowner: function() {
    var self = this;
    var data = {
      owner: $('#users option:selected').text()
    };
    modem('PUT', 'vm/' + this.model.get('id') + '/owner',
      function(json) {
        showSuccess('SUCESSO', 'Informação alterada');
        app.navigate('/vm/info/' + self.model.get('id') + '/summary', {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }, data
    );
  },
  fillselect: function(users) {
    var self = this;
    for (var i = 0; i < users.length; i++) {
      var disabled = false;
      if (users[i].auth.username === this.model.get('owner')) {
        disabled = true;
      }
      $('#users', self.el)
        .append($("<option></option>")
          .attr("value", users[i].auth.username)
          .prop('disabled', disabled)
          .text(users[i].auth.username));

    }
  },
  getusers: function() {
    var self = this;
    modem('GET', 'user/listusers',
      function(json) {
        self.fillselect(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();

    if (this.user.get('type') !== 'admin') {
      app.navigate('/vm/info/' + this.model.get('id') + '/summary', {
        trigger: true
      });
    } else {
      this.getusers();
    }

    $('.topmenudetails li').removeClass('active');
    $('#gotooptions').parent().addClass('active');

    return this;
  }

});
