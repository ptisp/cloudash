 var Ticket = Backbone.Model.extend({
  initialize: function() {
  },
  fetch: function(id, after_fetch) {
    var self = this;

    modem('GET', 'support/'+id,
      function(json) {
        self.set('id', json._id);
        self.set('created', json.created);
        self.set('owner', json.owner);
        self.set('status', json.status);
        self.set('messages', json.messages);
        self.set('subject', json.subject);
        after_fetch();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);

      }
    );

  }
});
