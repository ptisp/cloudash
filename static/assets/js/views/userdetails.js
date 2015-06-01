window.UserDetailsView = Backbone.View.extend({
  initialize: function (options) {
    this.id = options.id;
  },

  events: {
  },
  getdetails: function() {
    var self = this;
    modem('GET', 'user/'+self.id,
      function(json) {
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template());
    this.getdetails();
    return this;
  }

});
