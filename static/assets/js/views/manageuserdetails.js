window.ManageUserDetailsView = Backbone.View.extend({
  initialize: function (options) {
    this.id = options.id;
  },
  events: {
    'click .edit': 'enableedit',
    'click .btnedituser': 'update'
  },
  update: function() {
    var user = {
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
        'memory': parseInt($('#editram').val()/2*1024),
        'storage': parseInt($('#editdisk').val()),
        'cpu': parseInt($('#editvcpu').val())
      },
      'type': $('.iptype').val(),
      'status': $('.ipstatus').val()
    };
    modem('PUT', 'user/'+this.id,
      function(json) {
        showSuccess('Sucesso!', 'Utilizador Modificado');
        //console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }, user
    );
  },
  enableedit: function() {
    $('.editable', this.el).prop('disabled', false);
  },
  showdetails: function(info) {
    $('.ipemail', this.el).val(info.auth.username);
    $('.ipname', this.el).val(info.about.name);
    $('.ipcity', this.el).val(info.address.city);
    $('.ipaddress', this.el).val(info.address.street);
    $('.ipphone', this.el).val(info.about.phone);
    $('.ipvat', this.el).val(info.about.nif);
    $('.ipzipcode', this.el).val(info.address.zip);
    $('#editram', this.el).val(parseInt(info.maxresources.memory)/1024*2);
    $('#editdisk', this.el).val(parseInt(info.maxresources.storage));
    $('#editvcpu', this.el).val(parseInt(info.maxresources.cpu));
    $('#rangeInfo', this.el).val(parseInt(info.maxresources.memory)/1024);
    $('#rangeGold', this.el).val(parseInt(info.maxresources.storage));
    $('#rangeDanger', this.el).val(parseInt(info.maxresources.cpu));
    $('.ipcountry option').filter(function() {
      return $(this).text().toLowerCase() == info.address.country.toLowerCase();
    }).prop('selected', true);
    $('.ipstatus option').filter(function() {
      return $(this).val().toLowerCase() == info.status.toLowerCase();
    }).prop('selected', true);
    $('.iptype option').filter(function() {
      return $(this).val().toLowerCase() == info.type.toLowerCase();
    }).prop('selected', true);
  },
  getdetails: function() {
    var self = this;
    modem('GET', 'user/'+self.id,
      function(json) {
        //console.log(json);
        self.showdetails(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }
    );
  },
  setslider: function() {
    var self = this;
    modem('GET', 'config/resources',
      function(json) {
        $('#editram', self.el).attr('max',parseInt(json.memory)/1024*2);
        $('#editdisk', self.el).attr('max',parseInt(json.storage));
        $('#editvcpu', self.el).attr('max',parseInt(json.cpu));
      },
      function(xhr, ajaxOptions, thrownError) {}
    );
  },
  render: function() {
    $(this.el).html(this.template());
    this.setslider();
    $('.user-details', this.el).i18n();
    $('.editable', this.el).prop('disabled', true);
    $('.managemenu li').removeClass('active');
    this.getdetails();
    return this;
  }


});
