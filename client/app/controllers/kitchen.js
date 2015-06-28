'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('kitchenController', [ '$scope', 'lunchService',
  function($scope, lunchService) {

    var ratingSource = "LunchTools.Kitchen";

    $scope.initialize = function() {
      $scope.update();
    }

    $scope.update = function() {
      $scope.error = null;
      $scope.info = null;
      $scope.lunch = null;

      var date = moment('2016-01-01').format('YYYY-MM-DD'); // TODO: change to current day after debugging

      lunchService.get(date).then(function(lunch) {$scope.lunch = lunch}, $scope.errorHandler);
    };

    $scope.vote = function(rating) {
      lunchService.rate($scope.lunch.date, rating, ratingSource)
        .then(function() { $scope.info = "Vote Saved"}, $scope.errorHandler)
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    };

    $scope.initialize();
  }
]);
