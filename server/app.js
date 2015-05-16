#!/usr/bin/env node
var debug = require('debug')('LunchTranslator');
var nunjucks = require('nunjucks');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// mongo initialization
var mongo = require('mongodb');
var monk = require('monk');
var mongoConnectionString = 'localhost:27017/LunchTranslator';
if (process.env.LUNCH_TRANSLATOR_MONGO) {
    mongoConnectionString = process.env.LUNCH_TRANSLATOR_MONGO;
}
var db = monk(mongoConnectionString);

var app = express();

// view engine setup
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req,res,next){req.db = db;next();});

// routing setup  - iisnode feeds in the whole path instead of
// the application directory relative path so windows deployments
// need to set the LUNCH_TRANSLATOR_BASE_PATH environment variable
var routeBase = '/';
if (process.env.LUNCH_TRANSLATOR_BASE_PATH) {
	routeBase = process.env.LUNCH_TRANSLATOR_BASE_PATH;
}

// route static files
app.use(routeBase, express.static(path.join(__dirname, 'public')));
app.use(routeBase, express.static(path.join(__dirname, 'client')));

//include the controllers and route them
var lunchRoutes = require('./routes/lunches');
var translationRoutes = require('./routes/translations');
var translateRoutes = require('./routes/translate');
app.use(routeBase + 'lunches', lunchRoutes);
app.use(routeBase + 'translations', translationRoutes);
app.use(routeBase + 'translate', translateRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log(req);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler includes stack trace
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

// finally start it up
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
