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
      owner: $('#users option:selected').val()
    };
    modem('PUT', 'vm/' + this.model.get('id') + '/owner',
      function(json) {
        var sttl = ['Success!','Sucesso!','Éxito!'];
        var smsg = ['Owner updated', 'Informação actualizada', 'Información actualizada'];
        showSuccess(sttl[getlang()], smsg[getlang()]);
        app.navigate('/vm/info/' + self.model.get('id') + '/summary', {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var ettl = ['Error!','Erro!','Error!'];
        var emsg = ['Failed to change owner', 'Falha ao actualizar informação', 'Error al actualizar la información'];
        showError(ettl[getlang()], emsg[getlang()]+'<br>'+json.error);
      }, data
    );
  },
  fillselect: function(users) {
    var self = this;
    for (var i = 0; i < users.length; i++) {
      var disabled = false;
      if (users[i]._id === this.model.get('owner')) {
        disabled = true;
      }
      $('#users', self.el)
        .append($("<option></option>")
        .attr("value",users[i]._id)
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
        var ettl = ['Error!','Erro!','Error!'];
        var emsg = ['Failed to load users', 'Falha ao carregar utilizadores', 'Error al cargar los usuarios'];
        showError(ettl[getlang()], emsg[getlang()]+'<br>'+json.error);
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
