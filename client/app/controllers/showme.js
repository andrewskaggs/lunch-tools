'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('showMeController', [ '$scope',
  function($scope) {

    $scope.getLunch = function(date) {
      // TODO: call the API /lunches/date/YYYY-MM-DD/translate
      $scope.lunch = {
        date: date,
        menu: 'Churros',
        translation: 'Motherfuckin Churros!'
      }

      // TODO: call google images
      $scope.lunch.image = 'http://www.mrchurrosusa.com/images/Churros_CaramelSplenda_big.jpg';

    };

    $scope.nextDay = function() {
      // TODO: add a day to $scope.today and the call getLunch
      console.log('next');
    };

    $scope.previousDay = function() {
      // TODO: subtract a day from $scope.today and the call getLunch
      console.log('previous');
    };

    // TODO: add moment to bower and angular and use it to get the real date
    $scope.today = '2015-05-26';
    $scope.getLunch($scope.today);

  }
]);
