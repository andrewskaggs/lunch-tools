'use strict';

var services = angular.module('lunchServices');

services.service('imageService', [ '$http', '$q',
  function($http, $q) {

    this.getRandomMenuImageUrl = function(menu, safeSearch) {
      return $q(function(resolve, errorHandler) {
        var firstMenuItem = menu.split(';')[0];

        var safeSearchValue = 'off';
        if (safeSearch) {
          safeSearchValue = 'active';
        }

        $http.jsonp('http://ajax.googleapis.com/ajax/services/search/images', {
          method: 'GET',
          params: {v: '1.0', q: firstMenuItem, callback: 'JSON_CALLBACK', safe: safeSearch, rsz: '5' }
        }).success(function(data, status, headers, config) {
          if (data.responseData.results.length > 0) {
            var imageNumber = Math.floor((Math.random() * 5) );
            if (data.responseData.results.length < imageNumber) {
              imageNumber = 0;
            }
            resolve(data.responseData.results[imageNumber].unescapedUrl);
          } else {
            console.log('No images found');
            errorHandler('Error loading image');
          }
        }).error( function(data, status, headers, config) {
          console.log(status);
          console.log(data);
          errorHandler('Error loading image');
        });
        
      });

    };

  }
]);
