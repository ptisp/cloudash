var Utils = {
    
    validateJson: function(json) {
        if (json === null) {
            alert('Couldn\'t retrieve data from the server.');
        }
        if (!json.succeeded) {
            // Show error dialog
            if (!json.message) {
                alert(json);
            } else {
                alert(json.message);
            }
            return false;
        }
        return true;
    },
    
    
    getQuerystring: function(key, default_)
    {
        if (default_==null) default_=""; 
        key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if(qs == null)
            return default_;
        else
            return qs[1];
    },

};
