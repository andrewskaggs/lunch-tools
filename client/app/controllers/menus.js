'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('menusController', [ '$scope', '$http',
  function($scope, $http) {

    $scope.refresh = function() {
      $http.get('lunches').success(
        function(data, status, headers, config) {
          $scope.menus = data;
        });
    };

    $scope.refresh();
  }

]);
