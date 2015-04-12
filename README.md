#lunch-translator

This is a MEAN stack application that manages lunch menu translations

###API
Express app exposing a Restful API backed by MongoDB. Endpoints:
* /translations - GET, POST (target, replacement)
* /translations/{id} -  GET, PUT (target, replacement), DELETE
* /translate - POST (lunch)
* /lunches - GET, POST (date, menu)
* /lunches/{id} - GET, PUT (date, menu), DELETE

###Web Interface
AngularJS app at / to perform CRUD operations. Uses the API.

###Database Setup
By default the app runs against a local mongodb instance named "LunchTranslator" without any passwords. Start it like this:

```
mongod --dbpath mongo
```

If you have an external database you need to set the "LUNCH_TRANSLATOR_MONGO" environment variable in the format "USERNAME:PASSWORD@localhost:27017/LunchTranslator"

These scripts will need to be run once to populate the database with some seed data:

```
mongoimport --db LunchTranslator --collection lunches --file data/lunches.json
mongoimport --db LunchTranslator --collection translations --file data/translations.json
```

###Startup (Development w/ browser-sync and nodemon)
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

###Startup (Prod)

```
cd client
npm install
gulp deploy
cd ..\server
npm install
npm start
```

###IIS Deployment
This is pretty tricky, but I did get it working with IISNODE and included the required web.config file. Be sure to set the LUNCH_TRANSLATOR_BASE_PATH environment variable in the web.config to the IIS application directory.
(ie hosting at http://localhost/lunch/ would need a value of "/lunch/") 