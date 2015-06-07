'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('showMeController', [ '$scope', '$http', '$q', '$cookies',
  function($scope, $http, $q, $cookies) {

    var dateFormat = 'YYYY-MM-DD';
    var cookieName = 'lunchtools.showme.settings';

    $scope.initialize = function() {
      $scope.settings = $scope.loadSettings();
      $scope.lunch = null;
      $scope.error = null;
      $scope.m = moment();

      var day = $scope.m.day();
      if ($scope.settings.skipWeekends && (day == 0 || day == 6)) {
        $scope.nextDay();
      } else {
        $scope.update($scope.m.format(dateFormat));
      }
    }

    $scope.update = function(date) {
      $scope.lunch = null;
      $scope.error = null;

      $scope.getLunch(date)
        .then(function(lunch) {
          if (lunch) {
            $scope.lunch = lunch;
            if ($scope.settings.translate) {
              $scope.getTranslation(lunch.menu).then($scope.setTranslation, $scope.errorHandler)
            } else {
              $scope.lunch.translation = lunch.menu;
            }
            $scope.getImage(lunch.menu).then($scope.setImage, $scope.errorHandler);
          }
        }, $scope.errorHandler)
    };

    $scope.getLunch = function(date) {
      return $q(function(resolve, reject) {
        $http.get('lunches/date/' + date)
          .success( function(data, status, headers, config) {
            if (data && data.length > 0) {
              resolve(data[0]);
            } else {
              resolve(null);
            }
          })
          .error( function(data, status, headers, config) {
            if (data) {
              console.log(JSON.stringify(data));
            }
            reject('Error loading menus');
          });
      });
    }

    $scope.getImage = function(menu) {
      return $q(function(resolve, reject) {
        var firstMenuItem = $scope.lunch.menu.split(';')[0];
        var safeSearch = 'off';
        if ($scope.settings.safeSearch) {
          safeSearch = 'moderate';
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
            reject('Error loading image');
          }
        }).error( function(data, status, headers, config) {
          reject('Error loading image');
        });
      });
    }

    $scope.setImage = function(imageUrl) {
      $scope.lunch.image = imageUrl;
    }

    $scope.getTranslation = function(menu) {
      return $q(function(resolve, reject) {
        if ($scope.settings.translate) {
          $http.post('translate', {lunch: menu}).
            success(function(data, status, headers, config) {
              if (data && data.result) {
                resolve(data.result);
              } else {
                console.log(JSON.stringify(data));
                reject('Error Loading Translation');
              }
                resolve(data.result);
            }).
            error(function(data, status, headers, config) {
              console.log(status)
              reject('Error Loading Translation');
            });
        } else {
          resolve(menu);
        }
      });
    }

    $scope.setTranslation = function(translation) {
      $scope.lunch.translation = translation;
    }

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    }

    $scope.nextDay = function() {
      var daysToAdd = 1;
      if ($scope.settings.skipWeekends && $scope.m.day() === 5) {
        daysToAdd = 3;
      }
      if ($scope.settings.skipWeekends && $scope.m.day() === 6) {
        daysToAdd = 2;
      }
      $scope.m.add(daysToAdd, 'days');
      $scope.update($scope.m.format(dateFormat))
    }

    $scope.previousDay = function() {
      var daysToAdd = -1;
      if ($scope.settings.skipWeekends && $scope.m.day() === 0) {
        daysToAdd = -2;
      }
      if ($scope.settings.skipWeekends && $scope.m.day() === 1) {
        daysToAdd = -3;
      }
      $scope.m.add(daysToAdd, 'days');
      $scope.update($scope.m.format(dateFormat))
    }

    $scope.saveSettings = function(settings) {
      $cookies.putObject(cookieName, settings, {
        expires: moment().add(10,'years').toDate()
      });
    }

    $scope.loadSettings = function() {
      var settings = $cookies.getObject(cookieName);
      if (!settings) {
          settings = {
            translate: true,
            skipWeekends: true,
            safeSearch: false
          };
      }
      return settings;
    }

    $scope.$watch('settings.translate',
      function() {
        $scope.saveSettings($scope.settings);
        $scope.update($scope.m.format(dateFormat));
      }
    );

    $scope.$watch('settings.skipWeekends',
      function() {
        $scope.saveSettings($scope.settings);
        var day = $scope.m.day();
        if ($scope.settings.skipWeekends && (day == 0 || day == 6)) {
          $scope.nextDay();
        }
      }
    );

    $scope.$watch('settings.safeSearch',
      function() {
        $scope.saveSettings($scope.settings);
        $scope.update($scope.m.format(dateFormat));
      }
    );

    $scope.initialize();
  }
]);
