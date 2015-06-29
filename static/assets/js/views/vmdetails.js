window.VMDetailsView = Backbone.View.extend({
  initialize: function (options) {
    this.id = options.id;
  },
  events: {
    'click .deletevm': 'deletevm'
  },
  deletevm: function() {
    console.log(this.model.get('id'));
    modem('DELETE', 'vm/'+this.model.get('id'),
      function(json) {
        console.log(json);
        showSuccess('SUCESSO', 'VM Apagada');
        app.navigate('home', {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Criação de VM', json.error);
      }
    );
  },
  fillheader: function() {
    if (parseInt(this.model.get('ram')) > 1024) {
      $('.ramusage', this.el).html(parseInt(this.model.get('ram'))/1024 + ' GB');
    } else {
      $('.ramusage', this.el).html(parseInt(this.model.get('ram')) + ' MB');
    }
    $('.cpu', this.el).html(this.model.get('vcpu') + ' vcpu');
    $('.diskusage', this.el).html(this.model.get('disk') + ' GB');
    if (this.model.get('status') === 'running') {
      $('.state', this.el).html('<i class="icon-play m-r-10"></i> Running');
    } else if (this.model.get('status') === 'stopped') {
      $('.state', this.el).html('<i class="icon-stop m-r-10"></i> Stopped');
    } else {
      $('.state', this.el).html('<i class="icon-refresh m-r-10"></i> Pendding');
    }
  },
  refreshState: function() {
    console.log('Get Status');
    var self = this;
    this.model = window.vm.fetch(this.model.get('id'), function() {
      if (self.model.get('status') === 'running') {
        $('.state', self.el).html('<i class="icon-play m-r-10"></i> Running');
      } else if (self.model.get('status') === 'stopped') {
        $('.state', self.el).html('<i class="icon-stop m-r-10"></i> Stopped');
      } else {
        $('.state', self.el).html('<i class="icon-refresh m-r-10"></i> Pendding');
      }
    });
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.fillheader();

    setTimeout(function () {
      setInterval(function () {
        self.refreshState(self.el);
      }, 10000);
    }, 10000);

    return this;
  }

});
