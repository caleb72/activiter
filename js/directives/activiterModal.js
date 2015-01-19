// The purpose of this directive is simply to capture the ESC key stroke
// So to close the modal.
// The modal control may be refactored to contain more of the modal and
// its behaviour into this directive
angular.module('Activiter2')
  .directive('activiterModal', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        scope.$on('keypress:27', function() {
          scope.$apply(function() {
            scope.cancelEntry();
          });
        });
      }
    };
  });
