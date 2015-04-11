angular.module('myApp', []).controller('translationController', function($scope,$http) {
  $scope.isEditing = false;

  $scope.edit = function(id) {
      if (id) {
        $http.get('translations/' + id).success(
          function(response) {
            $scope._id = response[0]._id;
            $scope.target = response[0].target;
            $scope.replacement = response[0].replacement;
            $scope.isEditing = true;
          });
      } else {
        $scope._id = null;
        $scope.target = '';
        $scope.replacement = '';
        $scope.isEditing = true;
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
    }).success(
      function(data, status, headers, config){
        $scope.isEditing = false;
        $scope.refresh();
      }
    );
  };

  $scope.cancel = function() {
    $scope.isEditing = false;
  };

  $scope.delete = function(id) {
    if (confirm('Are you sure?')) {
      $scope.isEditing = false;
      $http.delete('translations/' + id).success(
        function(data, status, headers, config) {
          $scope.refresh();
        });
    }
  };

  $scope.refresh = function() {
    $http.get('translations').success(
      function(data, status, headers, config) {
        $scope.translations = data;
      });
  };

  $scope.refresh();
});
