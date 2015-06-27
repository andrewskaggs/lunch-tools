'use strict';

var directives = angular.module('lunchDirectives');

directives.directive('lunchTab', [ '$location',
  function($location) {
    return {
      restrict: 'E',
      templateUrl: 'views/tab.html',
      scope: {
        name: '@',
        url: '@'
      },
      replace: true,
      link: function (scope, element, attrs) {
        scope.name = attrs.name;
        scope.url = attrs.url;

        var cleanUrl;
        if (scope.url.substring(0,1) == '#')
          cleanUrl = scope.url.substring(1);
        else
          cleanUrl = scope.url;

        var pathFirstSegment = $location.path().split('/')[1];
        var cleanUrlFirstSegment = cleanUrl.split('/')[1];
        if (pathFirstSegment == cleanUrlFirstSegment)
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
    };
  }
]);
