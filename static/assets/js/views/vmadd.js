window.VMAddView = Backbone.View.extend({
  events: {
    'click .btncreatevm': 'createvm'
  },
  createvm: function() {

    var vmdetails = {
      'details': {
        'status': 'pending',
        'template': $('.img.active').attr('data-img'),
        'ram': parseInt($('.config.active').attr('data-ram')*1024),
        'disk': parseInt($('.config.active').attr('data-hdd')),
        'vcpu': parseInt($('.config.active').attr('data-cpu')),
        'hostname': $('.hostname').val(),
        'ip': ['']
      }
    };
    console.log(vmdetails);
    modem('POST', 'vm',
      function(json) {
        showSuccess('Sucesso!', 'VM Adicionada');
        app.navigate('/vm/info/'+json.id, {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Criação de VM', json.error);
      }, vmdetails
    );
  },
  getimages: function() {
    modem('GET', 'template',
      function(json) {
        console.log(json);
        for( var i = 0; i < json.templates.length; i++) {
          var img = '';
          console.log(json.templates[i]);
          if (json.templates[i].name.toLowerCase().indexOf('centos') > -1) {
            img = 'assets/img/soft/centos.png';
          } else if (json.templates[i].name.toLowerCase().indexOf('debian') > -1) {
            img = 'assets/img/soft/debian.png';
          } else if (json.templates[i].name.toLowerCase().indexOf('ubuntu') > -1) {
            img = 'assets/img/soft/ubuntu.png';
          } else if (json.templates[i].name.toLowerCase().indexOf('coreos') > -1) {
            img = 'assets/img/soft/coreos.png';
          } else if (json.templates[i].name.toLowerCase().indexOf('suse') > -1) {
            img = 'assets/img/soft/opensuse.png';
          } else if (json.templates[i].name.toLowerCase().indexOf('fedora') > -1) {
            img = 'assets/img/soft/fedora.png';
          } else {
            img = 'assets/img/soft/linux.png';
          }
          var active = '';
          if (i === 0) {
            active = 'active';
          }
          var html = '<label class="btn btn-default col-sm-2 cloudy-plans img '+active+'" data-img="'+json.templates[i].id+'">'+
          '<input type="radio">'+
          '<div class="cloudy-plans-specs">'+
            '<img src="'+ img +'" class="soft-img m-b-10 img-responsive">'+
            '<p class="b03"><span>'+json.templates[i].name+'</span></p>'+
          '</div>'+
          '</label>';

          $('.plansimg').append(html);
        }

      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - Carregar Imagens', json.error);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-add', this.el).i18n();
    this.getimages();
    return this;
  }

});
