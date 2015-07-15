window.LogsView = Backbone.View.extend({
  events: {
    'keyup #pesquisa': 'filtro',
    'change #ddshow': 'show'
  },
  filtro: function() {
    var oTable = $('#example').dataTable();
    oTable.fnFilter($('#pesquisa').val());
  },
  show: function() {
    var index = document.getElementById('ddshow').selectedIndex;
    var oTable = $('#example').dataTable();
    var oSettings = oTable.fnSettings();
    oSettings._iDisplayLength = parseInt(document.getElementsByTagName('option')[index].value);
    oTable.fnDraw();
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
        var ettl = ['Error!','Erro!','Error!'];
        var emsg = ['Failed to get logs', 'Falha ao obter registos', 'No se pudo obtener registros'];
        showError(ettl[getlang()], emsg[getlang()]+'<br>'+json.error);
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
