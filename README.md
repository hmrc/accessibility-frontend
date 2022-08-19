
# DIAS Accessibility documentation site

## Developing this project

1. Open a terminal in your development folder and checkout the project

```
git clone git@github.com:hmrc/accessibility-frontend.git
```

2. Open Intellij IDEA and then open the project folder just created

This will then download external libraries required to run the project. When asked do not add them to the project.

3. In the terminal change to the project folder and start the service running locally

```
cd accessibility-frontend

sbt run
```

4. Open the site in the browser using the following address

```
http://localhost:9000/accessibility/
```

When changes are made in Intellij IDEA the project will automatically build and deploy the changes. This may take a few seconds, once done refresh the manually browser to see the update.

### Creating a new page

To create a new page you should use the built-in scaffold 'contentPage' to create the necessary project files.

Follow Wiki the instructions on [how to create a content page](https://github.com/hmrc/hmrc-frontend-scaffold.g8/wiki/Usage#content-page).

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").