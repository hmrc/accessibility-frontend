## Updating auditing stats

The data is a snapshot in time using the Github API and the results are stored as JSON which the webpages use to display the results.

### Before you start - Create token

Create a [personal github access token](https://github.com/settings/tokens) and save it into the root of the project in a file named `token`

__Note:__ The `token` filename has been added to the `.gitignore` file and care must be taken not to expose your private token.

### Step 1 - Update labels

To update an individual set of labels run the following command:

```
npm run labels [internal|external|live]
```

This will create a new json data file within the `data` folder for the required audit type.


### Step 2 - Update issues

To update the number of issues for each labels run the following command:

```
npm run issues [internal|external|live] [open|closed|all] [wcag|components]
```

This will create a new json data file within the `data` folder for the required audit type.

### Step 3 - Update issue details

To update the details of the top 5 issues for wcag and components run the following command:

```
npm run details [internal|external|live] [open|closed|all] [wcag|components]
```

This will create a new json data file within the `data` folder for the required audit type.
