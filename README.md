#LunchTranslator

This is a MEAN stack application that manages lunch menu translations

###API
Express app exposing a Restful API backed by MongoDB. Endpoints:
- /translation - GET, POST (target, replacement), PUT (_id, target, replacement)
- /translation/{id} -  GET, DELETE
- /translate - POST (lunch)
- /lunch - GET, POST (date, menu), PUT (_id, date, menu)
- /lunch/{id} - GET, DELETE

###Web Interface
AngularJS app at / to perform CRUD operations. Uses the API.

###Database Startup

     mongod --dbpath mongo

These scripts only need to be run once to populate the database:

     mongoimport --db LunchTranslator --collection lunches --file data/lunches.json
     mongoimport --db LunchTranslator --collection translations --file data/translations.json

###App Startup

     npm start
