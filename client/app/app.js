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
      .when('/', { redirectTo: '/showme' })
      .when('/generate', {templateUrl: 'views/generate.html', controller: 'generateController'})
      .when('/kitchen', {templateUrl: 'views/kitchen.html', controller: 'kitchenController'})
      .when('/menus', {templateUrl: 'views/menus.html', controller: 'menusController'})
      .when('/editmenus', {templateUrl: 'views/editmenus.html', controller: 'editMenusController'})
      .when('/showme', {templateUrl: 'views/showme.html', controller: 'showMeController'})
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
