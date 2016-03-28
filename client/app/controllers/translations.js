'use strict';

var controllers = angular.module('lunchControllers');

controllers.controller('translationsController', [ '$scope', '$http', '$sanitize',
  function($scope, $http, $sanitize) {

    $scope.initialize = function() {
      $scope.info = null;
      $scope.error = null;
      $scope.dialogError = null;

      $scope.refresh();
    };

    $scope.edit = function(id) {
        if (id) {
          $http.get('api/v2/translations/' + id)
            .success(function(response) {
              $scope._id = response[0]._id;
              $scope.target = response[0].target;
              $scope.replacement = response[0].replacement;
              $scope.dialogError = null;
            })
            .error(function(data, status, headers, config) {
              $scope.handleDialogError(data, status, headers, config);
            });
        } else {
          $scope._id = null;
          $scope.target = '';
          $scope.replacement = '';
          $scope.dialogError = null;
        }
    };

    $scope.save = function() {
      var verb;
      var url = 'api/v2/translations';

      if ($scope._id) {
        verb = 'PUT';
        url = url + '/' + $scope._id;
      }
      else {
        verb = 'POST';
      }

      $http({
        url: url,
        method: verb,
        data: {
          target: $scope.target,
          replacement: $sanitize($scope.replacement)
         }
      }).success(function(data, status, headers, config) {
        $('#editModal').modal('hide');
        $scope.refresh();
      }).error(function(data, status, headers, config) {
        $scope.handleDialogError(data, status, headers, config);
      });
    };

    $scope.delete = function(id) {
      $http.delete('api/v2/translations/' + id)
        .success(function(data, status, headers, config) {
          $('#deleteModal').modal('hide');
          $scope.refresh();
        })
        .error(function(data, status, headers, config) {
          $scope.handleDialogError(data, status, headers, config);
        });
    };

    $scope.refresh = function() {
      $http.get('api/v2/translations').success(
        function(data, status, headers, config) {
          $scope.translations = data;
        })
        .error(function(data, status, headers, config) {
          $scope.error = 'Error loading translations';
          console.log('HTTP ' + status.toString());
          if (data) {
            console.log(JSON.stringify(data));
          }
        });
    };

    $scope.handleDialogError = function(data, status, headers, config) {
        if (data) {
          if (data.message) {
            $scope.dialogError = data.message;
          } else {
            $scope.dialogError = JSON.stringify(data);
          }
        } else {
          $scope.dialogError = 'Error';
        }
    };

    $scope.initialize();

  }
]);
