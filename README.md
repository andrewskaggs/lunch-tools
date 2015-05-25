#lunch-translator

MEAN stack application that stores and performs menu translations. Born from the loving nicknames we give our daily catered lunches at [Kabbage](https://github.com/kabbageinc) and a desire to learn a new application stack.

[![Build Status](https://travis-ci.org/andrewskaggs/lunch-translator.svg?branch=master)](https://travis-ci.org/andrewskaggs/lunch-translator)
[![Code Climate](https://codeclimate.com/github/andrewskaggs/lunch-translator/badges/gpa.svg)](https://codeclimate.com/github/andrewskaggs/lunch-translator)
[![Test Coverage](https://codeclimate.com/github/andrewskaggs/lunch-translator/badges/coverage.svg)](https://codeclimate.com/github/andrewskaggs/lunch-translator)

###API
Restful API provided by Express application. Endpoints:
* /translations - GET, POST (target, replacement)
* /translations/{id} -  GET, PUT (target, replacement), DELETE
* /translate - POST (lunch)
* /lunches - GET, POST (date, menu)
* /lunches/{id} - GET, PUT (date, menu), DELETE

###Web Interface
AngularJS app at / to perform management operations. API consumer.

###Database
MongoDB connection that defaults to a local instance named "LunchTranslator" without a password. Start it like this:

```
mkdir mongo
mongod --dbpath mongo
```

To use an external database set the environment variable "LUNCH_TRANSLATOR_MONGO" in the format "USERNAME:PASSWORD@localhost:27017/LunchTranslator".

These scripts can be run once to seed the database:

```
mongoimport --db LunchTranslator --collection lunches --file data/lunches.json
mongoimport --db LunchTranslator --collection translations --file data/translations.json
```

###RSS Consumption
Hit the endpoint `/lunches/update` to consume an RSS feed containing new lunches and add them
to the database. The feed address must be set in the server environment variable `LUNCH_TRANSLATOR_RSS`.  The lunch date is set by the publication date and the lunch contents is found by looking for a `<p>`  tag.


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

###IIS Deployment
Windows and node.js is still pretty tricky but I did get it working with [IISNODE](https://github.com/tjanczuk/iisnode) and included the web.config file. I recommend setting all envrionment variables in the web.config due to the way IIS reads them once per boot. Hosting in an application directory instead of the root requires `LUNCH_TRANSLATOR_BASE_PATH` environment variable be set with the application directory (ie hosting at http://localhost/lunch/ would need a value of "/lunch/").
