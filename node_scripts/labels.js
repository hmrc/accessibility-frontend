#!/usr/bin/env node

const fs = require('fs');
const args = process.argv.slice(2);
const auditType = args[0];

let accessToken;

try {
    const data = fs.readFileSync('./token', 'utf8');
    accessToken = data.trim();
} 
catch (err) {
    console.error(err);
    process.exit(1);
}

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: accessToken
});

console.log(`1. Get labels for repo accessibility-audits-${auditType}`);

let labels = [];

function getLabels(page) {

    console.log(`2. Getting data for page ${page}`);

    octokit.issues.listLabelsForRepo({
        owner: "hmrc",
        repo: "accessibility-audits-" + auditType,
        per_page: 100,
        page: page
    })
    .then(({ data }) => {
    
        if (data.length === 0) {
            console.log(`3. Saving data file labels-${auditType}.json`);
        
            try {
                fs.writeFileSync(`./data/labels-${auditType}.json`, JSON.stringify(labels));
            } catch (err) {
                console.error(err);
            }

            return;
        }

        labels.push.apply(labels, data);

        page = page + 1;

        getLabels(page);
    });
}

getLabels(1);
