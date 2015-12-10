/*
Instructions:
(1) Use .forEach to create a sequence of Promises.
  (a) Fetch each planet's JSON from the array of URLs in the search results.
  (b) Call createPlanetThumb on each planet's response data to add it to the page.
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
   * Helper function to create a planet thumbnail.
   * @param  {Object} data - The raw data describing the planet.
   */
  function createPlanetThumb(data) {
    var pT = document.createElement('planet-thumb');
    for (let d in data) {
      pT[d] = data[d];
    }
    home.appendChild(pT);
  };

  /**
   * XHR wrapped in a promise
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    return fetch(url);
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
    Your code goes here! Uncomment the next line when you're ready to start!
     */
    // TODO: swap this out with a non local source!!!
    // Not seeming to be in series?
    getJSON('../data/earth-like-results.json')
    .then(function(response) {
      var sequence = Promise.resolve();

      response.results.forEach(function (url) {
        sequence = sequence.then(function() {
          return getJSON(url)
        })
        .then(createPlanetThumb);
      });
    })
    .catch(function(e) {
      console.log(e);
    });
  });
})(document);
