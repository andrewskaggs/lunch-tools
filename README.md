#lunch-tools

MEAN stack application that stores lunch menus, performs translations, keeps statistics, and more. Born from the loving nicknames we give our daily catered lunches at [Kabbage](https://www.kabbage.com/) and a desire to learn a new application stack.

[![Build Status](https://travis-ci.org/andrewskaggs/lunch-tools.svg?branch=master)](https://travis-ci.org/andrewskaggs/lunch-tools)
[![Code Climate](https://codeclimate.com/github/andrewskaggs/lunch-tools/badges/gpa.svg)](https://codeclimate.com/github/andrewskaggs/lunch-tools)
[![Test Coverage](https://codeclimate.com/github/andrewskaggs/lunch-tools/badges/coverage.svg)](https://codeclimate.com/github/andrewskaggs/lunch-tools/coverage)

###API
Restful API provided by an [Express](http://expressjs.com/) application. Endpoints:
* /translations - GET, POST (target, replacement)
* /translations/{id} -  GET, PUT (target, replacement), DELETE
* /translate - POST (lunch)
* /lunches - GET, POST (date, menu)
* /lunches/{id} - GET, PUT (date, menu), DELETE
* /lunches/date/YYYY-MM-DD - GET
* /lunches/update - GET to pull new lunches from RSS feed


###Web Interface
[AngularJS](https://angularjs.org/) app built using [Gulp](http://gulpjs.com/). API consumer.

###Database
[MongoDB](https://www.mongodb.org/) connection that defaults to a local instance named "LunchTools" without a password. Start it like this:

```
mkdir mongo
mongod --dbpath mongo
```

To use an external database set the environment variable "LUNCH_TOOLS_MONGO" in the format "USERNAME:PASSWORD@localhost:27017/LunchTools".

These scripts can be run once to seed the database:

```
mongoimport --db LunchTools --collection lunches --file data/lunches.json
mongoimport --db LunchTools --collection translations --file data/translations.json
```

###RSS Consumption
Hit the endpoint `/lunches/update` to consume an RSS feed containing new lunches and add them
to the database. The feed address must be set in the server environment variable `LUNCH_TOOLS_RSS`.  The lunch date is set by the publication date and the lunch contents is found by looking for a `<p>`  tag.


###Startup (Development Mode w/ browser-sync and nodemon)
This is easiest with two terminals.

```
cd server
npm install
npm run dev
```

```
cd client
npm install
gulp
```

###Startup (Production Mode)

```
cd client
npm install
gulp deploy
cd ..\server
npm install
npm start
```

###Windows Deployment
This is is a pain but possible using [IISNODE](https://github.com/tjanczuk/iisnode). Be aware of the following issues:
* A working _web.config_ file is included
* Prefer setting your environment variables in the web.config file instead of through Windows. IIS only reads the Windows environment variables once per boot even if you restart it
* Hosting in an application directory instead of the root requires *LUNCH_TOOLS_BASE_PATH* environment variable be set with the application directory (ie hosting at http://localhost/lunch/ would need a value of "/lunch/").
* Some of the node packages used depend on the _node-gyp_ package. On Windows this requires Python 2.7.x and Visual Studio 2010 to be installed in order to build correctly.
