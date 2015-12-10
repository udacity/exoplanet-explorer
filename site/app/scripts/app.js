/*
Instructions:
(1) Rewrite get with the Fetch API: https://davidwalsh.name/fetch
(2) Finish the getJSON method. getJSON should take a URL and return the parsed JSON response.
  (a) getJSON needs to return a Promise!
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
   * XHR wrapped in a Promise.
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    /*
    Use the Fetch API to GET a URL.
    Return the fetch as a Promise.

    Your code goes here!
     */
  };

  function getJSON(url) {
    /*
    Return a Promise that gets a URL and parses the JSON response. Use your get method!
    Your code goes here!
     */
  };

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');
    /*
    Uncomment the next line when you're ready to test! Don't forget to chain a .then and a .catch!
     */
    // getJSON('http://udacity.github.io/exoplanet-explorer/site/app/data/earth-like-results.json')
  });
})(document);
