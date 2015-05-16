'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('menusController', [ '$scope',
  function($scope) {
    $scope.message = "menu stuff";
  }
]);
