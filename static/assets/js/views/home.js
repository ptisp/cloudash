window.HomeView = Backbone.View.extend({
  events: {
    'click #vmtable tbody tr': 'test'
  },
  test: function(evt) {
    if ($(evt.target).hasClass('f-18')) {
      console.log($(evt.target).parent().parent().attr('data-user'));
      console.log($(evt.target).parent().parent().attr('data-name'));
    } else {
      console.log($(evt.target).parent().attr('data-user'));
      console.log($(evt.target).parent().attr('data-name'));
    }

  },
  fillheaders: function(vms) {
    var vm = vms.length, ram = 0, hdd = 0, active = 0;
    for (var i = 0; i < vms.length; i++) {
      ram += parseInt(vms[i].details.ram);
      hdd += parseInt(vms[i].details.disk);
      if (vms[i].details.status === 'running') {
        active++;
      }
    }
    ram = parseFloat(ram / 1024);
    $('.vmtotal', this.el).html(vm);
    $('.ramusage', this.el).html(ram);
    $('.diskusage', this.el).html(hdd);
    $('.activevm', this.el).html(active);
  },
  fillvmtable: function(vms) {
    if (vms.length === 0) {
      $('.vmtable', this.el).html('<tr><td>No VMs to show</td></tr>');
    } else {
      var html = '';
      for (var i = 0; i < vms.length; i++) {
        var icon = '<i class="icon-play f-18 m-r-5 c-green"></i>';
        var classe = 'class="success"';
        if (vms[i].details.status === 'stopped') {
          icon = '<i class="icon-stop f-18 m-r-5 c-red"></i>';
          classe = 'class="danger"';
        } else if (vms[i].details.status === 'review') {
          icon = '<i class="icon-refresh f-18 m-r-5 c-gold"></i>';
          classe = 'class="default"';
        }
        var auxip = '';
        for (var j = 0; j < vms[i].details.ip.length; j++) {
          auxip += vms[i].details.ip[j];
          if (j !== vms[i].details.ip.length-1) {
            auxip += ', ';
          }
        }
        html = '<tr ' + classe + ' data-user="'+vms[i].owner+'" data-name="'+vms[i].name+'"><td>' + icon + ' ' + vms[i].name + '</td>';
        html += '<td>' + auxip + '</td>';
        html += '<td>' + vms[i].details.ram + 'MB</td>';
        html += '<td>' + vms[i].details.disk + 'GB</td>';
        html += '<td>' + vms[i].details.status + '</td>';
        $('.vmtable', this.el).append(html);
      }
    }
  },
  getvms: function() {
    var self = this;
    modem('GET', 'vm',
      function(json) {
        self.fillvmtable(json);
        self.fillheaders(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vmtable', this.el).html('');
    this.getvms();
    return this;
  }

});
