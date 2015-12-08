/*
Instructions:
(1) Wrap an XHR in a Promise in the get() function below. See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
  (a) Resolve on load and reject on error.
(2) If the XHR resolves, use addSearchHeader to add the search header to the page.
(3) If the XHR fails, console.log the error.
 */

(function(document) {
  'use strict';

  var home = null;

  /*
  Helper function to show the search query.
   */
  function addSearchHeader(string) {
    home.innerHTML = '<h2 class="page-title">query: ' + string + '</h2>';
  };

  function get() {
    /*
    Your Promise goes here!
     */
  };

  window.addEventListener('WebComponentsReady', function() {
    /*
    Uncomment the next line you're ready to start chaining and testing!
    You'll need to add a .then and a .catch.
     */
    // get('http://udacity.github.io/exoplanet-explorer/site/app/data/earth-like-results.json')
  });
})(document);
