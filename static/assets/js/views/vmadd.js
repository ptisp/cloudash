window.VMAddView = Backbone.View.extend({
  events: {
    'click .btncreatevm': 'createvm',
    'click .config': 'hideslider',
    'click .manual': 'displayslider'
  },
  hideslider: function() {
    $('.rsliders').hide();
  },
  displayslider: function() {
    $('.rsliders').show();
  },
  createvm: function() {
    if ($('.hostname').val().trim() === '') {
      var emsg = ['Invalid/Blank Hostname', 'Hostname inválido/vazio', 'Hostname no válido/vacío'];
      showError(emsg[getlang()]);
      return;
    }
    var vmdetails = {};
    if ($('.manual').hasClass('active')) {
      vmdetails = {
        'details': {
          'status': 'pending',
          'template': $('.img.active').attr('data-img'),
          'ram': parseInt($('#newram').val()/2*1024),
          'disk': parseInt($('#newdisk').val()),
          'vcpu': parseInt($('#newvcpu').val()),
          'hostname': $('.hostname').val(),
          'interfaces': ['']
        }
      };
    } else {
      vmdetails = {
        'details': {
          'status': 'pending',
          'template': $('.img.active').attr('data-img'),
          'ram': parseInt($('.config.active').attr('data-ram')*1024),
          'disk': parseInt($('.config.active').attr('data-hdd')),
          'vcpu': parseInt($('.config.active').attr('data-cpu')),
          'hostname': $('.hostname').val(),
          'interfaces': ['']
        }
      };
    }
    modem('POST', 'vm',
      function(json) {
        var smsg = ['VM created', 'VM criada', 'VM creada'];
        showSuccess(smsg[getlang()]);
        app.navigate('/vm/info/'+json.id, {
          trigger: true
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to create VM', 'Falha ao criar VM', 'Error al crear VM'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }, vmdetails
    );
  },
  setslider: function() {
    var self = this;
    modem('GET', 'config/resources',
      function(json) {
        $('#newram', self.el).attr('max',parseInt(json.memory)/1024*2);
        $('#rangeInfo').val('0.5');
        $('#newdisk', self.el).attr('max',parseInt(json.storage));
        $('#newvcpu', self.el).attr('max',parseInt(json.cpu));
      },
      function(xhr, ajaxOptions, thrownError) {}
    );
  },
  getimages: function() {
    modem('GET', 'template',
      function(json) {
        for( var i = 0; i < json.templates.length; i++) {
          var img = '';
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
            '<p class="p-elastix ws"><span>'+json.templates[i].name+'</span></p>'+
          '</div>'+
          '</label>';

          $('.plansimg').append(html);
        }

      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to fetch images', 'Falha ao carregar imagens', 'Error al cargar imágenes'];
        showError(emsg[getlang()]+'<br>'+json.error);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-add', this.el).i18n();
    this.getimages();
    this.setslider();
    $('.menulateral li').removeClass('active');
    return this;
  }

});
