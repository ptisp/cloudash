window.HeaderView = Backbone.View.extend({
  events: {
  },
  getgravatar: function() {
    var pic = sessionStorage.getItem('user');
    $('.headgravatar',this.el).attr('src','http://www.gravatar.com/avatar/'+pic);
  },
  render: function() {
    $(this.el).html(this.template());
    this.getgravatar();
    return this;
  }

});
