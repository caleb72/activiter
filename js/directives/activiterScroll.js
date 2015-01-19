angular.module('Activiter2')
  .directive('activiterScroll', function($timeout) {
    return {
      restrict: 'EA',
      link: function(scope, element, attr) {
        scope.$watch('expandedCategory', function(value) {
          if (value === '') {
            $(element[0]).scrollTop(0);
          } else {
            var container = $('.activiter_scroll');
            var scrollTo = $('#' + scope.expandedCategory);

            var scrollVal = scrollTo.offset().top - container.offset().top + container.scrollTop();

            $timeout(function() {
              container.scrollTop(scrollVal);
            }, 50);
          }
        });
      }
    };
  });