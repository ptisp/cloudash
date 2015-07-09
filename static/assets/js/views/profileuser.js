window.ProfileUserView = Backbone.View.extend({
  events: {
  },
  getuserinfo: function() {
    $('.pname', this.el).val(this.model.get('name'));
    $('.pcountry', this.el).val(this.model.get('country'));
    $('.paddress', this.el).val(this.model.get('street'));
    $('.pemail', this.el).val(this.model.get('username'));
    $('.pnif', this.el).val(this.model.get('nif'));
    $('.pzip', this.el).val(this.model.get('zip'));
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    console.log(this.model);
    $('.user-profile', this.el).i18n();
    this.getuserinfo();
    return this;
  }

});
