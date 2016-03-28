'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('kitchenController', [ '$scope', 'lunchService', '$interval',
  function($scope, lunchService, $interval) {

    var ratingSource = "LunchTools.Kitchen";

    $scope.initialize = function() {
      $scope.votingOpen = false;
      $scope.date = null;
      $scope.kiosk = true;

      $interval($scope.update, 1000);
    };

    $scope.update = function() {
      if ($scope.date != moment().format('YYYY-MM-DD')) {
        $scope.error = null;
        $scope.info = null;
        $scope.lunch = null;

        $scope.date = moment().format('YYYY-MM-DD');
        lunchService.get($scope.date).then(function(lunch) {$scope.lunch = lunch}, $scope.errorHandler);
      }

      var currentDate = new Date();
      var hour = currentDate.getHours();

      if ($scope.votingOpen == false && hour >= 12 && hour < 16) {
        $scope.votingOpen = true;
      }

      if ($scope.votingOpen == true && (hour < 12 || hour >= 16) ) {
        $scope.votingOpen = false;
      }
    };

    $scope.vote = function(dish, rating) {
      lunchService.rate($scope.lunch.date, dish, rating, ratingSource)
        .then(function() { $scope.info = null; $scope.error = null;}, $scope.errorHandler);
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    };

    $scope.initialize();
  }
]);
