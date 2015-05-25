window.FooterView = Backbone.View.extend({
  events: {
    'click .github': 'gtgithub'
  },
  gtgithub: function() {
    window.open('https://github.com/ptisp/cloudy', '_system');
  },
  render: function() {
    $(this.el).html(this.template());

    return this;
  }

});
