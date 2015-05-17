'use strict';

var lunchApp = angular.module('lunchApp', [
  'ngRoute',
  'lunchControllers'
]);

lunchApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('', { redirectTo: '/showme' })
      .when('/menus', {templateUrl: 'views/menus.html', controller: 'menusController'})
      .when('/showme', {templateUrl: 'views/showme.html', controller: 'showMeController'})
      .when('/translations', {templateUrl: 'views/translations.html', controller: 'translationsController'});

    $locationProvider.html5Mode(false).hashPrefix('!');
  }
]);

var controllers = angular.module('lunchControllers', []);
