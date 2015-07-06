window.ConfigView = Backbone.View.extend({
  events: {
    'change #fileElem': 'sendlogo',
    'click .changepic': 'loadnewpic',
    'click .clearlogo': 'clearlogo'
  },

  clearlogo: function() {
    var self = this;
    modem('DELETE', 'config/logo',
      function(json) {
        //console.log(json);
        self.render();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },

  sendlogo: function() {
    var self = this;
    fileElem = document.getElementById("fileElem");
    var selectedFile = $('#fileElem')[0].files[0];
    //console.log(selectedFile);

    var reader = new FileReader();
    reader.onload = (function(theFile){
      var fileName = theFile.name;
      return function(e){
          var file = e.target.result;
          //console.log(file);
          var data = {
            rawfile: file
          };
          modem('POST', 'config/logo',
            function(json) {
              self.render();
            },
            function(xhr, ajaxOptions, thrownError) {
              var json = JSON.parse(xhr.responseText);
              console.log(json);
            }, data
          );
      };
    })(selectedFile);
    reader.readAsDataURL(selectedFile);

  },
  loadnewpic: function() {
    fileElem = document.getElementById("fileElem");
    if (fileElem) {
      fileElem.click();
    }
  },

  getlogo: function(){
    var self = this;
    modem('GET', 'config/logo',
      function(json) {
        if (json.file) {
          $('.img-responsive', self.el).attr('src',json.file);
        }
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },

  render: function() {
    $(this.el).html(this.template());
    $("[name='my-checkbox']").bootstrapSwitch();
    $('.config', this.el).i18n();
    this.getlogo();
    return this;
    
  }

});
