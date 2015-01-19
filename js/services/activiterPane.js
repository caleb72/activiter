angular.module('Activiter2')
  .factory('ActiviterPane', function($rootScope, $document) {
    var pane = {};

    var getHeight = function() {
      var paneHeight = chrome.app.window.current().innerBounds.height;
      return paneHeight;
    };

    pane.height = getHeight();

    chrome.app.window.current().onBoundsChanged.addListener( function() {
      pane.height = getHeight();
      $rootScope.$broadcast('boundsChanged');
    });

    $document.bind('keydown', function(e) {
      $rootScope.$broadcast('keypress:' + e.which);
    });

    return pane;
  });