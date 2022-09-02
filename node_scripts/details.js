#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
const auditType = args[0];
const issueState = args[1];
const issueType = args[2];

let accessToken;

try {
    const data = fs.readFileSync('./token', 'utf8');
    accessToken = data.trim();
} 
catch (err) {
    console.error(err);
    process.exit(1);
}

let topFive;

try {
    const issuesFile = fs.readFileSync(`./app/assets/data/issues-${issueType}-${auditType}.json`, 'utf8');
    let issues = JSON.parse(issuesFile);

    issues.sort( function( a, b ) {
        return a.issues > b.issues ? -1 : a.issues < b.issues ? 1 : 0;
    });

    topFive = issues.slice(0,5);
} 
catch (err) {
    console.error(err);
    process.exit(1);
}

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: accessToken
});

console.log(`1. Getting labels for top 5 issues`);

let issues = [];
let requestCount = 0;

topFive.forEach(item => {
    getAllLabelsForIssue(item.label);
});

function getAllLabelsForIssue(label) {
    requestCount++;

    octokit.issues.listForRepo({
        owner: "hmrc",
        repo: "accessibility-audits-" + auditType,
        labels: label,
        state: issueState,
        per_page: 100
    })
    .then(({ data }) => {
        
        let labels = [];

        data.forEach(issue => {
            issue.labels.forEach(label => {

                let newLabel = true;

                for (var i = 0; i < labels.length; i++) {
                    if (labels[i].label === label.name) {
                         labels[i].count = labels[i].count + 1;
                         labels[i].issues.push(formattedTitle(issue));
                         newLabel = false;
                         break;
                    }
                }

                if (newLabel) {
                    let issues = [];
                    issues.push(formattedTitle(issue));
                    labels.push({label: label.name, description: label.description, count: 1, issues: issues});
                }
            });

        });

        labels.sort( function( a, b ) {
            return a.count > b.count ? -1 : a.count < b.count ? 1 : 0;
        });

        const issueJSON = {label: label, labels: labels}
        issues.push(issueJSON);
        
        requestCount--;

        if (requestCount === 0) {

            console.log(`2. Saving data file top-five-${issueType}-${auditType}.json`);
    
            try {
                fs.writeFileSync(`./app/assets/data/top-five-${issueType}-${auditType}.json`, JSON.stringify(issues));
            } catch (err) {
                console.error(err);
            }
        }
    });
}

function formattedTitle(issue) {
    let title = issue.title.replace('Issue:', '');
    title = title.replace('[FIXED]', '');
    title = title.replace('[DRAFT]', '');
    title = title.replace('(AAA)', '');
    title = title.replace('(AA)', '');
    title = title.replace('(A)', '');
    return title.trim();
}
