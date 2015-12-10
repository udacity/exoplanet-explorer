/*
Instructions:
(1) Rewrite get with the Fetch API: https://davidwalsh.name/fetch
(2) Finish the getJSON method. getJSON should take a URL and return the parsed JSON response.
  (a) getJSON needs to return a Promise!
  (b) Read the Fetch API to learn how to parse JSON with Fetch.
(3) Test by passing the query string from the JSON to addSearchHeader.
(4) Handle errors by passing "unknown" to addSearchHeader.
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
    return fetch(url, {
      method: 'get'
    })
  };

  /**
   * Performs an XHR for a JSON and returns a parsed JSON response.
   * @param  {String} url - The JSON URL to fetch.
   * @return {Promise}    - A promise that passes the parsed JSON response.
   */
  function getJSON(url) {
    return get(url).then(function(response) {
      return response.json();
    });
  };

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');
    /*
    Uncomment the next line, add you're ready to test! Don't forget to chain a .then and a .catch!
     */
    getJSON('http://udacity.github.io/exoplanet-explorer/site/app/data/earth-like-results.json')
    .then(function(response) {
      addSearchHeader(response.query);
    })
    .catch(function(error) {
      addSearchHeader('unknown');
      console.log(error);
    })
  });
})(document);
