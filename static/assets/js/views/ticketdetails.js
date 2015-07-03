window.TicketDetailsView = Backbone.View.extend({
  events: {
    'click .replyticket': 'showreplymodal',
    'click .btn_send_ticket': 'replyticket',
    'click .closeticket': 'closeticket'
  },
  closeticket: function() {
    modem('DELETE', 'support/'+this.model.get('id'),
      function(json) {
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Abertura de Ticket', json.error);
      }
    );
  },
  replyticket: function() {
    var reply = {
      date: new Date().getTime(),
      message: $("#input_content").val()
    };
    modem('POST', 'support/'+this.model.get('id'),
      function(json) {
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Abertura de Ticket', json.error);
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
    console.log(this.model.toJSON());
    $('#infoid', this.el).html(this.model.get('id'));
    $('#infostatus', this.el).html(this.model.get('status'));
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
