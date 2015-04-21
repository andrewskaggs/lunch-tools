#lunch-translator

MEAN stack application that stores and performs menu translations. Born from the loving nicknames we give our daily catered lunches at [Kabbage](https://github.com/kabbageinc) and a desire to learn a new application stack.

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
mongod --dbpath mongo
```

To use an external database set the environment variable "LUNCH_TRANSLATOR_MONGO" in the format "USERNAME:PASSWORD@localhost:27017/LunchTranslator".

These scripts can be run once to seed the database:

```
mongoimport --db LunchTranslator --collection lunches --file data/lunches.json
mongoimport --db LunchTranslator --collection translations --file data/translations.json
```

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
This is pretty tricky, but I did get it working with IISNODE and included the required web.config file. Be sure to set the LUNCH_TRANSLATOR_BASE_PATH environment variable in the web.config to the IIS application directory.
(ie hosting at http://localhost/lunch/ would need a value of "/lunch/")
