(function() {

    var component = HMRCSTATS.getUrlParameter('component');
    var repo = HMRCSTATS.getUrlParameter('repo');

    document.querySelector('#issue-details-breadcrumb-url').href = location.href;
    document.querySelector('#issue-details-breadcrumb-text').textContent = HMRCSTATS.capitalise(component);
    document.querySelector('#issue-details-breadcrumb-url').href = location.href;
    document.querySelector('#issue-heading').textContent = HMRCSTATS.capitalise(component);

    HMRCSTATS.getHTML('/public/data/docs/error-message.html', documentationCallback);

    /**
     * documentationCallback
     * 
     * @param {*} err 
     * @param {*} data 
     */
    function documentationCallback(err, data) {
        
        document.querySelector("#docSection").innerHTML = data;

        HMRCSTATS.getJSON('/public/data/top-five-components-' + repo + '.json', issuesCallback);
    }

    /**
     * issuesCallback
     * 
     * @param {*} err 
     * @param {*} data 
     */
    function issuesCallback(err, data) {
        if (err === null) {
            var listItems = '';
        
            HMRCSTATS.cleanData(data);

            for (var i = 0; i < 5; i++) {
                if (data[i].label !== component) {
                    continue;
                }

                if (data[i].labels) {
                    var examples = 0;
                    for (var n = 0; n < data[i].labels.length; n++) {
                        if (data[i].labels[n].label !== component) {
                            continue;
                        }

                        for (var x = 0; x < data[i].labels[n].issues.length; x++) {
                            listItems += '<li>' + HMRCSTATS.escape(data[i].labels[n].issues[x]) + '</li>';
                            examples++;
                            if (examples >= 10) {
                                break;
                            }
                        }
                    }
                }
            }

            document.querySelector('#issue-list').innerHTML = listItems;
        } 
        else {
            console.log(err);
        }
    }
})();
