'use strict';

var lunchApp = angular.module('lunchApp', [
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'ngTouch',
  'lunchControllers',
  'lunchDirectives',
  'lunchServices'
]);

lunchApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', { redirectTo: '/showme' })
      .when('/analytics', {templateUrl: 'views/analytics.html', controller: 'analyticsController'})
      .when('/menus', {templateUrl: 'views/menus.html', controller: 'menusController'})
      .when('/showme', {templateUrl: 'views/showme.html', controller: 'showMeController'})
      .when('/generate', {templateUrl: 'views/generate.html', controller: 'generateController'})
      .when('/showme/:date', {templateUrl: 'views/showme.html', controller: 'showMeController', reloadOnSearch: false})
      .when('/statistics', {templateUrl: 'views/statistics.html', controller: 'statisticsController'})
      .when('/translations', {templateUrl: 'views/translations.html', controller: 'translationsController'})
      .otherwise( { redirectTo: '/' });

    $locationProvider.html5Mode(false).hashPrefix('');
  }
]);

var controllers = angular.module('lunchControllers', []);
var directives = angular.module('lunchDirectives', []);
var services = angular.module('lunchServices', []);
