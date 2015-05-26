window.UserAccView = Backbone.View.extend({
  events: {
  },
  fillusertable: function(users) {
    var html = '';
    for (var i = 0; i < users.length; i++) {
      html = '<tr><td>'+users[i].about.name+'</td>';
      html += '<td>'+users[i].about.phone+'</td>';
      html += '<td>'+users[i].auth.username+'</td>';
      html += '<td>'+users[i].type+'</td>';
      var enabled = '';
      if (this.model.get('username') === users[i].auth.username) {
        enabled = 'disabled';
      }
      html += '<td><button type="button" class="btn btn-xs btn-success" data-user="'+users[i].auth.username+'"><i class="icon-managed"></i> Edit</button><button type="button" class="btn btn-xs btn-danger" data-user="'+users[i].auth.username+'" '+enabled+'><i class="icon-delete"></i> Delete</button></td></tr>';
      $('.userstable', this.el).append(html);
    }
  },
  getusers: function() {
    var self = this;
    modem('GET', 'listusers',
      function(json) {
        self.fillusertable(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.userstable', this.el).html('');
    this.getusers();
    return this;
  }

});
