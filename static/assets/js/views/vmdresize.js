window.VMDResizeView = Backbone.View.extend({
  initialize: function(options) {
    this.vm = options.vm;
  },
  events: {
    'click #resizevm': 'vmresize',
    'click #addinterface': 'addinterface',
    'click .delinterface': 'delinterface'
  },

  delinterface: function(evt) {
    var nicid = $(evt.target).attr('data-nicid');
    modem('DELETE', 'vm/' + this.model.get('id')+'/network/'+nicid,
      function(json) {
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO - Eliminação de Interface', json.error);
      }, vmdetails
    );
  },

  addinterface: function() {
    modem('POST', 'vm/' + this.model.get('id')+'/network',
      function(json) {
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO - Adicção de Interface', json.error);
      }, vmdetails
    );
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
        showError('ERRO - Alteração de VM', json.error);
      }, vmdetails
    );
  },

  setinterfaces: function() {
    var intf = this.model.get('interfaces');
    $('#interfaces', this.el).html('');
    console.log(intf);
    for (var i = 0; i < intf.length; i++) {
      var html = '';
      if (i%2 === 0) {
        html = '<section class="bg-white border-section">';
      } else {
        html = '<section class="bg-cristal border-section">'  ;
      }
      html += '<div><span>ID: '+intf[i].id+'</span></div>';
      html += '<div><span>IP: '+intf[i].ip+'</span></div>';
      html += '<div><span>MAC: '+intf[i].mac+'</span></div>';
      if (intf[i].id !== '0'){
        html += '<button type="button" data-nicid="'+intf[i].id+'" class="btn btn-lg btn-block btn-danger delinterface"> <i class="icon-delete"></i> <span data-i18n="">  Apagar</span> </button>';
      }
      html += '</setion>';
      $('#interfaces', this.el).append(html);
    }
  },

  setslider: function() {
    $('#sliderCPU', this.el).val(this.model.get('vcpu'));
    $('#rangeDanger', this.el).html(this.model.get('vcpu'));
    $('#sliderRAM', this.el).val((this.model.get('ram') / 1024) * 2);
    $('#rangeInfo', this.el).html(this.model.get('ram') / 1024);
    if (this.model.get('status') !== 'stopped') {
      $('#sliderCPU', this.el).prop('disabled', true);
      $('#sliderRAM', this.el).prop('disabled', true);
      $('#addinterface', this.el).removeClass('disabled');
      $('#resizevm', this.el).addClass('disabled');
      $('#showwarning', this.el).show();
    } else {
      $('#sliderCPU', this.el).prop('disabled', false);
      $('#sliderRAM', this.el).prop('disabled', false);
      $('#addinterface', this.el).addClass('disabled');
      $('#resizevm', this.el).removeClass('disabled');
      $('#showwarning', this.el).hide();
    }
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-resize', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.setslider();
    this.setinterfaces();

    $('.topmenudetails li').removeClass('active');
    $('#gotoresize').parent().addClass('active');

    return this;
  }

});
