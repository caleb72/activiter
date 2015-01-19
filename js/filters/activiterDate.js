angular.module('Activiter2')
  .filter('activiterdate', function() {
    return function(value) {
      return new Date(fromEpoch(value));
    };
  });