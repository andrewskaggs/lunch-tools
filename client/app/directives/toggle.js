'use strict';

var directives = angular.module('lunchDirectives');

directives.directive('lunchToggle',
  function() {
    return {
      restrict: 'E',
      templateUrl: 'views/toggle.html',
      scope: {
        field: '='
      },
      replace: true,
      transclude: true
    }
  });
