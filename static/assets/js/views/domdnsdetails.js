window.DomDnsDetailsView = Backbone.View.extend({
  initialize: function (options) {
    this.domain = options.domain;
  },
  events: {
  },

  render: function() {
    $(this.el).html(this.template());
    $('.domain-dns-details', this.el).i18n();
    $('.overme', this.el).tooltip();
    return this;

  }


});
