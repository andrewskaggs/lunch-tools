'use strict';

var directives = angular.module('lunchDirectives');

directives.directive('lunchSwitch',
  function() {
    return {
      restrict: 'E',
      templateUrl: 'views/switch.html',
      scope: {
        field: '='
      },
      replace: true,
      transclude: true
    };
  });
