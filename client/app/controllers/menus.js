'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('menusController', [ '$scope', 'lunchService',
  function($scope, lunchService) {

    $scope.initialize = function() {
      $scope.updating = false;
      $scope.error = null;
      $scope.info = null;

      $scope.refreshLunches();
    };

    $scope.refreshLunches = function() {
      lunchService.getAll()
        .then(function(menus) { $scope.menus = menus }, $scope.errorHandler);
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.updating = false;
      $scope.error = errorMessage;
    };

    $scope.initialize();
  }

]);
