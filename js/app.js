var app = angular.module("Activiter2", ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/trackerView.html',
      controller: 'TrackerCtrl'
    })
    .when('/audit', {
      templateUrl: 'partials/auditView.html',
      controller: 'AuditCtrl'
    })
    .when('/reports', {
      templateUrl: 'partials/reportsView.html',
      controller: 'ReportsCtrl'
    })
    .when('/config', {
      templateUrl: 'partials/configView.html',
      controller: 'ConfigCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);



