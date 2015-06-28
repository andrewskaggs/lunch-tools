'use strict';

var services = angular.module('lunchServices');

services.service('lunchService', [ '$http', '$q',
  function($http, $q) {

      this.get = function(date) {
        return $q(function(resolve, reject) {
          $http.get('lunches/' + date)
            .success( function(data, status, headers, config) {
              resolve(data);
            })
            .error( function(data, status, headers, config) {
              if (status === 404) {
                var message = '404 No lunch found for ' + date;
                reject(message);
              } else {
                console.log(status);
                console.log(data);
                reject('Error loading lunch');
              }
            });
        });
      };

      this.getAll = function() {
        return $q(function(resolve, reject) {
          $http.get('lunches')
            .success( function(data, status, headers, config) {
              resolve(data);
            })
            .error( function(data, status, headers, config) {
                console.log(status);
                console.log(data);
                reject('Error loading lunches');
            });
        });
      };

      this.getGenerated = function() {
        return $q(function(resolve, errorHandler) {
          $http.get('lunches/generate')
            .success( function(data, status, headers, config) {
              resolve(data.menu);
            })
            .error( function(data, status, headers, config) {
              console.log(status);
              console.log(data);
              errorHandler("Error generating lunch");
            });
        });
      };

      this.getMenuImageUrl = function(menu, safeSearch) {
        return $q(function(resolve, errorHandler) {

          var firstMenuItem = menu.split(';')[0];
          var safeSearchValue = safeSearch == true ? 'active' : 'off';

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
              errorHandler('No images found');
            }
          }).error( function(data, status, headers, config) {
            console.log(status);
            console.log(data);
            errorHandler('Error finding image');
          });

        });
      };

      this.translateMenu = function(menu) {
        return $q(function(resolve, errorHandler) {
          $http.post('translate', {lunch: menu}).
            success(function(data, status, headers, config) {
              resolve(data.result);
            }).
            error(function(data, status, headers, config) {
              console.log(status);
              console.log(data);
              errorHandler('Error translating menu');
            });
        });
      };

      this.rate = function(date, ratingNumber, source) {
        return $q(function(resolve, errorHandler) {
          var url = 'lunches/' + date + '/ratings';
          var rating = {
            rating: ratingNumber,
            source: source
          }
          $http.post(url, rating)
            .success(function(data, status, headers, config) {
              resolve();
            })
            .error(function(data, status, headers, config) {
              console.log(status);
              console.log(data);
              errorHandler('Error saving rating');
            });
        });
      };

      this.comment = function(date, name, message) {
        return $q(function(resolve, errorHandler) {
          var url = 'lunches/' + date + '/comments';
          var comment = {
            name: name,
            message: message
          }
          $http.post(url, comment)
            .success(function(data, status, headers, config) {
              resolve();
            })
            .error(function(data, status, headers, config) {
              console.log(status);
              console.log(data);
              errorHandler('Error saving comment');
            });
        });
      };

      this.update = function() {
        return $q(function(resolve, reject) {
          $http.get('lunches/update')
            .success( function(data, status, headers, config) {
              resolve(data);
            })
            .error( function(data, status, headers, config) {
                console.log(status);
                console.log(data);
                reject('Error reading RSS feed');
            });
        });
      };

  }
]);
