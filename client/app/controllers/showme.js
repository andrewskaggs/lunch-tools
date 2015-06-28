'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('showMeController', [ '$scope', '$cookies', '$routeParams', '$location', 'lunchService',
  function($scope, $cookies, $routeParams, $location, lunchService) {

    var dateFormat = 'YYYY-MM-DD';
    var cookieName = 'lunchtools.showme.settings';
    var ratingsCookieName = 'lunchtools.showme.ratings';
    var ratingSource = "LunchTools.ShowMe";

    $scope.initialize = function() {
      $scope.settings = $scope.loadSettings();
      $scope.ratings = $scope.loadRatings();
      $scope.checkAdvanced();

      $scope.lunch = null;
      $scope.error = null;
      $scope.info = null;
      $scope.currentRating = null;
      $scope.notFound = false;

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
      $scope.notFound = false;

      // TODO: figure out how to rewrite URL without angular looping

      lunchService.get(date).then($scope.setLunch, $scope.errorHandler);
    };

    $scope.setLunch = function(lunch) {
      $scope.lunch = lunch;
      if ($scope.settings.translate) {
        lunchService.translateMenu($scope.lunch.menu).then(function(translation) {
            $scope.lunch.translation = translation;
            $scope.checkRating();
            return lunchService.getMenuImageUrl($scope.lunch.translation);
          })
          .then($scope.setImage)
          .catch($scope.errorHandler);
      } else {
        lunchService.getMenuImageUrl(lunch.menu).then($scope.setImage, $scope.errorHandler );
      }
    };

    $scope.setImage = function(imageUrl) {
      $scope.lunch.image = imageUrl;
    };

    $scope.errorHandler = function(errorMessage) {
      if (errorMessage == null) {
        errorMessage = "Error";
      }
      if (errorMessage.length >2 && errorMessage.substring(0,3) == '404') {
        $scope.notFound = true;
      } else {
        $scope.error = errorMessage;
      }
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
        $scope.checkRating();
      }
    };

    $scope.checkRating = function() {
      var date = $scope.m.format(dateFormat);
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
      lunchService.comment(date, $scope.commentName, $scope.commentMessage)
        .then(function() {
          $scope.commentName = null;
          $scope.commentMessage = null;
          return lunchService.get(date);
        })
        .then(function(lunch) {
          $scope.lunch.comments = lunch.comments;
        })
        .catch($scope.errorHandler);
    };

    $scope.vote = function(rating) {
      var date = $scope.m.format(dateFormat);
      lunchService.rate(date, rating, ratingSource)
      .then(function() {
        $scope.saveRating(date, rating);
      }, $scope.errorHandler);
    };

    $scope.$watch('settings.translate',
      function(newValue, oldValue) {
        if (newValue == oldValue)
          return;
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
      function(newValue, oldValue) {
        if (newValue == oldValue)
          return;
        $scope.saveSettings($scope.settings);
        $scope.update($scope.m.format(dateFormat));
      }
    );

    $scope.initialize();
  }
]);
