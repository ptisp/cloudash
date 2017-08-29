window.ManageUserDetailsView = Backbone.View.extend({
  initialize: function(options) {
    this.id = options.id;
  },
  events: {
    'click .btnedituser': 'update',
    'click .range-cloudy .btn-cloudy.stepup': 'plus',
    'input .range-cloudy .slider': 'slider',
    'click .range-cloudy .btn-cloudy.stepdown': 'minus',
    'focusout .range-cloudy .inout': 'focusout',
    'keyup .range-cloudy .inout': 'enter'
  },
  slider: function(e){
    var $slider = $(e.target);
    var $input = $(e.target).parents('.range-cloudy').find('.inout');
    $input.val($slider.val());
    $slider.removeAttr('data-unlimited');
  },
  minus: function(e){
    var $btn = $(e.target);
    var $slider = $(e.target).parents('.range-cloudy').find('.slider');
    var $input = $(e.target).parents('.range-cloudy').find('.inout');
    $slider[0].stepDown();
    $input.val($slider.val());
    $slider.removeAttr('data-unlimited');
  },
  plus: function(e){
    var $btn = $(e.target);
    var $slider = $(e.target).parents('.range-cloudy').find('.slider');
    var $input = $(e.target).parents('.range-cloudy').find('.inout');
    $slider[0].stepUp();
    $input.val($slider.val());
    $slider.removeAttr('data-unlimited');
  },
  focusout: function(e){
    var $input = $(e.target);
    var $slider = $(e.target).parents('.range-cloudy').find('.slider');

    if ($input.val() == -1) {
      $slider.val($slider.attr('max'));
      $slider.attr('data-unlimited', true);
      $input.val('\u221E');
      return;
    }
    if(parseFloat($input.val()) >= parseFloat($slider.attr('min')) && parseFloat($input.val()) <= parseFloat($slider.attr('max'))) {
      var v = parseFloat($input.val());
      $slider.val(v);
      $input.val($slider.val());
    }
    else {
      $slider.val($slider.attr('min'));
      $input.val($slider.attr('min'));
    }
    $slider.removeAttr('data-unlimited');
  },
  enter: function(e){
    if(e.keyCode == 13){
      $(e.target).blur();
    }
  },
  _getSliderValue: function(slider, mult){
    mult = mult || 1;
    var unlim = slider.attr('data-unlimited');

    if(unlim == 'true'){
      return -1;
    }

    return parseFloat(slider.val()) * mult;
  },
  _cInfinity: function(v){
    return v == -1 ? '\u221E' : v;
  },
  fillheaders: function(vms, user) {
    var vm = vms.length,
      ram = 0,
      hdd = 0,
      active = 0,
      cpu = 0;
    for (var i = 0; i < vms.length; i++) {
      ram += parseInt(vms[i].details.ram);
      hdd += parseInt(vms[i].details.disk);
      cpu += parseInt(vms[i].details.vcpu);
      if (vms[i].details.status === 'running') {
        active++;
      }
    }
    ram = parseInt(ram);
    $('.vmtotal', this.el).html(vm);
    $('.ramusage', this.el).html(ram);
    $('.diskusage', this.el).html(hdd);
    $('.cpuusage', this.el).html(cpu);
    $('.activevm', this.el).html(active);

    $('.ramtotal', this.el).html(this._cInfinity(user.maxresources.memory));
    $('.disktotal', this.el).html(this._cInfinity(user.maxresources.storage));
    $('.cputotal', this.el).html(this._cInfinity(user.maxresources.cpu));

    $('.pbram', self.el).width(user.maxresources.memory == -1 ? '0%' : (parseInt(parseInt(ram) / parseInt(user.maxresources.memory) * 100) + '%'));
    $('.pbhdd', self.el).width(user.maxresources.storage == -1 ? '0%' : (parseInt(parseInt(hdd) / parseInt(user.maxresources.storage) * 100) + '%'));
    $('.pbcpu', self.el).width(user.maxresources.cpu == -1 ? '0%' : (parseInt(parseInt(cpu) / parseInt(user.maxresources.cpu) * 100) + '%'));
    $('.pbvms', self.el).width(parseInt(parseInt(active) / parseInt(vm) * 100) + '%');
  },
  getvms: function(user) {
    var self = this;
    modem('GET', 'vm',
      function(json) {
        var vms = [];
        for (var i = 0; i < json.length; i++) {
          if (json[i].owner === user._id) {
            vms.push(json[i]);
          }
        }
        self.fillheaders(vms, user);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to load VMs', 'Falha ao carregar VMs', 'Error al cargar VMs'];
        showError(emsg[getlang()] + '<br>' + json.error);
      }
    );
  },
  update: function() {
    var self = this;
    var user = {
      'auth': {},
      'about': {
        'name': $('.ipname').val(),
        'phone': $('.ipphone').val(),
        'nif': $('.ipvat').val()
      },
      'address': {
        'street': $('.ipaddress').val(),
        'city': $('.ipcity').val(),
        'country': $('.ipcountry option:selected').text(),
        'zip': $('.ipzipcode').val()
      },
      'maxresources': {
        'memory': this._getSliderValue($('#editram'), 1024),
        'storage': this._getSliderValue($('#editdisk')),
        'vms': this._getSliderValue($('#newvms')),
        'cpu': this._getSliderValue($('#editvcpu'))
      },
      'type': $('.iptype').val(),
      'status': $('.ipstatus').val()
    };
    if ($('.ippass').val().trim() !== '') {
      if (this.passwordcheck($('.ippass').val(), $('.iprepass').val())) {
        user.auth = {
          'password': $('.iprepass').val()
        };
      } else {
        var wttl = ['Warning!', 'Aviso!', 'Advertencia!'];
        var wmsg = ['Please check your password', 'Por favor, verifique a sua password', 'Por favor, consultar su contraseña'];
        showWarning(wttl[getlang()], wmsg[getlang()]);
        return;
      }
    }
    modem('PUT', 'user/' + this.id,
      function(json) {
        var smsg = ['User updated', 'Utilizador actualizado', 'Usuario se actualiza'];
        showSuccess(smsg[getlang()]);
        self.render();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        var emsg = ['Failed to update user', 'Falha ao atualizar utilizador', 'Error al actualizar el usuario'];
        showError(emsg[getlang()] + '<br>' + json.error);
      }, user
    );
  },
  passwordcheck: function(pass, repass) {
    pass = pass.trim();
    repass = repass.trim();
    if (pass == repass && pass.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  showdetails: function(info) {
    $('.ipemail', this.el).val(info.auth.username);
    $('.ipname', this.el).val(info.about.name);
    $('.ipcity', this.el).val(info.address.city);
    $('.ipaddress', this.el).val(info.address.street);
    $('.ipphone', this.el).val(info.about.phone);
    $('.ipvat', this.el).val(info.about.nif);
    $('.ipzipcode', this.el).val(info.address.zip);

    if(parseInt(info.maxresources.memory) === -1){
      $('#editram', this.el).attr('data-unlimited', true);
      $('#editram', this.el).val($('#editram', this.el).attr('max'));
      $('#rangeInfo', this.el).val('\u221E');
    }
    else{
      $('#editram', this.el).val(parseInt(info.maxresources.memory) / 1024);
      $('#rangeInfo', this.el).val(parseInt(info.maxresources.memory) / 1024);
    }

    if(parseInt(info.maxresources.storage) === -1){
      $('#editdisk', this.el).attr('data-unlimited', true);
      $('#editdisk', this.el).val($('#editdisk', this.el).attr('max'));
      $('#rangeGold', this.el).val('\u221E');
    }
    else{
      $('#editdisk', this.el).val(parseInt(info.maxresources.storage));
      $('#rangeGold', this.el).val(parseInt(info.maxresources.storage));
    }

    if(parseInt(info.maxresources.cpu) === -1){
      $('#editvcpu', this.el).attr('data-unlimited', true);
      $('#editvcpu', this.el).val($('#editvcpu', this.el).attr('max'));
      $('#rangeDanger', this.el).val('\u221E');
    } else{
      $('#editvcpu', this.el).val(parseInt(info.maxresources.cpu));
      $('#rangeDanger', this.el).val(parseInt(info.maxresources.cpu));
    }

    if(parseInt(info.maxresources.vms) === -1){
      $('#newvms', this.el).attr('data-unlimited', true);
      //$('#newvms', this.el).val($('#newvms', this.el).attr('max'));
      $('#newvms', this.el).val($('#newvms', this.el).attr('max'));
      $('#vmsInfo', this.el).val('\u221E');
    } else{
      $('#newvms', this.el).val(parseInt(info.maxresources.vms));
      $('#vmsInfo', this.el).val(parseInt(info.maxresources.vms));
    }

    $('.ipcountry option').filter(function() {
      return $(this).text().toLowerCase() == info.address.country.toLowerCase();
    }).prop('selected', true);
    $('.ipstatus option').filter(function() {
      return $(this).val().toLowerCase() == info.status.toLowerCase();
    }).prop('selected', true);
    $('.iptype option').filter(function() {
      return $(this).val().toLowerCase() == info.type.toLowerCase();
    }).prop('selected', true);
    if (info.type === 'admin') {
      $('.useronly', this.el).hide();
    }
  },
  getdetails: function() {
    var self = this;
    modem('GET', 'user/' + self.id,
      function(json) {
        self.showdetails(json);
        self.getvms(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
      }
    );
  },
  setslider: function() {
    var self = this;
    modem('GET', 'config/resources',
      function(json) {
        $('#editram', self.el).attr('max', parseInt(json.memory) / 1024);
        $('#editdisk', self.el).attr('max', parseInt(json.storage));
        $('#editvcpu', self.el).attr('max', parseInt(json.cpu));
        $('#newvms', self.el).attr('max', parseInt(json.cpu));
      },
      function(xhr, ajaxOptions, thrownError) {}
    );
  },
  render: function() {
    $(this.el).html(this.template());
    this.setslider();
    $('.user-details', this.el).i18n();
    $('.managemenu li').removeClass('active');
    this.getdetails();
    return this;
  }


});
