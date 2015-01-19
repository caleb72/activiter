angular.module('Activiter2')
  .controller('AuditCtrl', function($scope, ActiviterDB, ActiviterPane) {

    $scope.pane = ActiviterPane;
    $scope.db = ActiviterDB;

    $scope.$on('boundsChanged', function() {
      $scope.$apply(function() {
        $scope.pane = ActiviterPane;
      });
    });

    $scope.removeItem = function(i) {
      $scope.db.removeItem(i);
    };

  });
