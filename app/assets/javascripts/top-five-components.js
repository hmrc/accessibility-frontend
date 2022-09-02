(function() {

    var myChart;
    var repo;
    var documentationLinks;
    
    window.onload = function() {
        var filters = document.getElementsByName("changed-name");
        for (var i=0; i < filters.length; i++) {
          if (filters[i].checked) {
            repo = filters[i].value;
            HMRCSTATS.getJSON('/public/data/issues-components-' + repo + '.json', issuesCallback);
        }
      }
    }

    HMRCSTATS.getJSON('/public/config/components.json', componentsCallback);

    /**
     * componentsCallback
     * 
     * @param {*} err 
     * @param {*} data 
     */
    function componentsCallback(err, data) {
        if (err === null) {
            documentationLinks = data;
        } else {
            console.log(err);
        }
    }

    /**
     * issuesCallback
     * 
     * @param {*} err 
     * @param {*} data 
     */
    function issuesCallback(err, data) {
        if (err === null) {

            data.sort( function( a, b ) {
                return a.issues > b.issues ? -1 : a.issues < b.issues ? 1 : 0;
            });

            let tableRows = '';
            let labels = [];
            let issues = [];
            let color = [];

            for (var i = 0; i < 5; i++) {
                if (data[i].issues !== 0) {
                    documentationLink = HMRCSTATS.getDocumentationLink(data[i].label, documentationLinks);
                    tableRows += '<tr class="govuk-table__row"><td class="govuk-table__cell"><a class="govuk-link" href="' + documentationLink + '" class="govuk-link">' + data[i].label + '</a></td>';
                    tableRows += '<td class="govuk-table__cell">' + data[i].description + '</td>';
                    tableRows += '<td class="govuk-table__cell govuk-table__cell--numeric"><a class="govuk-link" href="https://github.com/hmrc/accessibility-audits-' + repo + '/issues?q=is%3Aissue+label%3A%22' + encodeURIComponent(data[i].label) +  '%22+">' + data[i].issues + '</a></td></tr>';
                   
                    labels.push(data[i].label);
                    issues.push(data[i].issues);
                    color.push('#00703c');
                }
            }

            document.querySelector('#top-issues-list').innerHTML = tableRows;

            chartData = data;

            var ctx = document.getElementById('wcagChart').getContext('2d');
            if (myChart) {
                myChart.destroy();
            }
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# of Issues',
                        data: issues,
                        backgroundColor: color
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }]
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: false,
                        text: 'Top 5 WCAG Issues'
                    },
                    legend: {
                        display: false
                    }
                }
            });
        } else {
            console.log(err);
        }
    }

    document.querySelector('#label-internal').addEventListener('change', updateLabels);
    document.querySelector('#label-live').addEventListener('change', updateLabels);
    document.querySelector('#label-external').addEventListener('change', updateLabels);

    /**
     * updateLabels
     * 
     * @param {*} e 
     */
    function updateLabels(e) {
        HMRCSTATS.getJSON('/public/data/issues-components-' + e.target.value + '.json', issuesCallback);
    }

})();