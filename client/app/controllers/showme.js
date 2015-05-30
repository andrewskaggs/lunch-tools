'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('showMeController', [ '$scope', '$http',
  function($scope, $http) {

    $scope.lunch = null;
    $scope.error = null;

    $scope.getLunch = function(date) {
      $http.get('lunches/date/' + date)
        .success( function(data, status, headers, config) {
          $scope.error = null;

        if (data && data.length > 0) {
          $scope.lunch = data[0];
          var firstMenuItem = $scope.lunch.menu.split(';')[0];

          $http.jsonp('http://ajax.googleapis.com/ajax/services/search/images', {
            method: 'GET',
            params: {v: '1.0', q: firstMenuItem, callback: 'JSON_CALLBACK', safe: 'off', rsz: '5' }
          }).success(function(data, status, headers, config) {
            //console.log(JSON.stringify(data));
            if (data.responseData.results.length > 0) {
              var imageNumber = Math.floor((Math.random() * 5) );
              if (data.responseData.results.length < imageNumber)
                imageNumber = 0;
              $scope.lunch.image = data.responseData.results[imageNumber].unescapedUrl;
            }
          });
        } else {
          $scope.lunch = null;
        }
      })
      .error( function(data, status, headers, config) {
        $scope.error = 'Error loading menus';
        console.log('HTTP ' + status.toString());
        if (data) {
          console.log(JSON.stringify(data));
        }
      });
    };

    $scope.nextDay = function() {
      $scope.m.add(1, 'days');
      $scope.getLunch($scope.m.format('YYYY-MM-DD'))
    };

    $scope.previousDay = function() {
      $scope.m.add(-1, 'days');
      $scope.getLunch($scope.m.format('YYYY-MM-DD'))
    };

    $scope.m = moment();
    $scope.getLunch($scope.m.format('YYYY-MM-DD'));;

  }
]);
