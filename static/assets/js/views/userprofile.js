window.UserProfileView = Backbone.View.extend({
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
  getgravatar: function() {
    var pic = this.model.get('gravatar');
    $('.profilegravatar',this.el).attr('src','http://www.gravatar.com/avatar/'+pic);
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    $('.user-profile', this.el).i18n();
    this.getuserinfo();
    this.getgravatar();
    return this;
  }

});
