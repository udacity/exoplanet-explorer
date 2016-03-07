/*
Instructions:
(1) Rewrite get with the Fetch API: https://davidwalsh.name/fetch
(2) Finish the getJSON method. getJSON should take a URL and return the parsed JSON response.
  (a) getJSON needs to return a Promise!
(3) Test by console.logging the response and by passing the query string from getJSON to addSearchHeader.
(4) Handle errors by passing "unknown" to addSearchHeader.
 */

// Inline configuration for jshint below. Prevents `gulp jshint` from failing with quiz starter code.
/* jshint unused: false */

(function(document) {
  'use strict';

  var home = null;

  /**
   * Helper function to show the search query.
   * @param {String} query - The search query.
   */
  function addSearchHeader(query) {
    home.innerHTML = '<h2 class="page-title">query: ' + query + '</h2>';
  }

  /**
   * XHR wrapped in a Promise using Fetch.
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    /*
    Use the Fetch API to GET a URL.
    Return the fetch.

    Your code goes here!
     */
  }

  /**
   * Performs an XHR for a JSON and returns a parsed JSON response.
   * @param  {String} url - The JSON URL to fetch.
   * @return {Promise}    - A promise that passes the parsed JSON response.
   */
  function getJSON(url) {
    /*
    Return a Promise that gets a URL and parses the JSON response. Use your get method!

    Your code goes here!
     */
  }

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');
    /*
    Uncomment the next line when you're ready to test!
    Don't forget to chain with a .then and a .catch!

    Your code goes here too!
     */
    // getJSON('../data/earth-like-results.json')
  });
})(document);
