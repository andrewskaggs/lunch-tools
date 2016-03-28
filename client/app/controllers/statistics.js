'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('statisticsController', [ '$scope',
  function($scope) {

    $scope.initialize = function() {
      $scope.message = "statistics coming soon";
    };

    $scope.initialize();
  }
]);
