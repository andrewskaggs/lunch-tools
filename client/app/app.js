'use strict';

var lunchApp = angular.module('lunchApp', [
  'ngRoute',
  'lunchControllers',
  'lunchDirectives'
]);

lunchApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', { redirectTo: '/translations' })
      .when('/menus', {templateUrl: 'views/menus.html', controller: 'menusController'})
      .when('/showme', {templateUrl: 'views/showme.html', controller: 'showMeController'})
      .when('/statistics', {templateUrl: 'views/statistics.html', controller: 'statisticsController'})
      .when('/translations', {templateUrl: 'views/translations.html', controller: 'translationsController'})
      .otherwise( { redirectTo: '/' });

    $locationProvider.html5Mode(false).hashPrefix('!');
  }
]);

var controllers = angular.module('lunchControllers', []);
var directives = angular.module('lunchDirectives', []);
