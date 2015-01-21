angular.module('Activiter2')
  .factory('ActiviterDB', function($q, $timeout) {
    var todayData = {};
    var report = [];

    var db = {};

    var todayString = "";

    db.loadConfig = function() {
      var deferred = $q.defer();

      chrome.storage.local.get('config', function(response) {
        if (!isEmptyObj(response)) {
          db.config = response.config;
        } else {
          db.config = {
            "entryFocus": "description",
            "rootDirectory": undefined,
            "rootDirectoryPath": undefined,
            "categories": [
              {
                "name": "Category 1",
                "subcategories": ["Subcategory 1", "Subcategory 2", "Subcategory 3"]
              },
              {
                "name": "Category 2",
                "subcategories": ["Subcategory 4", "Subcategory 5", "Subcategory 6"]
              }
            ]
          }
        }
        deferred.resolve();
      });
      return deferred.promise;
    };

    db.saveConfig = function() {
      chrome.storage.local.set({'config': db.config});
    };

//    db.config = {
//      "entryFocus": "duration",
//      "categories": [
//        {
//          "name": "Support - Remedy",
//          "subcategories": [
//            "Quickdocs",
//            "CDP",
//            "SupportPoint",
//            "Merit",
//            "CLT",
//            "QMS",
//            "ELMO",
//            "Exchange",
//            "Video Conf",
//            "Yammer",
//            "vNet",
//            "ETS",
//            "AssetVision"
//          ]
//        },
//        {
//          "name": "General Support",
//          "subcategories": [
//            "Quickdocs",
//            "CDP",
//            "SupportPoint",
//            "CLT",
//            "QMS",
//            "ELMO",
//            "Merit"
//          ]
//        },
//        {
//          "name": "Projects",
//          "subcategories": [
//            "Quickdocs",
//            "QMS",
//            "CDP",
//            "SupportPoint",
//            "Merit",
//            "CLT",
//            "ELMO"
//          ]
//        },
//        {
//          "name": "Team Activities",
//          "subcategories": [
//          "Knowledge Transfer",
//            "Documentation",
//            "Meetings",
//            "Other"
//          ]
//        },
//        {
//          "name": "Contractual",
//          "subcategories": [
//            "Quickdocs",
//            "CDP",
//            "ELMO",
//            "Merit",
//            "SupportPoint"
//          ]
//      }
//      ]
//    }


    db.getRootDirectory = function() {
      var deferred = $q.defer();

      chrome.fileSystem.chooseEntry({type: "openDirectory"}, function(entry) {
        if (entry) {
          chrome.fileSystem.getDisplayPath(entry, function(path) {
            db.config.rootDirectory = chrome.fileSystem.retainEntry(entry);
            db.config.rootDirectoryPath = path
            chrome.storage.local.set({"config": db.config});
            deferred.resolve(path);
          });
        }
      });
      return deferred.promise;
    };

    db.today = new Date(new Date().toDateString());
    todayString = toEpoch(db.today);

    db.getDate = function() {
      return today;
    };

    db.setDate = function(date) {
      db.today = date;
      todayString = toEpoch(date);
      db.loadToday();
    };

    db.loadToday = function() {
      var deferred = $q.defer();
      chrome.storage.local.get(todayString, function(response) {
        if (!isEmptyObj(response)) {
          todayData = response[todayString];
        } else {
          todayData = {
            "date": db.today,
            "entries": []
          };
        }
        deferred.resolve();
      });
    };

    db.todayData = function() {
      return todayData;
    };

    db.todayItems = function() {
      return todayData.entries;
    };

    db.saveEntry = function(form) {
      todayData.entries.push(form);
      var data = {};
      data[todayString] = todayData;
      chrome.storage.local.set(data);
    };

    db.removeItem = function(index) {
      todayData.entries.splice(index, 1);
    };

    db.getReport = function() {
      return report;
    };

    var compileSummaryData = function(todayString, group1, group2) {
      var deferred = $q.defer();

      chrome.storage.local.get(todayString, function(result) {
        if (isEmptyObj(result)) {
          deferred.resolve();
        } else {
          var day = result[todayString];
          for (index in day.entries) {
            var stats = {
              "date": fromDate(new Date(fromEpoch(todayString))),
              "category": day.entries[index].category,
              "subcategory": day.entries[index].subcategory
            };
            var g1 = stats[group1];
            var g2 = stats[group2] || "none";
            var duration = parseInt(day.entries[index].duration);

            // handle group1 cases
            if (!(report.hasOwnProperty(g1))) {
              if (g2 === "none") {
                report[g1] = {
                  "items" : 1,
                  "duration" : duration
                };
                continue;
              } else {
                report[g1] = {};
              }
            } else { // If property exists
              if (g2 === "none") {
                report[g1].items++
                report[g1].duration += duration;
                continue;
              }
            }

            // handle group2 cases when applicable
            if (!(report[g1].hasOwnProperty(g2))) {
              report[g1][g2] = {
                "items": 1,
                "duration": duration
              };
            } else {
              report[g1][g2].items++;
              report[g1][g2].duration += duration;
            }
          }
        }
        deferred.resolve();
      });

      return deferred.promise;
    };

    var compileDetailData = function(todayString) {
      var deferred = $q.defer();

      chrome.storage.local.get(todayString, function(result) {
        if (isEmptyObj(result)) {
          deferred.resolve();
        } else {
          var day = result[todayString];
          for (index in day.entries) {
            var entry = day.entries[index];
            report.push([
              fromDate(new Date(fromEpoch(todayString))),
              entry.category,
              entry.subcategory,
              entry.source,
              entry.description,
              entry.duration,
              entry.timestamp]);
          }
        }
        deferred.resolve();
      });

      return deferred.promise;
    };

    db.generateReport = function(criteria) {
      var deferred = $q.defer();

      var type = criteria.type;
      var start = new Date(criteria.start.toDateString());
      var end = new Date(criteria.end.toDateString());
      var reportDays = (end-start)/86400000;
      var g1 = criteria.groupBy1;
      var g2 = criteria.groupBy2;

      if (type === 'summary') {
        report = {};
      } else {
        report = [];
      }

      var compileFunction = {
        "summary": compileSummaryData,
        "detail": compileDetailData
      };

      $timeout(function() {
        var iterations = 0;
        for (var i = start; i <= end; i.setDate(i.getDate() + 1)) {
          var todayString = toEpoch(i);
          compileFunction[type](todayString, g1, g2)
            .then(function() {
              iterations++;
              if (iterations >= reportDays) {
                deferred.resolve();
              }
            });
        }
      }, 1);
      return deferred.promise;
    };

    db.exportReport = function() {

    };

    return db;

  });