'use strict';

var lunchApp = angular.module('lunchApp', [
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'ngTouch',
  'lunchControllers',
  'lunchDirectives',
  'lunchServices',
  'pickadate'
]);

lunchApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {templateUrl: 'views/kitchen.html', controller: 'kitchenController'})
      .otherwise( { redirectTo: '/' });

    $locationProvider.html5Mode(false).hashPrefix('');
  }
]);

var controllers = angular.module('lunchControllers', []);
var directives = angular.module('lunchDirectives', []);
var services = angular.module('lunchServices', []);
