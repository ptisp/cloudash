window.VMDetailsView = Backbone.View.extend({
  initialize: function(options) {
    this.id = options.id;
  },
  events: {
    'click .deletevm': 'deletevm',
    'click .actionvm': 'vmaction'
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
      case 'suspended':
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
  vmaction: function(evt) {
    var self = this;
    var uri = '';
    var title = '';
    var msg = '';
    //console.log($(evt.target).attr('data-action'));
    if (!$(evt.target).attr('data-action')) return;
    switch ($(evt.target).attr('data-action')) {
      case 'start':
        uri = 'vm/' + this.model.get('id') + '/start';
        title = 'Iniciar';
        msg = 'VM ' + this.model.get('hostname') + ' Iniciada';
        break;
      case 'pause':
        uri = 'vm/' + this.model.get('id') + '/pause';
        title = 'Pause';
        msg = 'VM ' + this.model.get('hostname') + ' Pausada';
        break;
      case 'stop':
        uri = 'vm/' + this.model.get('id') + '/stop';
        title = 'Parar';
        msg = 'VM ' + this.model.get('hostname') + ' Desligada';
        break;
      case 'hstop':
        uri = 'vm/' + this.model.get('id') + '/stop/true';
        title = 'Parar Forçado';
        msg = 'VM ' + this.model.get('hostname') + ' Desligada';
        break;
      case 'reboot':
        uri = 'vm/' + this.model.get('id') + '/restart';
        title = 'Reboot';
        msg = 'VM ' + this.model.get('hostname') + ' Rebotada';
        break;
      case 'hreboot':
        uri = 'vm/' + this.model.get('id') + '/restart/true';
        title = 'Reboot Forçado';
        msg = 'VM ' + this.model.get('hostname') + ' Rebotada';
        break;
    }
    //console.log(uri);

    modem('POST', uri,
      function(json) {
        //console.log(json);
        showInfo(title, msg);
        self.refreshState();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - ' + title, json.error);
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
    console.log(this.model.get('id'));
    modem('DELETE', 'vm/' + this.model.get('id'),
      function(json) {
        console.log(json);
        showSuccess('SUCESSO', 'VM Apagada');
        app.navigate('home', {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Criação de VM', json.error);
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
    } else if (this.model.get('status') === 'suspended') {
      $('.state', this.el).removeClass('c-green');
      $('.state', this.el).removeClass('c-red');
      $('.state', this.el).addClass('c-gold');
      $('.state', this.el).html('<i class="icon-refresh m-r-10 c-gold"></i> Suspended');
    } else {
      $('.state', this.el).removeClass('c-green');
      $('.state', this.el).removeClass('c-red');
      $('.state', this.el).addClass('c-gold');
      $('.state', this.el).html('<i class="icon-refresh m-r-10 c-gold"></i> Pending');
    }
  },
  refreshState: function() {
    //console.log('Get Status');
    var self = this;
    window.vm.fetch(this.model.get('id'), function() {
      self.model = window.vm;
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
      } else if (self.model.get('status') === 'suspended') {
        $('.state', self.el).removeClass('c-green');
        $('.state', self.el).removeClass('c-red');
        $('.state', self.el).addClass('c-gold');
        $('.state', self.el).html('<i class="icon-refresh m-r-10 c-gold"></i> Suspended');
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
    var ip = this.model.get('ip');
    for (var i = 0; i < ip.length; i++) {
      if (i !== 0) {
        ips += ', ';
      }
      ips += ip[i];
    }
    $('.infohostanme', this.el).html(this.model.get('hostname') + ' - ' + ips);
  },
  loadCharts: function() {
    modem('GET', 'vm/' + this.model.get('id') + '/metrics',
      function(json) {
        console.log(json);

        var cpuChart = new CPUChart('placeHolder1', {
          'size': 512
        });
        cpuChart.appendData(json.stats);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - ' + title, json.error);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.extrainfo();
    this.togglebtn(this.model.get('status'));
    this.fillheader();
    this.loadCharts();
    var self = this;

    this.loop = setInterval(function() {
      self.refreshState(self.el);
    }, 5000);

    return this;
  }

});
