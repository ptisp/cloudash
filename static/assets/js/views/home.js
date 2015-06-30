window.HomeView = Backbone.View.extend({
  events: {
    'click #vmtable tbody tr': 'gotovm'
  },
  gotovm: function(evt) {
    if ($(evt.target).hasClass('f-18')) {
      app.navigate('/vm/edit/'+$(evt.target).parent().parent().attr('data-id'), {
        trigger: true
      });
    } else {
      var vmid = $(evt.target).parent().attr('data-id');
      if (vmid) {
        app.navigate('/vm/edit/'+vmid, {
          trigger: true
        });
      }
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
    ram = parseFloat(ram / 1024).toFixed(1);
    $('.vmtotal', this.el).html(vm);
    $('.ramusage', this.el).html(ram);
    $('.diskusage', this.el).html(hdd);
    $('.activevm', this.el).html(active);
  },
  fillvmtable: function(vms) {
    if (vms.length === 0) {
      $('.vmtable', this.el).html('<tr><td colspan="5">No VMs to show</td></tr>');
    } else {
      var html = '';
      for (var i = 0; i < vms.length; i++) {
        var user = '';
        if (vms[i].owner !== this.model.get('username')) {
          user = '<i class="icon-user f-18 m-r-5 pull-right" title="'+ vms[i].owner +'"></i>';
        }
        var icon = '<i class="icon-refresh f-18 m-r-5 c-gold"></i>';
        var classe = 'class="default likehref"';
        if (vms[i].details.status === 'stopped') {
          icon = '<i class="icon-stop f-18 m-r-5 c-red"></i>';
          classe = 'class="danger likehref"';
        } else if (vms[i].details.status === 'running') {
           icon = '<i class="icon-play f-18 m-r-5 c-green"></i>';
           classe = 'class="success likehref"';
        }
        var auxip = '';
        for (var j = 0; j < vms[i].details.ip.length; j++) {
          auxip += vms[i].details.ip[j];
          if (j !== vms[i].details.ip.length-1) {
            auxip += ', ';
          }
        }
        html = '<tr ' + classe + ' data-id="'+vms[i]._id+'"><td>' + icon + ' ' + vms[i].details.hostname + ' '+ user +'</td>';
        html += '<td>' + auxip + '</td>';
        if (vms[i].details.ram > 1024) html += '<td>' + vms[i].details.ram/1024 + 'GB</td>';
        else html += '<td>' + vms[i].details.ram + 'MB</td>';
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
    $('.home', this.el).i18n();
    this.getvms();
    return this;
  }

});
