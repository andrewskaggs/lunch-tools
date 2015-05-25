'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('menusController', [ '$scope', '$http',
  function($scope, $http) {

    $scope.updating = false;

    $scope.refreshLunches = function() {
      $http.get('lunches')
        .success( function(data, status, headers, config) {
          $scope.error = null;
          $scope.menus = data;
        })
        .error( function(data, status, headers, config) {
          $scope.error = 'Error loading lunches';
          console.log('HTTP ' + status.toString());
          if (data) {
            console.log(JSON.stringify(data));
          }
        });
    };

    $scope.updateRSS = function() {
      $scope.updating = true;
      $http.get('lunches/update')
        .success( function(data, status, headers, config) {
          $scope.error = null;
          $scope.updating = false;
          $scope.info = "Menus Updated";
          $scope.refreshLunches();
        })
        .error( function(data, status, headers, config) {
          $scope.updating = false;
          $scope.error = 'Error loading RSS feed';
          console.log('HTTP ' + status.toString());
          if (data) {
            console.log(JSON.stringify(data));
          }
        });
    }

    $scope.refreshLunches();
  }

]);
