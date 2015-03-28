#LunchTranslator

This is a MEAN stack application that manages lunch menu translations

###API
Express app exposing a Restful API backed by MongoDB. Endpoints:
- /translations - GET, POST (target, replacement)
- /translations/{id} -  GET, PUT (target, replacement), DELETE
- /translate - POST (lunch)
- /lunches - GET, POST (date, menu)
- /lunches/{id} - GET, PUT (date, menu), DELETE

###Web Interface
AngularJS app at / to perform CRUD operations. Uses the API.

###Database Startup

     mongod --dbpath mongo

These scripts only need to be run once to populate the database:

     mongoimport --db LunchTranslator --collection lunches --file data/lunches.json
     mongoimport --db LunchTranslator --collection translations --file data/translations.json

###App Startup

     npm start
