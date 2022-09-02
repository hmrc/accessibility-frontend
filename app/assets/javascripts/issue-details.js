(function() {

    var issue = HMRCSTATS.getUrlParameter('issue');
    var repo = HMRCSTATS.getUrlParameter('repo');
    var detail = HMRCSTATS.getUrlParameter('detail');
    var category = HMRCSTATS.getUrlParameter('category');
    var documentationLinks;

    document.querySelector('#issue-breadcrumb-text').textContent = HMRCSTATS.formattedIssue(issue);
    document.querySelector('#issue-breadcrumb-url').href = 'issues?' + location.search;
    document.querySelector('#issue-details-breadcrumb-url').href = location.href;
    document.querySelector('#issue-details-breadcrumb-text').textContent = HMRCSTATS.capitalise(detail);
    document.querySelector('#issue-details-breadcrumb-url').href = location.href;
    document.querySelector('#issue-heading').textContent = HMRCSTATS.capitalise(detail);

    HMRCSTATS.getJSON('/public/config/components.json', componentsCallback);

    /**
     * componentsCallback
     * 
     * @param {*} err 
     * @param {*} data 
     */
    function componentsCallback(err, data) {
        if (err === null) {

            var pageText = document.querySelector('#issue-discription');
            var content;

            if (pageText) {

                var link;

                var documentationLink = HMRCSTATS.getDocumentationLink(detail, data);

                if (documentationLink) {
                    link = '<a class="govuk-link" href="' + documentationLink + '" class="govuk-link">' + detail + '</a>';
                }
                else {
                    link = detail;
                }

                switch(category) {
                    case 'component':
                        content = 'of the ' + link + ' component';
                        break;
                    case 'pattern':
                        content = 'of the ' + link + ' pattern';
                        break;
                    case 'auditing':
                        content = 'discovered during ' + (detail === 'audit' ? 'a full ' : 'a ') + detail;
                        break;
                    case 'audit task':
                        content = 'identified during the ' + detail + ' audit task';
                        break;
                    default:
                        content = '';
                }

                pageText.innerHTML = content;
            }
        } else {
            console.log(err);
        }
    }
    
    window.onload = function() {
        
    }

    HMRCSTATS.getJSON('/public/data/top-five-wcag-' + repo + '.json', issuesCallback);

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
                if (data[i].label !== issue) {
                    continue;
                }

                if (data[i].labels) {
                    for (var n = 0; n < data[i].labels.length; n++) {
                        if (data[i].labels[n].label !== detail) {
                            continue;
                        }

                        for (var x = 0; x < data[i].labels[n].issues.length; x++) {
                            listItems += '<li>' + HMRCSTATS.escape(data[i].labels[n].issues[x]) + '</li>';
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
