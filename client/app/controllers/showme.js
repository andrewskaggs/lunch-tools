'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('showMeController', [ '$scope', '$http', '$q', '$cookies', '$routeParams', '$location', 'imageService',
  function($scope, $http, $q, $cookies, $routeParams, $location, imageService) {

    var dateFormat = 'YYYY-MM-DD';
    var cookieName = 'lunchtools.showme.settings';
    var ratingsCookieName = 'lunchtools.showme.ratings';

    $scope.initialize = function() {
      $scope.settings = $scope.loadSettings();
      $scope.ratings = $scope.loadRatings();
      $scope.checkAdvanced();

      $scope.lunch = null;
      $scope.error = null;
      $scope.info = null;
      $scope.currentRating = null;

      if ($routeParams.date) {
        $scope.m = moment($routeParams.date);
      } else {
        $scope.m = moment();
      }

      var day = $scope.m.day();
      if ($scope.settings.skipWeekends && (day == 0 || day == 6)) {
        $scope.nextDay();
      } else {
        $scope.update($scope.m.format(dateFormat));
      }
    };

    $scope.update = function(date) {
      $scope.lunch = null;
      $scope.error = null;
      $scope.info = null;
      $scope.currentRating = null;

      // TODO: figure out how to rewrite URL without angular looping

      $scope.getLunch(date)
        .then(function(lunch) {
          if (lunch) {
            $scope.lunch = lunch;
            $scope.checkRating(date);
            if ($scope.settings.translate) {
              $scope.getTranslation(lunch.menu).then($scope.setTranslation, $scope.errorHandler)
            } else {
              $scope.lunch.translation = lunch.menu;
            }
            imageService.getRandomMenuImageUrl(lunch.menu).then($scope.setImage, $scope.errorHandler);
          }
        }, $scope.errorHandler);
    };

    $scope.getLunch = function(date) {
      return $q(function(resolve, errorHandler) {
        $http.get('lunches/' + date)
          .success( function(data, status, headers, config) {
            if (data && data.length > 0) {
              resolve(data[0]);
            } else {
              resolve(null);
            }
          })
          .error( function(data, status, headers, config) {
            if (status != 404) {
              if (data) {
                console.log(JSON.stringify(data));
              }
              errorHandler('Error loading menus');
            }
          });
      });
    };

    $scope.setImage = function(imageUrl) {
      $scope.lunch.image = imageUrl;
    }

    $scope.getTranslation = function(menu) {
      return $q(function(resolve, errorHandler) {
        if ($scope.settings.translate) {
          $http.post('translate', {lunch: menu}).
            success(function(data, status, headers, config) {
              if (data && data.result) {
                resolve(data.result);
              } else {
                console.log(JSON.stringify(data));
                errorHandler('Error Loading Translation');
              }
                resolve(data.result);
            }).
            error(function(data, status, headers, config) {
              console.log(status)
              errorHandler('Error Loading Translation');
            });
        } else {
          resolve(menu);
        }
      });
    };

    $scope.setTranslation = function(translation) {
      $scope.lunch.translation = translation;
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    };

    $scope.nextDay = function() {
      var daysToAdd = 1;
      if ($scope.settings.skipWeekends && $scope.m.day() === 5) {
        daysToAdd = 3;
      }
      if ($scope.settings.skipWeekends && $scope.m.day() === 6) {
        daysToAdd = 2;
      }
      $scope.m.add(daysToAdd, 'days');
      $scope.update($scope.m.format(dateFormat));
    };

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
    };

    $scope.saveSettings = function(settings) {
      $cookies.putObject(cookieName, settings, {
        expires: moment().add(10,'years').toDate()
      });
    };

    $scope.loadSettings = function() {
      var settings = $cookies.getObject(cookieName);

      if (!settings || settings.advanced == 0) {
          settings = {
            advanced: false,
            translate: false,
            skipWeekends: true,
            safeSearch: false
          };
      }

      if (settings.advanced == null)
        settings.advanced = false;

      return settings;
    };

    $scope.loadRatings = function() {
      var ratings = $cookies.getObject(ratingsCookieName);

      if (!ratings) {
        ratings = [];
      }

      return ratings;
    };

    $scope.saveRating = function(date, rating) {
      var newRating = {
        date: date,
        rating: rating
      }
      if (!_.findWhere($scope.ratings, {date: date})) {
        $scope.lunch.rated = true;
        $scope.ratings.push(newRating);
        $cookies.putObject(ratingsCookieName, $scope.ratings, {
          expires: moment().add(10,'years').toDate()
        });
        $scope.checkRating(date);
      }
    };

    $scope.checkRating = function(date) {
      var savedRating = _.findWhere($scope.ratings, {date: date} );
      if (savedRating != null) {
        $scope.currentRating = savedRating.rating;
      }
    }

    $scope.checkAdvanced = function() {
      var advancedParam = $location.search().advanced;
      if (advancedParam != null) {
        if (advancedParam === 'true' || parseInt(advancedParam) === 1) {
          $scope.settings.advanced = true;
        } else {
          $scope.settings.advanced = false;
        }
        $scope.saveSettings($scope.settings);
      }
    }

    $scope.comment = function() {
      var date = $scope.m.format(dateFormat);
      var comment = {
        name: $scope.commentName,
        message: $scope.commentMessage
      };
      $http.post('/lunches/' + date + '/comments', comment)
        .success(function(data, status, headers, config) {
          $scope.commentName = '';
          $scope.commentMessage = '';
          $http.get('/lunches/' + date)
            .success(function(data, status, headers, config) {
              $scope.lunch.comments = data[0].comments;
            })
            .error(function(data, status, headers, config) {
              console.log(status);
              console.log(data);
              $scope.errorHandler('Error refreshing comments. Try reloading the page.')
            });
        })
        .error(function(data, status, headers, config) {
          if (status == 400) {
            $scope.errorHandler(data.message);
          } else {
            console.log(status);
            console.log(data);
            $scope.errorHandler('Error saving comment');
          }
        });
    };

    $scope.voteUp = function() {
      var date = $scope.m.format(dateFormat);
      var rating = {
        rating: 1
      };
      $http.post('/lunches/' + date + '/ratings', rating)
        .success(function(data, status, headers, config) {
          $scope.saveRating(date, 1);
        })
        .error(function(data, status, headers, config) {
          console.log(status);
          console.log(data)
          $scope.errorHandler('Error Saving Rating');
        });
    };

    $scope.voteDown = function() {
      var date = $scope.m.format(dateFormat);
      var rating = {
        rating: -1
      }
      $http.post('/lunches/' + date + '/ratings', rating)
        .success(function(data, status, headers, config) {
          $scope.saveRating(date, -1);
        })
        .error(function(data, status, headers, config) {
          console.log(status);
          console.log(data)
          $scope.errorHandler('Error Saving Rating');
        });
    };

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
