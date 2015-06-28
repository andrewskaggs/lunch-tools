'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('menusController', [ '$scope', 'lunchService',
  function($scope, lunchService) {

    $scope.initialize = function() {
      $scope.updating = false;
      $scope.error = null;
      $scope.info = null;

      $scope.refreshLunches();
    }

    $scope.refreshLunches = function() {
      lunchService.getAll()
        .then(function(menus) { $scope.menus = menus }, $scope.errorHandler);
    };

    $scope.updateRSS = function() {
      $scope.updating = true;
      lunchService.update().then(function(newMenus) {
          $scope.updating = false;
          if (newMenus.length > 0) {
            $scope.info = newMenus.length.toString() + " new menus found";
            $scope.refreshLunches();
          } else {
            $scope.info = "No new lunches found";
          }
      }, $scope.errorHandler);
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.updating = false;
      $scope.error = errorMessage;
    };

    $scope.initialize();
  }

]);
