/*
Instructions:
(1) Finish the getJSON method. getJSON should take a URL and return the parsed JSON response.
  (a) getJSON needs to return a Promise!
(2) Test by passing the query string from the JSON to addSearchHeader.
(3) Handle errors by passing "unknown" to addSearchHeader.
 */

(function(document) {
  'use strict';

  var home = null;

  /**
   * Helper function to show the search query.
   * @param {String} query - The search query.
   */
  function addSearchHeader(query) {
    home.innerHTML = '<h2 class="page-title">query: ' + query + '</h2>';
  };

  /**
   * XHR Wrapped in a promise
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    return new Promise(function(resolve) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        };
      };
      req.onerror = function() {
        reject(Error('Network Error'));
      };
      req.send();
    });
  };

  function getJSON(url) {
    /*
    Return a Promise that gets a URL and parses the JSON response.
    Your code goes here!
     */
  };

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');
    /*
    Uncomment the next line, add you're ready to test! Don't forget to chain a .then and a .catch!
     */
    // getJSON('http://udacity.github.io/exoplanet-explorer/site/app/data/earth-like-results.json')
  });
})(document);
