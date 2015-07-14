window.VMDResizeView = Backbone.View.extend({
  initialize: function(options) {
    this.vm = options.vm;
  },
  events: {
    'click #resizevm': 'vmresize'
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
    $('.vm-resize', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.setslider();

    $('.topmenudetails li').removeClass('active');
    $('#gotoresize').parent().addClass('active');

    return this;
  }

});
