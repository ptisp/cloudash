window.TicketDetailsView = Backbone.View.extend({
  events: {
    'click .replyticket': 'showreplymodal',
    'click .btn_send_ticket': 'replyticket',
    'click .closeticket': 'closeticket'
  },
  closeticket: function() {
    modem('DELETE', 'support/'+this.model.get('id'),
      function(json) {
        var smsg = ['Ticket closed', 'Ticket fechado', 'Ticket cerrado'];
        showSuccess(smsg[getlang()]);
        app.navigate('/support/closed', {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to close ticket', 'Falha ao fechar ticket', 'Error al cerrar ticket'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }
    );
  },
  replyticket: function() {
    var self = this;
    var reply = {
      date: new Date().getTime(),
      message: $("#input_content").val()
    };
    modem('POST', 'support/'+this.model.get('id'),
      function(json) {
        var smsg = ['Reply sent', 'Resposta enviada', 'Respuesta enviada'];
        showSuccess(smsg[getlang()]);
        self.t = self.model;
        self.t.fetch(self.model.get('id'), function() {
          self.render();
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to reply ticket', 'Falha ao responder ticket', 'Error al responder ticket'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }, reply
    );
  },
  showreplymodal: function() {
    $('#modal_reply_ticket').on('shown', function() {});
    $('#modal_reply_ticket').modal({});
  },
  gettickets: function() {
    var self = this;
    var handler = function(json) {
      $('#example', self.el).dataTable().fnDestroy();
      var oTable = $('#example', self.el).dataTable({
        "bAutoWidth": false ,
        "data": json,
        "columns": [
          {"data": null,
            "sWidth": "15%",
            "bSortable": true,
            "mRender": function(data, type, full) {
              return formatdate(new Date(parseInt(full.date)));
            }},
          {"data": "email", "width": "20%"},
          {"data": null,
            "bSortable": true,
            "width": "65%",
            "mRender": function(data, type, full) {
              return '<pre>'+full.message+'</pre>';
            }},
        ]
      });
    };

    $('#infoid', this.el).html(this.model.get('id'));
    $('#infostatus', this.el).html(this.model.get('status'));
    if (this.model.get('status').toLowerCase() === 'closed') {
      $('#infostatus', this.el).removeClass('c-green');
      $('#infostatus', this.el).addClass('c-red');
    }
    $('#infosubject', this.el).html(this.model.get('subject'));
    $('#infocount', this.el).html(this.model.get('messages').length);
    $('#infocreated', this.el).html(formatdate(new Date(this.model.get('created'))));
    handler(this.model.get('messages'));
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('#gotohome').removeClass('active');
    $('#gotosupport').addClass('active');
    $('.ticketcontent', this.el).wysihtml5({
      "font-styles": false,
      "image": false,
      "indent": false,
      "outdent": false
    });
    this.gettickets();
    if (this.model.get('status') === 'Closed') {
      $('.closeticket', this.el).hide();
    }
    $('.tdetails', this.el).i18n();
    return this;
  }

});
