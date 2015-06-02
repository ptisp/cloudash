window.VMDetailsView = Backbone.View.extend({
  initialize: function (options) {
    this.id = options.id;
  },
  events: {
  },
  fillheader: function(vm) {
    if (parseInt(vm.details.ram) > 1024) {
      $('.ramusage', this.el).html(parseInt(vm.details.ram)/1024 + ' GB');
    } else {
      $('.ramusage', this.el).html(parseInt(vm.details.ram) + ' MB');
    }
    $('.cpu', this.el).html(vm.details.vcpu + ' vcpu');
    $('.diskusage', this.el).html(vm.details.disk + ' GB');
    if (vm.details.status === 'running') {
      $('.state', this.el).html('<i class="icon-play m-r-10"></i> Running');
    } else if (vm.details.status === 'stopped') {
      $('.state', this.el).html('<i class="icon-stop m-r-10"></i> Stopped');
    } else {
      $('.state', this.el).html('<i class="icon-refresh m-r-10"></i> Review');
    }
  },
  getvmdetails: function() {
    var self = this;
    modem('GET', 'vm/'+self.id,
      function(json) {
        self.fillheader(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template());
    $('.vm-details', this.el).i18n();
    this.getvmdetails();
    return this;
  }

});
