window.HomeView = Backbone.View.extend({
  events: {
    'click #example tbody tr': 'gotovm',
    'keyup #pesquisa': 'filtro',
    'change #ddshow': 'show',
  },
  show: function() {
    var index = document.getElementById('ddshow').selectedIndex;
    var oTable = $('#example').dataTable();
    var oSettings = oTable.fnSettings();
    oSettings._iDisplayLength = parseInt(document.getElementsByTagName('option')[index].value);
    oTable.fnDraw();
  },
  filtro: function() {
    var oTable = $('#example').dataTable();
    oTable.fnFilter($('#pesquisa').val());
  },
  gotovm: function(evt) {
    if ($(evt.target).hasClass('f-18')) {
      app.navigate('/vm/info/' + $(evt.target).parent().parent().attr('data-id') + '/summary', {
        trigger: true
      });
    } else {
      var vmid = $(evt.target).parent().attr('data-id');
      if (vmid) {
        app.navigate('/vm/info/' + vmid + '/summary', {
          trigger: true
        });
      }
    }

  },
  fillheaders: function(vms) {
    var vm = vms.length,
      ram = 0,
      hdd = 0,
      active = 0,
      cpu = 0;
    for (var i = 0; i < vms.length; i++) {
      ram += parseInt(vms[i].details.ram);
      hdd += parseInt(vms[i].details.disk);
      cpu += parseInt(vms[i].details.vcpu);
      if (vms[i].details.status === 'running') {
        active++;
      }
    }
    ram = parseInt(ram);
    $('.vmtotal', this.el).html(vm);
    $('.ramusage', this.el).html(ram);
    $('.diskusage', this.el).html(hdd);
    $('.cpuusage', this.el).html(cpu);
    $('.activevm', this.el).html(active);

    modem('GET', 'config/resources',
      function(json) {
        $('.ramtotal', this.el).html(json.memory);
        $('.disktotal', this.el).html(json.storage);
        $('.cputotal', this.el).html(json.cpu);
      },
      function(xhr, ajaxOptions, thrownError) {}
    );
  },
  getvms: function() {
    var self = this;
    var handler = function(json) {
      var oTable = $('#example', self.el).dataTable({
        "data": json,
        "columns": [{
          "data": null,
          "bSortable": true,
          "mRender": function(data, type, full) {
            var icon = '<i class="icon-refresh f-18 m-r-5 c-gold"></i>';
            if (full.details.status === 'stopped') {
              icon = '<i class="icon-stop f-18 m-r-5 c-red"></i>';
            } else if (full.details.status === 'running') {
              icon = '<i class="icon-play f-18 m-r-5 c-green"></i>';
            }
            return icon + full.details.hostname;
          }
        }, {
          "data": "details.ip"
        }, {
          "data": null,
          "bSortable": true,
          "mRender": function(data, type, full) {
            if (full.details.ram >= 1024)
              return parseInt(full.details.ram) / 1024 + 'GB';
            else
              return parseInt(full.details.ram) + 'MB';
          }
        }, {
          "data": null,
          "bSortable": true,
          "mRender": function(data, type, full) {
            return parseInt(full.details.disk) + 'GB';
          }
        }, {
          "data": "details.status"
        }, ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          var classe;
          switch (aData.details.status) {
            case 'running':
              classe = 'success likehref';
              break;
            case 'stopped':
              classe = 'danger likehref';
              break;
            default:
              classe = 'default likehref';
              break;
          }
          $(nRow).addClass(classe);
          $(nRow).attr('data-id', aData._id);
          return nRow;
        }
      });
    };
    modem('GET', 'vm',
      function(json) {
        handler(json);
        self.fillheaders(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vmtable', this.el).html('');
    $('.home', this.el).i18n();
    $('.menulateral li').removeClass('active');
    $('.gotohome').addClass('active');
    this.getvms();
    return this;
  }

});
