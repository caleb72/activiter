angular.module('Activiter2')
  .directive('activiterDatepicker', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        onSelect: '&'
      },
      link: function(scope, element, attr, ngModelCtrl) {
        $(element).Zebra_DatePicker({
          onSelect: function(dateStr1, dateStr2, date, el) {
            scope.$apply(function() {
              scope.onSelect({id: el.attr("id"), newDate: date});
            });
          }
        });
      }
    };
  });
