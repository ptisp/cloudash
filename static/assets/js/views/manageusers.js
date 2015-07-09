window.ManageUsersView = Backbone.View.extend({
  events: {
    'click .btnedit': 'edituser',
    'click .btn_delete': 'deleteuser',
    'click .btndelete': 'showmodal'
  },
  showmodal: function(e) {
    var obj = $(e.target);
    if ($(e.target).hasClass('icon-delete')) {
      obj = $(e.target).parent();
    }
    var id = obj.attr('data-id');
    $('.btn_delete').attr('data-id',id);
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
    var id = $(e.target).parent().attr('data-id');
    modem('DELETE', 'user/remove/'+id,
      function(json) {
        //console.log(json);
        showSuccess('Sucesso!', 'Utilizador removido');
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }
    );
  },
  fillusertable: function(users) {
    var html = '';
    for (var i = 0; i < users.length; i++) {
      html = '<tr><td>'+users[i].about.name+'</td>';
      html += '<td>'+users[i].auth.username+'</td>';
      html += '<td>'+users[i].type+'</td>';
      html += '<td>'+users[i].status+'</td>';
      var enabled = '';
      if (this.model.get('username') === users[i].auth.username) {
        enabled = 'disabled';
      }
      html += '<td><button type="button" class="btn btn-xs btn-success btnedit" data-id="'+users[i]._id+'"><i class="icon-managed"></i> Edit</button><button type="button" class="btn btn-xs btn-danger btndelete" data-id="'+users[i]._id+'" '+enabled+' data-name="'+users[i].about.name+'" data-email="'+users[i].auth.username+'" data-type="'+users[i].type+'" data-status="'+users[i].status+'"><i class="icon-delete"></i> Delete</button></td></tr>';
      $('.userstable', this.el).append(html);
    }
  },
  getusers: function() {
    var self = this;
    modem('GET', 'user/listusers',
      function(json) {
        self.fillusertable(json);
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
    $('.userstable', this.el).html('');
    this.getusers();
    $('.manageusers', this.el).i18n();

    $('.managemenu li').removeClass('active');
    $('#useraccounts').parent().addClass('active');

    return this;
  }

});
