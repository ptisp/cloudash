window.VMAddView = Backbone.View.extend({
  events: {
    'click .btncreatevm': 'createvm'
  },
  createvm: function() {

    var data = {
      'owner': this.model.get('username'),
      'details': {
        'status': 'review',
        'image': $('.img.active').attr('data-img'),
        'ram': $('.config.active').attr('data-ram'),
        'disk': $('.config.active').attr('data-hdd'),
        'vcpu': $('.config.active').attr('data-cpu'),
        'hostname': $('.hostname').val(),
        'ip': []
      }
    };

    console.log(data);
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.vm-add', this.el).i18n();
    return this;
  }

});
