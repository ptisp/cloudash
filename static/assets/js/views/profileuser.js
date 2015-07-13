window.ProfileUserView = Backbone.View.extend({
  events: {
    'click .btupduser': 'updateuser'
  },
  updateuser: function() {
    var user = {
      'about': {
        'name': $('.editname').val(),
        'phone': $('.editphone').val(),
        'nif': $('.editvat').val()
      },
      'address': {
        'street': $('.editaddress').val(),
        'city': $('.editcity').val(),
        'country': $('.editcountry option:selected').text(),
        'zip': $('.editzipcode').val()
      }
    };
    modem('PUT', 'user/'+this.model.get('id'),
      function(json) {
        window.profile.fetch(null, function(){
          showInfo('Sucesso!', 'Informação Actualizada');
        });
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        showError('ERRO! ', json.error);
        console.log(json);
      }, user);
  },
  getuserinfo: function() {
    var self = this;
    $('.editname', this.el).val(this.model.get('name'));
    $('.editaddress', this.el).val(this.model.get('street'));
    $('.editemail', this.el).val(this.model.get('username'));
    $('.editvat', this.el).val(this.model.get('nif'));
    $('.editzipcode', this.el).val(this.model.get('zip'));
    $('.editcity', this.el).val(this.model.get('city'));
    $('.editphone', this.el).val(this.model.get('phone'));
    $('.editcountry option', this.el).filter(function() {
      return $(this).text().toLowerCase() == self.model.get('country').toLowerCase();
    }).prop('selected', true);
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));

    $('.user-profile', this.el).i18n();

    $('.profilemenu li').removeClass('active');
    $('#profileuser').parent().addClass('active');
    this.getuserinfo();

    return this;
  }

});
