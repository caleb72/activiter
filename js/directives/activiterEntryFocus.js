angular.module('Activiter2')
  .directive('activiterEntryFocus', function($timeout) {
    return {
      restrict: 'EA',
      link: function(scope, element, attr) {
        scope.$watch('revealClass', function(value) {
          if (value === 'activiter_modal') {
            if (scope.inFocus(attr.activiterField)) {
              $timeout(function() {
                $(element[0]).focus();
              },50);
            }
          }
        });
      }
    };
  });
