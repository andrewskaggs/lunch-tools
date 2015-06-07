'use strict';

var directives = angular.module('lunchDirectives');

directives.directive('lunchSpin',
  function($location) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.addClass('lunch-spin');
        element.hover(function() {
          angular.element('.lunch-spin').toggleClass('fa-spin');
        });
      }
    };
  }
);
