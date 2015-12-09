/*
Instructions:
(1) Wrap an XHR in a Promise in the get() function below.
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

  function get(url) {
    /*
    This code needs to get wrapped in a promise!
     */
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        // It worked!
        // You'll want to resolve with the data from req.response
      } else {
        // It failed :(
        // Be nice and reject with req.statusText
      };
    };
    req.onerror = function() {
      // It failed :(
      // Pass a Network Error to reject
    };
    req.send();
  };

  window.addEventListener('WebComponentsReady', function() {
    /*
    Uncomment the next line you're ready to start chaining and testing!
    You'll need to add a .then and a .catch.
     */
    // get('http://udacity.github.io/exoplanet-explorer/site/app/data/earth-like-results.json')
  });
})(document);
