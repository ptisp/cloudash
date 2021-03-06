window.VMDSummaryView = Backbone.View.extend({
  initialize: function(options) {
    this.user = options.user;
  },
  events: {
    'click .deletevm': 'showmodal',
    'click .btn_delete': 'deletevm',
    'click .actionvm': 'vmaction'
  },
  showmodal: function() {
    $('#delhostname').html(this.model.get('hostname'));
    $('#delip').html(this.model.get('ip'));

    $('#modal_confirm_delete').on('shown', function() {});
    $('#modal_confirm_delete').modal({});
  },
  togglebtn: function(state) {
    $('.actionvm', this.el).removeClass('disabled');
    switch (state) {
      case 'running':
        $('#btnstart', this.el).addClass('disabled');
        break;
      case 'stopped':
        $('#btstop', this.el).addClass('disabled');
        $('#btnhstop', this.el).addClass('disabled');
        $('#btnreboot', this.el).addClass('disabled');
        $('#btnhreboot', this.el).addClass('disabled');
        $('#btnpause', this.el).addClass('disabled');
        break;
      case 'paused':
        $('#btstop', this.el).addClass('disabled');
        $('#btnreboot', this.el).addClass('disabled');
        $('#btnhreboot', this.el).addClass('disabled');
        $('#btnpause', this.el).addClass('disabled');
        break;
      case 'pending':
        $('#btnstart', this.el).addClass('disabled');
        $('#btstop', this.el).addClass('disabled');
        $('#btnhstop', this.el).addClass('disabled');
        $('#btnreboot', this.el).addClass('disabled');
        $('#btnhreboot', this.el).addClass('disabled');
        $('#btnpause', this.el).addClass('disabled');
        break;
    }
  },

  vmaction: function(evt, action) {
    var self = this;
    var uri = '';
    var title = '';
    var msg = '';
    if (evt && !$(evt.target).attr('data-action')) return;
    var option = action || $(evt.target).attr('data-action');
    switch (option) {
      case 'start':
        uri = 'vm/' + this.model.get('id') + '/start';
        break;
      case 'pause':
        uri = 'vm/' + this.model.get('id') + '/pause';
        break;
      case 'stop':
        uri = 'vm/' + this.model.get('id') + '/stop';
        break;
      case 'hstop':
        uri = 'vm/' + this.model.get('id') + '/stop/true';
        break;
      case 'reboot':
        uri = 'vm/' + this.model.get('id') + '/restart';
        break;
      case 'hreboot':
        uri = 'vm/' + this.model.get('id') + '/restart/true';
        break;
    }

    modem('POST', uri,
      function(json) {
        var ittl = ['Success!','Sucesso!','Éxito!'];
        var imsg = ['', '', ''];
        showInfo(ittl[getlang()], imsg[getlang()]);
        self.refreshState();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Action Failed', 'Acção Falhou', 'Acción Error'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }
    );

  },
  remove: function() {
    if (this.loop) {
      clearInterval(this.loop);
    }
    this.$el.remove();
    this.stopListening();
    return this;
  },
  deletevm: function() {
    modem('DELETE', 'vm/' + this.model.get('id'),
      function(json) {
        var smsg = ['VM deleted', 'VM apagada', 'VM apagada'];
        showSuccess(smsg[getlang()]);
        $('#modal_confirm_delete').modal('hide');
        app.navigate('home', {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to delete VM', 'Falha ao eliminar VM', 'Error al eliminar VM'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }
    );
  },
  fillheader: function() {
    if (parseInt(this.model.get('ram')) > 1024) {
      $('.ramusage', this.el).html(parseInt(this.model.get('ram')) / 1024 + ' GB');
    } else {
      $('.ramusage', this.el).html(parseInt(this.model.get('ram')) + ' MB');
    }
    $('.cpu', this.el).html(this.model.get('vcpu') + ' vcpu');
    $('.diskusage', this.el).html(this.model.get('disk') + ' GB');
    var self = this;
    modem('GET', 'config/resources',
      function(json) {
        $('.pbram', self.el).width(parseInt(parseInt(self.model.get('ram'))/parseInt(json.memory)*100)+'%');
        $('.pbhdd', self.el).width(parseInt(parseInt(self.model.get('disk'))/parseInt(json.storage)*100)+'%');
        $('.pbcpu', self.el).width(parseInt(parseInt(self.model.get('vcpu'))/parseInt(json.cpu)*100)+'%');
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
    if (this.model.get('status') === 'running') {
      $('.state', this.el).removeClass('c-red');
      $('.state', this.el).removeClass('c-gold');
      $('.state', this.el).addClass('c-green');
      $('.state', this.el).html('<i class="icon-play m-r-10 c-green"></i> Running');
    } else if (this.model.get('status') === 'stopped') {
      $('.state', this.el).removeClass('c-green');
      $('.state', this.el).removeClass('c-gold');
      $('.state', this.el).addClass('c-red');
      $('.state', this.el).html('<i class="icon-stop m-r-10 c-red"></i> Stopped');
    } else if (this.model.get('status') === 'paused') {
      $('.state', this.el).removeClass('c-green');
      $('.state', this.el).removeClass('c-red');
      $('.state', this.el).addClass('c-gold');
      $('.state', this.el).html('<i class="m-r-10 c-gold">&#9612&#9612</i> Paused');
    } else {
      $('.state', this.el).removeClass('c-green');
      $('.state', this.el).removeClass('c-red');
      $('.state', this.el).addClass('c-gold');
      $('.state', this.el).html('<i class="icon-refresh m-r-10 c-gold"></i> Pending');
    }
  },
  refreshState: function() {
    var self = this;
    this.vm = this.model;
    this.vm.fetch(this.model.get('id'), function() {
      self.model = self.vm;
      if (self.model.get('status') === 'running') {
        $('.state', self.el).removeClass('c-red');
        $('.state', self.el).removeClass('c-gold');
        $('.state', self.el).addClass('c-green');
        $('.state', self.el).html('<i class="icon-play m-r-10 c-green"></i> Running');
      } else if (self.model.get('status') === 'stopped') {
        $('.state', self.el).removeClass('c-green');
        $('.state', self.el).removeClass('c-gold');
        $('.state', self.el).addClass('c-red');
        $('.state', self.el).html('<i class="icon-stop m-r-10 c-red"></i> Stopped');
      } else if (self.model.get('status') === 'paused') {
        $('.state', self.el).removeClass('c-green');
        $('.state', self.el).removeClass('c-red');
        $('.state', self.el).addClass('c-gold');
        $('.state', self.el).html('<i class="m-r-10 c-gold">&#9612&#9612</i> Paused');
      } else {
        $('.state', self.el).removeClass('c-green');
        $('.state', self.el).removeClass('c-red');
        $('.state', self.el).addClass('c-gold');
        $('.state', self.el).html('<i class="icon-refresh m-r-10 c-gold"></i> Pending');
      }
      self.togglebtn(self.model.get('status'));
    });
  },
  extrainfo: function() {
    var ips = '';
    var self = this;
    var ip = this.model.get('ip');
    $('.infohostanme', this.el).html(this.model.get('hostname') + ' - ' + ip);
    if (this.user.get('type') === 'admin') {
      modem('GET', 'user/'+this.model.get('owner'),
        function(json) {
          $('.infoowner', self.el).html(json.auth.username);
          $('.infoowner', self.el).show();
        },
        function(xhr, ajaxOptions, thrownError) {
          var json = JSON.parse(xhr.responseText);
          console.log(json);
        }
      );
    }

  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.extrainfo();
    this.togglebtn(this.model.get('status'));
    this.fillheader();
    var self = this;
    this.loop = setInterval(function() {
      self.refreshState(self.el);
    }, 5000);

    $('.topmenudetails li').removeClass('active');
    $('#gotosummary').parent().addClass('active');

    return this;
  }

});
