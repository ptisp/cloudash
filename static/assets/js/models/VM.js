 var VM = Backbone.Model.extend({
  initialize: function() {
  },
  fetch: function(id, after_fetch) {
    var self = this;

    modem('GET', 'vm/'+id,
      function(json) {
        //console.log(json);
        self.set('id', json._id);
        self.set('disk', json.details.disk);
        self.set('hostname', json.details.hostname);
        self.set('image', json.details.image);
        self.set('ip', json.details.ip);
        self.set('ram', json.details.ram);
        self.set('status', json.details.status);
        self.set('vcpu', json.details.vcpu);
        self.set('owner', json.owner);
        self.set('provider_id', json.provider_id);
        self.set('type', json.type);
        after_fetch();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);

      }
    );

  }
});
