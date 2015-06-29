window.VMDetailsView = Backbone.View.extend({
  initialize: function (options) {
    this.id = options.id;
  },
  events: {
    'click .deletevm': 'deletevm',
    'click .actionvm': 'vmaction'
  },
  vmaction: function(evt) {
    var uri = '';
    console.log($(evt.target).attr('data-action'));
    switch ($(evt.target).attr('data-action')) {
      case 'start': uri = 'vm/'+this.model.get('id')+'/start'; break;
      case 'pause': uri = 'vm/'+this.model.get('id')+'/pause'; break;
      case 'stop': uri = 'vm/'+this.model.get('id')+'/stop'; break;
      case 'hstop': uri = 'vm/'+this.model.get('id')+'/stop/true'; break;
      case 'reboot': uri = 'vm/'+this.model.get('id')+'/restart'; break;
      case 'hreboot': uri = 'vm/'+this.model.get('id')+'/restart/true'; break;

    }
    console.log(uri);
    
    modem('POST', uri,
      function(json) {
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Criação de VM', json.error);
      }
    );

  },
  remove: function() {
    if(this.loop) {
      clearInterval(this.loop);
    }
    this.$el.remove();
    this.stopListening();
    return this;
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
      $('.state', this.el).addClass('c-green');
      $('.state', this.el).html('<i class="icon-play m-r-10 c-green"></i> Running');
    } else if (this.model.get('status') === 'stopped') {
      $('.state', this.el).addClass('c-red');
      $('.state', this.el).html('<i class="icon-stop m-r-10 c-red"></i> Stopped');
    } else {
      $('.state', this.el).addClass('c-gold');
      $('.state', this.el).html('<i class="icon-refresh m-r-10 c-gold"></i> Pending');
    }
  },
  refreshState: function() {
    console.log('Get Status');
    var self = this;
    window.vm.fetch(this.model.get('id'), function() {
      self.model = window.vm;
      if (self.model.get('status') === 'running') {
        $('.state', self.el).html('<i class="icon-play m-r-10 c-green"></i> Running');
      } else if (self.model.get('status') === 'stopped') {
        $('.state', self.el).html('<i class="icon-stop m-r-10 c-red"></i> Stopped');
      } else {
        $('.state', self.el).html('<i class="icon-refresh m-r-10 c-gold"></i> Pending');
      }
    });
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.fillheader();
    var self = this;
/*
    this.loop = setInterval(function () {
      self.refreshState(self.el);
    }, 10000);
*/
    return this;
  }

});
