window.LogsView = Backbone.View.extend({
  events: {
    'keyup #pesquisa': 'filtro',
  },
  filtro: function() {
    var oTable = $('#example').dataTable();
    oTable.fnFilter($('#pesquisa').val());
  },
  getLogs: function() {
    var self = this;
    var handler = function(json) {
      var oTable = $('#example', self.el).dataTable({
        "data": json,
        "bAutoWidth": false ,
        "columns": [{
          "data": null,
          "sWidth": "15%",
          "bSortable": true,
          "mRender": function(data, type, full) {
            return formatdate(new Date(data.time));
          }
        }, {
          "data": "user",
          "sWidth": "25%"
        }, {
          "data": "action",
          "sWidth": "60%"
        }],
        "aaSorting": [[0, "desc"]]
      });
    };
    modem('GET', 'logs',
      function(json) {
        handler(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template());
    $('.logs', this.el).i18n();
    $('.logstable', this.el).html('');

    this.getLogs();

    $('.menulateral li').removeClass('active');
    $('.gotologs').addClass('active');
    return this;
  }

});
