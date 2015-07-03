window.VMDResizeView = Backbone.View.extend({
  initialize: function(options) {
    this.vm = options.vm;
  },
  events: {
    'click #resizevm': 'vmresize',
    'click #shutdown': 'shutdown'
  },
  shutdown: function() {
    this.vmaction(null, 'stop');
  },

  vmresize: function(evt) {
    var vmdetails = {
      'cpu': $('#sliderCPU').val(),
      'ram': parseInt($('#sliderRAM').val() / 2 * 1024)
    };

    modem('PUT', 'vm/' + this.model.get('id'),
      function(json) {
        console.log('resized!!');
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Criação de VM', json.error);
      }, vmdetails
    );
  },

  vmaction: function(evt, action) {
    var self = this;
    var uri = '';
    var title = '';
    var msg = '';
    //console.log($(evt.target).attr('data-action'));
    if (evt && !$(evt.target).attr('data-action')) return;
    var option = action || $(evt.target).attr('data-action');
    console.log(option);
    switch (option) {
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

  setslider: function() {
    $('#sliderCPU', this.el).val(this.model.get('vcpu'));
    $('#rangeDanger', this.el).html(this.model.get('vcpu'));
    $('#sliderRAM', this.el).val((this.model.get('ram') / 1024) * 2);
    $('#rangeInfo', this.el).html(this.model.get('ram') / 1024);
    if (this.model.get('status') !== 'stopped') {
      $('#sliderCPU', this.el).prop('disabled', true);
      $('#sliderRAM', this.el).prop('disabled', true);
      $('#resizevm', this.el).addClass('disabled');
      $('#showwarning', this.el).show();
    } else {
      $('#sliderCPU', this.el).prop('disabled', false);
      $('#sliderRAM', this.el).prop('disabled', false);
      $('#resizevm', this.el).removeClass('disabled');
      $('#showwarning', this.el).hide();
    }
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.setslider();

    $('.topmenudetails li').removeClass('active');
    $('#gotoresize').parent().addClass('active');

    return this;
  }

});
