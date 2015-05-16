'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('showMeController', [ '$scope',
  function($scope) {
    $scope.message = "show me stuff";
  }
]);
