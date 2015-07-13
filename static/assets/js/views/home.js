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
        $('.pbram', self.el).width(parseInt(parseInt(ram)/parseInt(json.memory)*100)+'%');
        $('.pbhdd', self.el).width(parseInt(parseInt(hdd)/parseInt(json.storage)*100)+'%');
        $('.pbcpu', self.el).width(parseInt(parseInt(cpu)/parseInt(json.cpu)*100)+'%');
        $('.pbvms', self.el).width(parseInt(parseInt(active)/parseInt(vm)*100)+'%');
      },
      function(xhr, ajaxOptions, thrownError) {}
    );
  },
  getvms: function() {
    var self = this;
    var getowner = function(vms){
      var users = [];
      for (var i = 0; i < vms.length; i++){
        if ($.inArray(vms[i].owner, users) < 0) {
            users.push(vms[i].owner);
          }
      }
      console.log(users);
      for (i = 0; i < users.length; i++){
        modem('GET', 'user/'+users[i],
          function(json) {
            $('span[data-owner="'+json._id+'"]').html(json.auth.username);
          },
          function(xhr, ajaxOptions, thrownError) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
          }
        );
      }
    };
    var handler = function(json) {
      var oTable = $('#example', self.el).dataTable({
        "data": json,
        "bAutoWidth": false,
        "columns": [{
          "data": null,
          "sWidth": "20%",
          "bSortable": true,
          "mRender": function(data, type, full) {
            var icon = '<i class="icon-refresh f-18 m-r-5 c-gold"></i>';
            if (full.details.status === 'stopped') {
              icon = '<i class="icon-stop f-18 m-r-5 c-red"></i>';
            } else if (full.details.status === 'running') {
              icon = '<i class="icon-play f-18 m-r-5 c-green"></i>';
            } else if (full.details.status === 'suspended') {
              icon = '<span class="f-12 m-r-5 c-gold">&#9612&#9612</span>';
            }
            return icon + full.details.hostname;

          }
        }, {
          "data": null,
          "sWidth": "25%",
          "bSortable": true,
          "mRender": function(data, type, full) {
            var html = '<span data-owner="'+full.owner+'">'+full.owner+'</span>';
            return html;
          }
        }, {
          "data": "details.ip", "sWidth": "17%"
        }, {
          "data": null,
          "sWidth": "12%",
          "bSortable": true,
          "mRender": function(data, type, full) {
            if (full.details.ram >= 1024)
              return parseInt(full.details.ram) / 1024 + 'GB';
            else
              return parseInt(full.details.ram) + 'MB';
          }
        }, {
          "data": null,
          "sWidth": "12%",
          "bSortable": true,
          "mRender": function(data, type, full) {
            return parseInt(full.details.disk) + 'GB';
          }
        }, {
          "data": "details.status", "sWidth": "13%"
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
      getowner(json);
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
