'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('translationsController', [ '$scope',
  function($scope) {
    $scope.message = "translate stuff";
  }
]);
