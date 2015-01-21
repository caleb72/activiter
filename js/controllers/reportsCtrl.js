angular.module('Activiter2')
  .controller('ReportsCtrl', function($scope, ActiviterPane, ActiviterDB) {

    var activeTab = "tracker";

    $scope.navTo = function(section) {
      activeTab = section;
    };

    $scope.isTabActive = function(section) {
      if (section === activeTab) {
        return "active";
      } else {
        return "";
      }
    };

    $scope.$on('boundsChanged', function() {
      $scope.$apply();
    });

    $scope.trackForm = {
      "type": "summary",
      "start": ActiviterDB.today,
      "end": ActiviterDB.today,
      "groupBy1": "date",
      "groupBy2": "subcategory",
    };

    $scope.db = ActiviterDB;

    $scope.isDetailed = function() {
      return $scope.trackForm.type === 'detail';
    };

    $scope.runReport = function() {
      ActiviterDB.generateReport($scope.trackForm)
        .then(function() {
          $scope.report = ActiviterDB.getReport();
          $scope.showReport();
        });
    };

    $scope.runReport_old = function() {
      console.log($scope.trackForm);
      if ($scope.trackForm.type === 'summary') {
        ActiviterDB.generateSummaryReport($scope.trackForm)
          .then(function() {
            $scope.report = ActiviterDB.getReport();

            $scope.showReport();
          });
      } else {
        ActiviterDB.generateDetailReport($scope.trackForm)
          .then(function() {
            $scope.report = ActiviterDB.getReport();
            $scope.showReport();
          });
      }
    };

    $scope.isSummary = function(num) {
      if ($scope.trackForm.type  === "summary") {
        if (num === 1) {
          return ($scope.trackForm.groupBy1 !== "none" && $scope.trackForm.groupBy2 === "none");
        } else {
          return ($scope.trackForm.groupBy1 !== "none" && $scope.trackForm.groupBy2 !== "none");
        }
      } else {
        return false;
      }
    }

    $scope.changeDate = function(id, newDate) {
      $scope.trackForm[id] = new Date(newDate.toDateString());
    };

    $scope.revealClass="";

    $scope.cancelEntry = function() {
      $scope.revealClass="";
    };

    $scope.showReport = function() {
      $scope.revealClass="activiter_modal";
    };

    $scope.exportReport = function() {
      ActiviterDB.exportReport($scope.trackForm)
        .then(function() {
          $scope.cancelEntry();
        });
    };

  });
