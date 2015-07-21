window.ManageUsersView = Backbone.View.extend({
  events: {
    'click .btnedit': 'edituser',
    'click .btn_delete': 'deleteuser',
    'click .btndelete': 'showmodal',
    'keyup #pesquisa': 'filtro',
    'change #ddshow': 'show',
    'click #example tbody tr': 'gotouser'
  },
  gotouser: function(evt) {
    if ($(evt.target).parent().attr('data-id')) {
      app.navigate('config/user/'+$(evt.target).parent().attr('data-id'), {
        trigger: true
      });
    }
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
  getuservm: function(id) {
    var self = this;
    var handler = function(vms) {
      var ownvm = [];
      var host = '';
      for (var i = 0; i < vms.length; i++){
        if (vms[i].owner === id) {
          ownvm.push(vms[i]);
          host += '<br><span>'+vms[i].details.hostname+'</span>';
        }
      }
      self.vms = ownvm;
      var html = ownvm.length + host;
      $('.vmnumber').html(html);
    };
    modem('GET', 'vm',
      function(json) {
        handler(json);
      },
      function(xhr, ajaxOptions, thrownError) {}
    );
  },
  showmodal: function(e) {
    var obj = $(e.target);
    if ($(e.target).hasClass('icon-delete')) {
      obj = $(e.target).parent();
    }
    var id = obj.attr('data-id');
    this.getuservm(id);
    $('.btn_delete', this.el).attr('data-id',id);
    $('#delname', this.el).html(obj.attr('data-name'));
    $('#delemail', this.el).html(obj.attr('data-email'));
    $('#deltype', this.el).html(obj.attr('data-type'));
    $('#delstatus', this.el).html(obj.attr('data-status'));
    $('#modal_confirm_delete').on('shown', function() {});
    $('#modal_confirm_delete').modal({});
  },
  edituser: function(e) {
    var id = $(e.target).attr('data-id');
    if ($(e.target).hasClass('icon-managed')) {
      id = $(e.target).parent().attr('data-id');
    }
    app.navigate('config/user/'+id, {
      trigger: true
    });
  },
  deleteuser: function(e) {
    var self = this;
    var id = $(e.target).attr('data-id');
    if (!$(e.target).hasClass('btn')) {
      id = $(e.target).parent().attr('data-id');
    }

    for (var i = 0; i < this.vms.length; i++) {
      modem('DELETE', 'vm/'+this.vms[i]._id,
        function(json) {
        },
        function(xhr, ajaxOptions, thrownError) {
          var json = JSON.parse(xhr.responseText);
          var emsg = ['Failed to delete VM', 'Falha ao eliminar VM', 'Error al eliminar VM'];
          showError(emsg[getlang()]+'<br>'+json.error);
        }
      );
    }
    modem('DELETE', 'user/remove/'+id,
      function(json) {
        var smsg = ['User deleted', 'Utilizador removido', 'Usuario eliminado'];
        showSuccess(smsg[getlang()]);
        self.getusers();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to delete user', 'Falha ao eliminar utilizador', 'Error al eliminar el usuario'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }
    );
  },
  getusers: function() {
    var self = this;
    var handler = function(json) {
      $('#example', self.el).dataTable().fnDestroy();
      var oTable = $('#example', self.el).dataTable({
        "data": json,
        "bAutoWidth": false,
        "columns": [
          { "data": "about.name", "sWidth": "20%"},
          { "data": "auth.username", "sWidth": "20%"},
          { "data": "type", "sWidth": "20%"},
          { "data": "status", "sWidth": "20%"},
          { "data": null,
            "sWidth": "20%",
            "mRender": function(data, type, full) {
              var enabled = '';
              if (self.model.get('username') === full.auth.username) {
                enabled = 'disabled';
              }
              var html = '<button type="button" class="btn btn-xs btn-success btnedit" data-id="'+full._id+'"><i class="icon-managed"></i> Edit</button><button type="button" class="btn btn-xs btn-danger btndelete" data-id="'+full._id+'" '+enabled+' data-name="'+full.about.name+'" data-email="'+full.auth.username+'" data-type="'+full.type+'" data-status="'+full.status+'"><i class="icon-delete"></i> Delete</button>';
              return html;
            }}
        ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $(nRow).addClass('likehref');
          $(nRow).attr('data-id', aData._id);
          return nRow;
        }
      });
    };
    modem('GET', 'user/listusers',
      function(json) {
        $('.userstable', self.el).html('');
        handler(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to load users', 'Falha ao carregar utilizadores', 'Error al cargar los usuarios'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.userstable', this.el).html('');
    this.getusers();
    $('.manageusers', this.el).i18n();

    $('.managemenu li').removeClass('active');
    $('#useraccounts').parent().addClass('active');

    return this;
  }

});
