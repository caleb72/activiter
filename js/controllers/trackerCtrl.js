angular.module('Activiter2')
  .controller('TrackerCtrl', function($scope, ActiviterPane, ActiviterDB) {

    ActiviterDB.loadToday();

    var clearForm = function() {
      $scope.revealClass = "";
      $scope.form = {
        category: "",
        subcategory: "",
        source: "",
        description: "",
        duration: "",
        timestamp: toEpoch(new Date())
      };
    }

    $scope.setDate = function(id, newDate) {
      $scope.db.setDate(new Date(newDate.toDateString()));
    };

    $scope.pane = ActiviterPane;

    $scope.categories = ActiviterDB.config.categories;

    $scope.expandedCategory = "";
//    $scope.expandedIndex = "";

    $scope.expand = function(category, index) {
      if (category === $scope.expandedCategory) {
        $scope.expandedCategory = "";
//        $scope.expandedIndex = "";
      } else {
        $scope.expandedCategory = category;
//        $scope.expandedIndex = index;
      }
    };

    $scope.isExpanded = function(category) {
      return category === $scope.expandedCategory;
    };

    $scope.enterTime = function(category, subcategory) {
      $scope.revealClass = "activiter_modal";
      $scope.form.category = category;
      $scope.form.subcategory = subcategory;
      $scope.form.timestamp = toEpoch(new Date());
    };

    $scope.db = ActiviterDB;

    $scope.saveEntry = function() {
      if ($scope.form.duration !== "") {
        ActiviterDB.saveEntry($scope.form);
      }
      clearForm();
    };

    $scope.saveKeyPress = function(evt) {
      if (evt.which === 13 || evt.which ==  32) {
        $scope.saveEntry();
      }
    };

    $scope.checkESC = function(evt) {
      console.log(evt);
    };

    $scope.cancelEntry = function() {
      clearForm();
    };

    $scope.inFocus = function(ctrl) {
      return ActiviterDB.config.entryFocus === ctrl;
    };

    $scope.$on('boundsChanged', function() {
      $scope.$apply();
    });

    clearForm();

  });