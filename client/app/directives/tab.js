'use strict';

var directives = angular.module('lunchDirectives');

directives.directive('lunchTab', [ '$location',
  function($location) {
    return {
      restrict: 'E',
      templateUrl: '/views/tab.html',
      scope: {
        name: '@',
        url: '@'
      },
      replace: true,
      link: function (scope, element, attrs) {
        scope.name = attrs.name;
        scope.url = attrs.url;

        var cleanUrl;
        if (scope.url.substring(0,2) == '#!')
          cleanUrl = scope.url.substring(2);
        else
          cleanUrl = scope.url;

        if ($location.path() == cleanUrl)
          scope.liclass = 'active';
        else
          scope.liclass = '';

        scope.$on('$locationChangeStart', function(event) {
          if ($location.path() == cleanUrl)
            scope.liclass = 'active';
          else
            scope.liclass = '';
        });

      }
    }
  }
]);
