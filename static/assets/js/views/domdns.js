window.DomDnsView = Backbone.View.extend({
  events: {
  },

  render: function() {
    $(this.el).html(this.template());
    $('.domain-dns', this.el).i18n();

    return this;

  }
  

});
