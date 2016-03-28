'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('editMenusController', [ '$scope', '$http', 'lunchService',
  function($scope, $http, lunchService) {

    $scope.initialize = function() {
      $scope.error = null;
      $scope.info = null;
      $scope.date = null;
      $scope.menu = null;
      $scope.newMenuCount = 5;

      $scope.initializeAddForm();

      $scope.refresh();
    }

    $scope.initializeAddForm = function() {
      $scope.startDate = '';
      $scope.newMenus = [];

      for (var i = 0; i < $scope.newMenuCount; i++) {
        $scope.newMenus.push({ date: '', menu: '' });
      };
    }

    $scope.refresh = function() {
      lunchService.getAll()
        .then(function(menus) { $scope.menus = menus }, $scope.errorHandler);
    };

    $scope.edit = function(date) {
      $http.get('api/v2/lunches/' + date)
        .success(function(response) {
          $scope.date = response.date;
          $scope.menu = response.menu;
          $scope.dialogError = null;
        })
        .error(function(data, status, headers, config) {
          $scope.handleDialogError(data, status, headers, config);
        });
    };

    $scope.save = function() {
      var url = 'api/v2/lunches/' + $scope.date;
      $http({
        url: url,
        method: 'PUT',
        data: {
          menu: $scope.menu
         }
      }).success(function(data, status, headers, config) {
        $('#editModal').modal('hide');
        $scope.refresh();
      }).error(function(data, status, headers, config) {
        $scope.handleDialogError(data, status, headers, config);
      });
    };

    $scope.delete = function(date) {
      $http.delete('api/v2/lunches/' + date)
        .success(function(data, status, headers, config) {
          $('#deleteModal').modal('hide');
          $scope.refresh();
        })
        .error(function(data, status, headers, config) {
          $scope.handleDialogError(data, status, headers, config);
        });
    };

    $scope.add = function() {
      $http.post('api/v2/lunches', $scope.newMenus
      ).success(function(data, status, headers, config) {
        $scope.refresh();
      }).error(function(data, status, headers, config) {
        $scope.refresh();
        $scope.errorHandler(data.message);
      });
      $('#addModal').modal('hide');
      $scope.initializeAddForm();
    };

    $scope.errorHandler = function(errorMessage) {
      $scope.error = errorMessage;
    };

    $scope.handleDialogError = function(data, status, headers, config) {
        if (data) {
          if (data.message) {
            $scope.dialogError = data.message;
          } else {
            $scope.dialogError = JSON.stringify(data);
          }
        } else {
          $scope.errorHandler = 'Error';
        }
    };

    $scope.$watch('startDate',
      function(newValue, oldValue) {
        if (newValue == null || newValue == oldValue)
          return;
        var m = moment(newValue);
        for (var i = 0; i < $scope.newMenuCount; i++) {
          $scope.newMenus[i].date = m.format('YYYY-MM-DD');
          if (m.format('dddd') == 'Friday') {
            m.add(3,'days');
          }
          else {
            m.add(1,'days');
          }
        };
      }, true
    );

    $scope.initialize();
  }

]);
