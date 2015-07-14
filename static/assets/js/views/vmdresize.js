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
    var self = this;
    var nicid = $(evt.target).attr('data-nicid');
    modem('DELETE', 'vm/' + this.model.get('id')+'/network/'+nicid,
      function(json) {
        showSuccess('Sucesso!', 'Interface Eliminada');
        self.afterinterface();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO - Eliminação de Interface', json.error);
      }
    );
  },

  afterinterface: function() {
    var self = this;
    this.model.fetch(this.model.get('id'), function() {
      self.render();
    });
  },

  addinterface: function() {
    var self = this;
    modem('POST', 'vm/' + this.model.get('id')+'/network',
      function(json) {
        showSuccess('Sucesso!', 'Interface Adicionada');
        self.afterinterface();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO - Adicção de Interface', json.error);
      }
    );
  },

  vmresize: function(evt) {
    var vmdetails = {
      'cpu': $('#sliderCPU').val(),
      'ram': parseInt($('#sliderRAM').val() / 2 * 1024)
    };

    modem('PUT', 'vm/' + this.model.get('id'),
      function(json) {
        showSuccess('Sucesso!', 'Alteraçoes efectuadas');
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
      var disabled = '';
      if (intf[0].id === '0') disabled = 'disabled';
      var html = '<div class="col-sm-6 col-md-3 m-b-10">'+
				'<div class="bg-black p-10">'+
					'<p class="f-12"><span class="c-gray"><i class="icon-star"></i> ID:</span> <strong>'+intf[i].id+'</strong></p>'+
					'<p class="f-12"><span class="c-gray"><i class="icon-ips"></i> IP:</span> <strong>'+intf[i].ip+'</strong></p>'+
					'<p class="f-12"><span class="c-gray"><i class="icon-ram_memory"></i> MAC:</span> <strong>'+intf[i].mac+'</strong></p>'+
				'</div>'+
				'<button class="btn btn-block btn-sm btn-danger delinterface" data-nicid="'+intf[i].id+'" '+disabled+'><i class="icon-delete"></i> <span>Delete</span></button>'+
			'</div>';

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
