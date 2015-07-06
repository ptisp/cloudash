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
        "columns": [{
          "data": null,
          "bSortable": true,
          "mRender": function(data, type, full) {
            return new Date(data.time).toString();
          }
        }, {
          "data": "user"
        }, {
          "data": "action",
        }]
      });
    };
    modem('GET', 'logs',
      function(json) {
        handler(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template());
    $('.logs', this.el).i18n();
    $('.logstable', this.el).html('');

    this.getLogs();

    return this;
  }

});
