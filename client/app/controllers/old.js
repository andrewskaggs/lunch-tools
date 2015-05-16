angular.module('myApp', []).controller('translationController', function($scope,$http) {

  $scope.edit = function(id) {
      if (id) {
        $http.get('translations/' + id).success(
          function(response) {
            $scope._id = response[0]._id;
            $scope.target = response[0].target;
            $scope.replacement = response[0].replacement;
            $scope.error = null;
          });
      } else {
        $scope._id = null;
        $scope.target = '';
        $scope.replacement = '';
        $scope.error = null;
      }
  };

  $scope.save = function() {
    var verb;
    var url = 'translations';

    if ($scope._id) {
      verb = 'PUT';
      url = url + '/' + $scope._id
    }
    else {
      verb = 'POST';
    }

    $http({
      url: url,
      method: verb,
      data: {
        target: $scope.target,
        replacement: $scope.replacement
       }
    }).success(function(data, status, headers, config) {
      $('#editModal').modal('hide');
      $scope.refresh();
    }).error(function(data, status, headers, config) {
      $scope.handleAjaxError(data, status, headers, config);
    });
  };

  $scope.delete = function(id) {
    $http.delete('translations/' + id)
      .success(function(data, status, headers, config) {
        $('#deleteModal').modal('hide');
        $scope.refresh();
      })
      .error(function(data, status, headers, config) {
        $scope.handleAjaxError(data, status, headers, config);
      });
  };

  $scope.refresh = function() {
    $http.get('translations').success(
      function(data, status, headers, config) {
        $scope.translations = data;
      });
  };

  $scope.handleAjaxError = function(data, status, headers, config) {
      $scope.error = 'HTTP ' + status.toString();
      if (data) {
        $scope.error += ' ' + data.eval().toString();
      }
  }

  $scope.refresh();
});
