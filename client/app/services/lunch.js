'use strict';

var services = angular.module('lunchServices');

services.service('lunchService', [ '$http', '$q',
  function($http, $q) {

      this.get = function(date) {
        return $q(function(resolve, reject) {
          $http.get('api/v2/lunches/' + date)
            .success( function(data, status, headers, config) {
              data.dishes = buildDishes(data.menu);
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

      function buildDishes(menu) {
        menu = cleanMenu(menu);
        var rawDishes = menu.split(";");
        var dishes = [];
        for (var i = 0; i < rawDishes.length; i++) {
          dishes.push(rawDishes[i].trim());
        }
        dishes.push("Salad Bar");
        return dishes;
      }

      // HACK: The app needs to be refactored and this should be done serverside only with libraries instead of this trash
      function cleanMenu(menu) {
        var noHtmlMenu = menu.replace(/<(?:.|\n)*?>/gm, '');
        var decodedMenu = noHtmlMenu;
        var decodedMenu = decodedMenu.replace(/&amp;/g, '&');
        var decodedMenu = decodedMenu.replace(/&lt;/g, '<');
        var decodedMenu = decodedMenu.replace(/&gt;/g, '>');
        var decodedMenu = decodedMenu.replace(/&quot;/g, '"');
        var decodedMenu = decodedMenu.replace(/&#39;/g, "'");
        return decodedMenu;
      }

      this.getAll = function() {
        return $q(function(resolve, reject) {
          $http.get('api/v2/lunches')
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
          $http.get('api/v2/lunches/generate')
            .success( function(data, status, headers, config) {
              resolve(data);
            })
            .error( function(data, status, headers, config) {
              console.log(status);
              console.log(data);
              errorHandler("Error generating lunch");
            });
        });
      };

      this.translateMenu = function(menu) {
        return $q(function(resolve, errorHandler) {
          $http.post('api/v2/translate', {lunch: menu}).
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

      this.rate = function(date, dish, ratingNumber, source) {
        return $q(function(resolve, errorHandler) {
          var url = 'api/v2/lunches/' + date + '/ratings';
          var rating = {
            dish: dish,
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
              if (data.message) {
                errorHandler(data.message);
              } else {
                errorHandler('Error saving rating');
              }
            });
        });
      };

      this.comment = function(date, name, message) {
        return $q(function(resolve, errorHandler) {
          var url = 'api/v2/lunches/' + date + '/comments';
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
              if (data.message) {
                errorHandler(data.message);
              } else {
                errorHandler('Error saving comment');
              }
            });
        });
      };

  }
]);
