(function() {

    var myChart;
    var wcagLinks;

    window.onload = function() {
        HMRCSTATS.getJSON('/accessibility/assets/json/issues-wcag-external.json', issuesCallback);
    }

    HMRCSTATS.getJSON('/accessibility/assets/json/wcag.json', wcagCallback);

    /**
     * wcagCallback
     * 
     * @param {*} err 
     * @param {*} data 
     */
    function wcagCallback(err, data) {
        if (err === null) {
            wcagLinks = data;
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

          var tableRows = '';
          var labels = [];
          var issues = [];
          var color = [];

          for (var i = 0; i < 5; i++) {
              if (data[i].issues !== 0) {
                wcagLink = HMRCSTATS.getDocumentationLink(data[i].label, wcagLinks);

                if (wcagLink) {
                  tableRows += '<tr class="govuk-table__row"><td class="govuk-table__cell"><a class="govuk-link" href="' + wcagLink + '">' + data[i].label + '</a></td>';
                }
                else {
                    tableRows += '<tr class="govuk-table__row"><td class="govuk-table__cell">' + data[i].label + '</td>';
                }

                tableRows += '<td class="govuk-table__cell">' + data[i].description + '</td>';
                tableRows += '<td class="govuk-table__cell govuk-table__cell--numeric"><a class="govuk-link" href="/accessibility/issues?issue=' + encodeURIComponent(data[i].label) + '">' + data[i].issues + '</a></td></tr>';
                
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
})();
