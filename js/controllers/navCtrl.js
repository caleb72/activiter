angular.module('Activiter2')
  .controller('NavCtrl', function($scope) {
    $scope.active = { 'tracker' : true };

    $scope.makeActive = function(option) {
      $scope.active = {};
      $scope.active[option] = true;
    };

  });