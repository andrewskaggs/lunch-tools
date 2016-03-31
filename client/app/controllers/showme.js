'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('showMeController', [ '$scope', '$cookies', '$routeParams', '$location', 'lunchService',
  function($scope, $cookies, $routeParams, $location, lunchService) {

    var dateFormat = 'YYYY-MM-DD';
    var cookieName = 'lunchtools.showme.settings';
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
      $scope.pickerDate = null;
      $scope.pickerOptions = {
        clear: '',
        selectYears: 4,
        selectMonths: true,
        onClose: function(){
          $(document.activeElement).blur(); // hack for picker opening every time tab gets focus
        }
      };

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

      $scope.pickerDate = $scope.m.format();
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
      if (lunch.image == '404')
        $scope.notFound = true;
      $scope.checkRating();
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
          };
      }

      if (settings.advanced == null)
        settings.advanced = false;

      return settings;
    };

    $scope.loadRatings = function() {
      // these should really be server side, but until lunch tools has users...
      var ratings;
      if (localStorage.ratings) {
        ratings = JSON.parse(localStorage.ratings);
      } else {
        ratings = [];
      }
      return ratings;
    };

    $scope.saveRating = function(dish, rating) {
      var date = $scope.m.format(dateFormat);
      var newRating = {
        date: date,
        dish: dish,
        rating: rating
      }
      if (!_.findWhere($scope.ratings, {date: date})) {
        $scope.lunch.rated = true;
        $scope.ratings.push(newRating);
        localStorage.ratings = JSON.stringify($scope.ratings);
      }
    };

    $scope.checkRating = function(dish) {
      var date = $scope.m.format(dateFormat);
      var savedRating = _.findWhere($scope.ratings, {date: date, dish: dish} );
      if (savedRating != null)
        return savedRating.rating;
      else
        return 0;
    };

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
    };

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

    $scope.vote = function(dish, rating) {
      var date = $scope.m.format(dateFormat);
      lunchService.rate($scope.lunch.date, dish, rating, ratingSource);
//        .then(function() {
//          $scope.saveRating(date, dish, rating);
//        }, $scope.errorHandler);
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

    $scope.$watch('pickerDate',
      function(newValue, oldValue) {
        if (newValue == null || newValue == oldValue)
          return;
        $scope.m = moment(newValue);
        $scope.update($scope.m.format(dateFormat));
      }, true
    );

    $scope.initialize();
  }
]);
