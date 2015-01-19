angular.module('Activiter2')
  .controller('ConfigCtrl', function($scope, ActiviterPane, ActiviterDB, $timeout) {

    var activeTab = "categories";

    var moveItem = function(list, from, to) {
      var item = list.splice(from, 1);
      list.splice(to, 0, item[0]);
      return;
    };

    $scope.pane = ActiviterPane;
    $scope.db = ActiviterDB;

    $scope.catForm = {
      "catInd":undefined,
      "catName":undefined,
      "subInd":undefined,
      "subName":undefined
    };

    $scope.addCat = function(catName) {
      var cat = {
        "name": catName,
        "subcategories" : []
      };

      var cats = $scope.db.config.categories;

      cats.push(cat);
      $scope.catForm.catInd = cats.length - 1;
      $scope.catForm.subInd = undefined;
      $scope.catForm.subName = undefined;
    };

    $scope.addSub = function(catInd, subName) {
      var subs = $scope.db.config.categories[catInd].subcategories;

      subs.push(subName);
      $scope.catForm.subInd = subs.length - 1;
    };

    $scope.editCat = function(catInd, catName) {
      $scope.db.config.categories[catInd].name = catName;
    };

    $scope.editSub = function(catInd, subInd, subName) {
      $scope.db.config.categories[catInd].subcategories[subInd] = subName;
    };

    $scope.removeCat = function(catInd) {
      $scope.db.config.categories.splice(catInd, 1);
    };

    $scope.removeSub = function(catInd, subInd) {
      $timeout(function() {
        $scope.selectSub(catInd, 0);
      }, 50);
      $scope.db.config.categories[catInd].subcategories.splice(subInd, 1);
    };

    // Select category (which must also select the first item of matching subcategories
    $scope.selectCat = function(catInd) {
      $scope.catForm.catInd = catInd;
      $scope.catForm.catName = $scope.db.config.categories[catInd].name;
      $scope.selectSub(catInd, 0);
    };

    // Select subcategory
    $scope.selectSub = function(catInd, subInd) {
      $scope.catForm.subInd = subInd;
      $scope.catForm.subName = $scope.db.config.categories[catInd].subcategories[subInd];
    };

    $scope.upCat = function(catInd) {
      catInd = parseInt(catInd);
      if (catInd > 0) {
        moveItem($scope.db.config.categories, catInd, catInd-1);
        $timeout(function() {
          $scope.selectCat(catInd-1);
        }, 10);
      }
    };

    $scope.downCat = function(catInd) {
      catInd = parseInt(catInd);
      if (catInd < $scope.db.config.categories.length - 1) {
        moveItem($scope.db.config.categories, catInd, catInd+1);
        $timeout(function() {
          $scope.selectCat(catInd+1);
        }, 10);
      }
    };

    $scope.upSub = function(catInd, subInd) {
      subInd = parseInt(subInd);
//      catInd = parseInt(catInd);
      if (subInd > 0) {
        moveItem($scope.db.config.categories[catInd].subcategories, subInd, subInd-1);
        $timeout(function() {
          $scope.selectSub(catInd, subInd-1);
        }, 10);
      }
    };

    $scope.downSub = function(catInd, subInd) {
      subInd = parseInt(subInd);
//      catInd = parseInt(catInd);
      if (subInd < $scope.db.config.categories[catInd].subcategories.length - 1) {
        moveItem($scope.db.config.categories[catInd].subcategories, subInd, subInd+1);
        $timeout(function() {
          $scope.selectSub(catInd, subInd+1);
        }, 10);
      }
    };

    // Initialise selection to category index of 0 and subcategory index of 0
    $scope.selectCat(0);

    // Return true if option is the currently selected option
    $scope.isCatSelected = function(catInd) {
      return catInd === $scope.catForm.catInd;
    };

    $scope.isSubSelected = function(subInd) {
      return subInd === $scope.catForm.subInd;
    };

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

    $scope.saveAll = function() {
      ActiviterDB.saveConfig();
    };

    $scope.$on('boundsChanged', function() {
      $scope.$apply();
    });

  });