#LunchTranslator

This is a node.js app that manages lunch menu item translations.

###App Start

     npm start

###Database Start

     mongod --dbpath mongo

These scripts only need to be run once to populate the database:

     mongoimport --db LunchTranslator --collection lunches --file data/lunches.json
     mongoimport --db LunchTranslator --collection translations --file data/translations.json

###API

- /lunch
- /lunch/yyyymmdd
