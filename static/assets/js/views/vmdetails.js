window.VMDetailsView = Backbone.View.extend({
  initialize: function(options) {
    this.id = options.id;
  },
  events: {
    'click #gotosummary': 'gtsummary',
    'click #gotographs': 'gtgraphs',
    'click #gotoconsole': 'gtconsole',
    'click #gotoresize': 'gtresize',
    'click #gotooptions': 'gtoptions'
  },
  gtoptions: function() {
    app.navigate('/vm/info/'+this.id+'/options', {
      trigger: true
    });
  },
  gtsummary: function() {
    app.navigate('/vm/info/'+this.id+'/summary', {
      trigger: true
    });
  },
  gtgraphs: function() {
    app.navigate('/vm/info/'+this.id+'/graphs', {
      trigger: true
    });
  },
  gtconsole: function() {
    app.navigate('/vm/info/'+this.id+'/console', {
      trigger: true
    });
  },
  gtresize: function() {
    app.navigate('/vm/info/'+this.id+'/resize', {
      trigger: true
    });
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    if (this.model.get('type') !== 'admin') {
      $('.menuadmin', this.el).hide();
    }
    $('.vm-details', this.el).i18n();

    return this;
  }

});
