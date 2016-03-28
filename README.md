# lunch-tools

MEAN stack application that stores lunch menus, performs translations, tracks ratings, and more. Born from the loving nicknames we give our daily catered lunches at [Kabbage](https://www.kabbage.com/) and a desire to learn a new application stack.

[![Build Status](https://travis-ci.org/andrewskaggs/lunch-tools.svg?branch=master)](https://travis-ci.org/andrewskaggs/lunch-tools)
[![Code Climate](https://codeclimate.com/github/andrewskaggs/lunch-tools/badges/gpa.svg)](https://codeclimate.com/github/andrewskaggs/lunch-tools)
[![Test Coverage](https://codeclimate.com/github/andrewskaggs/lunch-tools/badges/coverage.svg)](https://codeclimate.com/github/andrewskaggs/lunch-tools/coverage)

## Using It

### Web App
[AngularJS](https://angularjs.org/) app built using [Gulp](http://gulpjs.com/). Demonstrates API functionality using fun pages like "Show Me Lunch."

### API
Restful API provided by an [Express](http://expressjs.com/) application. Endpoints:
* `/api/v2/lunches`
  * `GET` - All lunches (date and menu fields only)
  * `POST` (date, menu) - new lunch
* `/api/v2/lunches/YYYY-MM-DD`
  * `GET` - Lunch details including ratings and comments
  * `PUT` (menu) - update existing lunch
  * `DELETE`
* `/api/v2/lunches/YYYY-MM-DD/ratings`
  * `POST` (rating) - add an Up Vote/Down Vote style rating (-1 or 1)
* `/api/v2/lunches/YYYY-MM-DD/comments`
  * `POST` (name, message) - add a comment. name is optional
* `/api/v2/lunches/generate`
  * `GET` - returns a randomly generated lunch menu  
* `/api/v2/translations`
  * `GET` - all translations
  * `POST` (target, replacement) - new translation
* `/api/v2/translations/{id}`
  * `GET`
  * `PUT` (target, replacement) - update existing translation
  * `DELETE`
* `/api/v2/translate`
  * `POST` (lunch)

All `GET` endpoints support JSONP when using the query string param `callback`.

## Development

Pull requests for bug fixes or new functionality welcome! Follow these instructions to get up and running.

### Image Search Setup

Lunch Tools now uses the [Bing Search API](https://datamarket.azure.com/dataset/5BA839F1-12CE-4CCE-BF57-A49D98D29A44) to provide image results. Sign up for a free account (5k queries per month) and put you key in the environment variable `LUNCH_TOOLS_BING_API_KEY`. This was formerly provided by the free Google JSON API which has now been discontinued.

### Database Setup
[MongoDB](https://www.mongodb.org/) connection that defaults to a local instance named "LunchTools" without a password. Start it like this:

```
mkdir mongo
mongod --dbpath mongo
```

To use an external database set the environment variable `LUNCH_TOOLS_MONGO` in the format "USERNAME:PASSWORD@localhost:27017/LunchTools".

These scripts can be run once to seed the database:

```
mongoimport --db LunchTools --collection lunches --file data/lunches.json
mongoimport --db LunchTools --collection translations --file data/translations.json
```

### Local development with browser-sync
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

## Deployment

The app is now configured for deployment with Docker. The Node server serves both API and client with supervisor configured to monitor it.

Docker-Compose file also provided with port 80 exposed and LUNCH_TOOLS environment variables mapped.
