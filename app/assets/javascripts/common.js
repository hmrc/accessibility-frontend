(function(HMRCSTATS) {

    HMRCSTATS.getJSON = function(url, callback) {
        HMRCSTATS.getData(url, callback, 'json');
    };

    HMRCSTATS.getHTML = function(url, callback) {
        HMRCSTATS.getData(url, callback, 'html');
    };

    HMRCSTATS.getData = function(url, callback, type) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = type;
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    }; 
    HMRCSTATS.capitalise = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    HMRCSTATS.escape = function(string) {
        return string.replace(/</, '&lt;').replace(/>/, '&gt;');
    }

    HMRCSTATS.getUrlParameter = function(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    HMRCSTATS.formattedIssue = function(title) {
        title = title.replace('(AAA)', '(level AAA)');
        title = title.replace('(AA)', '(level AA)');
        title = title.replace('(A)', '(level A)');
        title = title.replace('wcag', 'WCAG');
        
        return title.trim();
    }

    HMRCSTATS.formattedTitle = function(title) {
        title = title.replace('(AAA)', '');
        title = title.replace('(AA)', '');
        title = title.replace('(A)', '');
        title = title.replace('wcag', 'WCAG');
        
        return title.trim().toUpperCase() + " - ";
    }

    HMRCSTATS.cleanData = function(data) {
        for (var i = 0; i < 5; i++) {
            if (data[i].labels) {
                for (var n = 0; n < data[i].labels.length; n++) {
                    var label = data[i].labels[n].label;
                    if (label.indexOf('hmrc library source') > -1) {
                        data[i].labels.splice(n, 1);
                    }
                }
            }
        }
    }

    HMRCSTATS.getDocumentationLink = function(label, data) {
        for (var i = 0; i < data.length; i++) {
            var dataLink = data[i];
    
            if (dataLink.label == label) {
               return dataLink.url;
           } 
        }
    
        return null;
    }

}(window.HMRCSTATS = window.HMRCSTATS || {}));
