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
      $scope.menu = null;
      $scope.image = null

      lunchService.getGenerated().then($scope.setMenu, $scope.errorHandler);
    };

    $scope.setMenu = function(menu) {
      $scope.menu = menu;
      lunchService.getMenuImageUrl(menu, false).then($scope.setImage, $scope.errorHandler);
    };

    $scope.setImage = function(imageUrl) {
      $scope.image = imageUrl;
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    };

    $scope.initialize();
  }
]);
