window.ConfigView = Backbone.View.extend({
  events: {
    'change #fileElem': 'showlogo',
    'click .preview': 'loadnewpic',
    'click .clearlogo': 'clearlogo',
    'click .savelogo': 'sendlogo',
    'click .savesupport': 'sendsupport'
  },

  clearlogo: function() {
    var self = this;
    this.file = undefined;
    var data = {
      support: $("[name='my-checkbox']").is(':checked')
    };
    modem('DELETE', 'config/logo',
      function(json) {
        //console.log(json);
        self.render();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }, data
    );
  },
  sendlogo: function() {
    var self = this;
    if (!this.file){
      return;
    }
    var data = {
      rawfile: this.file,
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
  },
  sendsupport: function() {
    var self = this;
    var data = {
      support: $("[name='my-checkbox']").is(':checked')
    };
    modem('POST', 'config/support',
      function(json) {
        self.render();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }, data
    );
  },

  showlogo: function() {
    var self = this;
    fileElem = document.getElementById("fileElem");
    var selectedFile = $('#fileElem')[0].files[0];
    //console.log(selectedFile);

    var reader = new FileReader();
    reader.onload = (function(theFile){
      var fileName = theFile.name;
      return function(e){
        self.file = e.target.result;
        $('.preview', self.el).attr('src', self.file);
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
          $('.current', self.el).attr('src',json.file);
        }
        if (json.support == 'false') {
          $("[name='my-checkbox']", self.el).bootstrapSwitch('state', false, true);
          $('#gotosupport').hide();
        } else {
          $("[name='my-checkbox']", self.el).bootstrapSwitch('state', true, true);
          $('#gotosupport').show();
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
    $("[name='my-checkbox']", this.el).bootstrapSwitch();
    $('.config', this.el).i18n();
    this.getlogo();
    return this;

  }

});
