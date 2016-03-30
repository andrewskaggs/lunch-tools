'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('generateController', [ '$scope', 'lunchService',
  function($scope, lunchService) {

    $scope.initialize = function() {
      $scope.generate();
    };

    $scope.generate = function() {
      $scope.error = null;
      $scope.info = null;
      $scope.lunch = null;

      lunchService.getGenerated().then($scope.setLunch, $scope.errorHandler);
    };

    $scope.setLunch = function(lunch) {
      $scope.lunch = lunch;
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    };

    $scope.initialize();
  }
]);
