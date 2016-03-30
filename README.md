# lunch-tools

MEAN stack application that stores lunch menus, performs translations, tracks ratings, and more. Born from the loving nicknames we give our daily catered lunches at [Kabbage](https://www.kabbage.com/) and a desire to learn a new application stack.

[![Build Status](https://travis-ci.org/andrewskaggs/lunch-tools.svg?branch=master)](https://travis-ci.org/andrewskaggs/lunch-tools)
[![Code Climate](https://codeclimate.com/github/andrewskaggs/lunch-tools/badges/gpa.svg)](https://codeclimate.com/github/andrewskaggs/lunch-tools)
[![Test Coverage](https://codeclimate.com/github/andrewskaggs/lunch-tools/badges/coverage.svg)](https://codeclimate.com/github/andrewskaggs/lunch-tools/coverage)

## Using It

### Web App
[AngularJS](https://angularjs.org/) app built using [Gulp](http://gulpjs.com/). Demonstrates API functionality using fun pages like "Show Me Lunch."

### API
Restful API is an [Express](http://expressjs.com/) application. Endpoints:
* `/api/v2/lunches`
  * `GET` - Array containing basics of all lunches
  ```
  [
      {
        date: "2015-07-21",
        menu: "Tacos; Rice; Churros"
      },
      ...
  ]
  ```
  * `POST` (date, menu) - Create a new lunch. Accepts single lunch in url encoded form data or JSON array of lunches.
* `/api/v2/lunches/YYYY-MM-DD`
  * `GET` - Full details about the specified lunch
  ```
  {
      date: "2015-07-21",
      menu: "Tacos; Rice; Churros",
      image: "https://imgur.com/gallery/6sTMEWA",
      ratings:
      [
        {
          date: "2015-07-21"
          name: "Andrew"
          message: "The churros were so good that I ate 12!"
          createDate: "2015-07-21T16:32:26+00:00"
          ip: "127.0.0.1"
        },
        ...
      ],
      comments:
      [
        {
          date: "2015-07-21"
          dish: "Churros"
          rating: 1
          source: "LunchTools.Kitchen"
          type: "UpDownVote"
          createDate: "2015-07-21T16:01:08+00:00"
          ip: "127.0.0.1"
        },
        ...
      ]
  }
  ```
  * `PUT` (menu field only) - update existing lunch
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

`POST` and `PUT` endpoints expect url-encoded forms unless otherwise noted.

## Development

Pull requests for bug fixes or new functionality welcome! Follow these instructions to get up and running.

### Image Search Setup

Lunch Tools now uses the [Bing Search API](https://datamarket.azure.com/dataset/5BA839F1-12CE-4CCE-BF57-A49D98D29A44) to provide image results. Sign up for a free account (5k queries per month) and put your key in the environment variable `LUNCH_TOOLS_BING_API_KEY`. This was formerly provided by the free Google JSON API which has now been discontinued :(

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

The app is now intended to be deployed as a Docker container. The Node.js server is listening on port 3000 serving both API and client app. Supervisor is configured to monitor it.

Docker-Compose file also provided for local development with port 80 and environment variables mapped.
