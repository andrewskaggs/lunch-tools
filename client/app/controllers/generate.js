'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('generateController', [ '$scope', '$http', 'imageService',
  function($scope, $http, imageService) {

    $scope.initialize = function() {
      $scope.error = null;
      $scope.info = null;
      $scope.menu = null;
      $scope.image = null

      $scope.generate();
    };

    $scope.generate = function() {
      $http.get('lunches/generate')
        .success( function(data, status, headers, config) {
          $scope.menu = data.menu;
          imageService.getRandomMenuImageUrl($scope.menu, false)
            .then(function(url) {
                $scope.image = url;
              }, $scope.errorHandler);
        })
        .error( function(data, status, headers, config) {
          console.log(status);
          console.log(data);
          $scope.error = 'Error Loading Generated Lunch';
        });
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    };

    $scope.initialize();
  }
]);
