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

let labels;

try {
    const labelsFile = fs.readFileSync(`./data/labels-${auditType}.json`, 'utf8');
    labels = JSON.parse(labelsFile);
} 
catch (err) {
    console.error(err);
    process.exit(1);
}

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: accessToken
});

console.log(`1. Getting issues for each label`);

let issues = [];
let requestCount = 0;

if (issueType === 'wcag') {
    getWCAGIssues();
}
else {
    getComponentIssues();
}

function getWCAGIssues() {
    labels.forEach(label => {
    
        if (label.name.indexOf("wcag") > -1 && label.name !== 'wcag') {
            getIssues(label);
        }
    });
}

function getComponentIssues() {
    labels.forEach(label => {
    
        // HMRC and GOV.UK design system label colours
        if (label.color.toUpperCase() === '006B75' || label.color.toUpperCase() === '0E8A16') {
            getIssues(label);
        }
    });
}

function getIssues(label) {
    requestCount++;

    octokit.issues.listForRepo({
        owner: "hmrc",
        repo: "accessibility-audits-" + auditType,
        labels: label.name,
        state: issueState,
        per_page: 100
    })
    .then(({ data }) => {
        const issueJSON = {label: label.name, description: label.description, issues: data.length}
        issues.push(issueJSON);
        requestCount--;

        if (requestCount === 0) {
            console.log(`2. Saving data file issues-${issueType}-${auditType}.json`);
        
            try {
                fs.writeFileSync(`./data/issues-${issueType}-${auditType}.json`, JSON.stringify(issues));
            } catch (err) {
                console.error(err);
            }
        }
    });
}
