'use strict';
// if a search request arrives before the data is ready,
// send back a pending state, then send the data when it's
// ready to the same requester.

// http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
/**
 * Performs a binary search on the host array. This method can either be
 * injected into Array.prototype or called with a specified scope like this:
 * binaryIndexOf.call(someArray, searchElement);
 *
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not found.
 */
function binaryIndexOf(searchElement) {
  var minIndex = 0;
  var maxIndex = this.length - 1;
  var currentIndex;
  var currentElement;

  while (minIndex <= maxIndex) {
    currentIndex = (minIndex + maxIndex) / 2 | 0;
    currentElement = this[currentIndex];

    if (currentElement < searchElement) {
      minIndex = currentIndex + 1;
    } else if (currentElement > searchElement) {
      maxIndex = currentIndex - 1;
    } else {
      return currentIndex;
    }
  }

  return -1;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Example_2_Advanced_passing_JSON_Data_and_creating_a_switching_system
var queryableFunctions = {
  query: function(queryString) {
    // TODO: parse the string
    // TODO: query the db differently depending on string

    // if no index or index doesn't match possiblites, run general search

    var params = [
      {
        name: 'eg: mass, radius',
        specific: 'value',
        upper: 10000000,
        lower: 0
      }
    ]

    // if general search, just pass a single param with a single value

    var type = 'type of query';
    db.makeRequest(type, params).then(function(planets) {
      // return object resembling:
      // {
      //  results: [sorted planets]
      // }
      reply('returnedQuery', planets);
    })
    .catch(function() {
      reply('returnedQuery', {error: true});
    })
  },
  getPlanetByName: function(name) {
    db.makeRequest('name', {name: name}).then(function(planet) {
      reply('gotPlanetByName', planet);
    }).catch(function() {
      reply('gotPlanetByName', {error: true});
    });
  }
};

// system functions

function defaultQuery (vMsg) {
  // your default PUBLIC function executed only when main page calls the queryableWorker.postMessage() method directly
  // do something
}

function reply (/* listener name, argument to pass 1, argument to pass 2, etc. etc */) {
  if (arguments.length < 1) { throw new TypeError('reply - not enough arguments'); return; }
  postMessage({'vo42t30': arguments[0], 'rnb93qh': Array.prototype.slice.call(arguments, 1)});
}

onmessage = function (oEvent) {
  if (oEvent.data instanceof Object && oEvent.data.hasOwnProperty('bk4e1h0') && oEvent.data.hasOwnProperty('ktp3fm1')) {
    queryableFunctions[oEvent.data.bk4e1h0].apply(self, oEvent.data.ktp3fm1);
  } else {
    defaultQuery(oEvent.data);
  }
};

function Database() {
  var self = this;

  // master database
  var database = [];

  // indexes position of planet in master database
  var nameIndex = {};

  // data from commonly searched fields sorted by value
  var distanceIndex = [];
  var massIndex = [];
  var radiusIndex = [];
  var densityIndex = [];
  var temperatureIndex = [];
  var facilityIndex = [];
  var telescopeIndex = [];
  var methodIndex = [];

  // state variables
  var dataReceived = false;
  var searchReady = false;
  var requestError = false;
  var fireSearchReady = function() {};
  var fireParsingFailed = function() {};

  // methods
  this.ready = function() {
    return new Promise(function(resolve, reject) {
      if (searchReady) {
        resolve();
      } else {
        fireSearchReady = resolve;
        fireParsingFailed = reject;
      }
    })
  };
  this._requestOnePlanet = function(name) {
    name = name.replace(/ /g, '');
    return getJSON('/data/planets/' + name + '.json');
  };
  this._reqByName = function(name) {
    if (!name) { throw new TypeError('Database - getPlanetByName needs a name'); };
    return new Promise(function(resolve, reject) {
      if (searchReady) {
        var planet = database[index[name]];
        if (planet) {
          // got the data so send it back
          resolve(planet);
        } else {
          // planet isn't in database
          reject();
        }
      } else {
        // db isn't ready so send a request for the specific planet
        reject();
      }
    }).catch(function() {
      return self._requestOnePlanet(name);
    })
    .catch(function(e) {
      // can't find the planet at all
      return {missing: true};
    })
  };
  this._loadPlanetIntoDatabase = function(planetData) {
    var planetName = planetData.pl_name;

    database.push({name: planetName, data: planetData});
    nameIndex[planetName] = database.length - 1;

    var distance = planetData.st_dist;
    if (distance) {
      distanceIndex.push({planetName: distance});
    }

    var radius = null;
    if (planetData.pl_rade) {
      radius = planetData.pl_rade;
    } else if (planetData.pl_radj) {
      radius = planetData.pl_radj * 11.2;
    }
    if (radius) {
      radiusIndex.push({planetName: radius});
    }

    var mass = null;
    if (planetData.pl_masse) {
      mass = planetData.pl_masse;
    } else if (planetData.pl_massj) {
      mass = planetData.pl_massj * 317.8;
    }
    if (mass) {
      massIndex.push({planetName: mass});
    }

    if (radius && mass) {
      var density = mass / ( (4/3) * (Math.PI) * (radius * radius * radius) );

      densityIndex.push({planetName: density});
    }

    if (planetData.pl_eqt) {
      var temperature = planetData.pl_eqt;
      temperatureIndex.push({planetName: temperature});
    }

    if (planetData.pl_facility) {
      var facility = planetData.pl_facility;
      facilityIndex.push({planetName: facility});
    }

    if (planetData.pl_telescope) {
      var telescope = planetData.pl_telescope;
      telescopeIndex.push({planetName: telescope});
    }

    if (planetData.pl_discmethod) {
      var method = planetData.pl_discmethod;
      methodIndex.push({planetName: method});
    }
  };
  this._init = function() {
    function request() {
      return getJSON('/data/data.json').then(function(planets) {
        dataReceived = true;
        return planets;
      });
    };
    request().catch(function() {
      // try it one more time
      return request();
    })
    .then(self._prepDatabase);
  };
  this._prepDatabase = function(planets) {
    performance.mark('mark_start_load');
    planets.forEach(function(planet) {
      self._loadPlanetIntoDatabase(planet);
    });
    self._sort();
    searchReady = true;
    fireSearchReady();
    performance.mark('mark_end_load');
    performance.measure('measure_planet_indexing', 'mark_start_load', 'mark_end_load');
    var time = performance.getEntriesByName('measure_planet_indexing');
    console.log('Indexed planets in: ' + time[0].duration + 'ms');
  };
  this._sort = function() {

  };

  /**
   * [makeRequest description]
   * @param  {String} type   One of 'name', 'queryGeneral', 'querySpecific'
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  this.makeRequest = function(type, params) {
    var req = function() {};
    if (arguments.length !== 2) { throw new Error('Database - ' + arguments.length + ' request arguments received. 2 expected.'); };
    switch (type) {
      case 'name':
        req = function() {
          try {
            return self._reqByName(params.name);
          } catch (e) {
            throw new TypeError('Database - getByName request missing name string.');
          }
        };
        break;
      case 'queryGeneral':
        req = function() {
          return self.ready().then(function() {
            self.database.forEach(function (planet) {
              // something about looking through all planet values for params
            });
          })
        };
        break;
      case 'querySpecific':
        req = function() {
          return self.ready().then(function() {
            // TODO: possible optimizations: create subworkers?

            // create a single return object
            // TODO: results could have:
            // good matches and almost matches
            var results = {};

            // create an array of promises
            // this should probably be a sequence that pairs down the main index
            var sequence = Promise.resolve();
            params.forEach(function(p) {
              sequence = sequence.then(function(p) {
                // p.name gives index
                // p.specific, p.upper, p.lower give tests
                // when promise resolves with planet(s), add planet name to the return object
              })
              // each planet has a score. increment the score by 1
              // if the planet is there, just increment the score
            })
            .then(function() {
              // when all finish, sort the planets by scores
              // return the sorted array of planets
              // if there are no results, return empty array
            })
            .catch(function() {
              // something went wrong, throw error
            })
          })
        };
        break;
      default:
        throw new TypeError('Database - unknown request type: ' + type + '.');
        break;
    }
    return new Promise(function(resolve) {
      resolve(req());
    })
  };

  this._init();
};

var db = new Database();

function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status === 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error('Network Error'));
    };

    // Make the request
    req.send();
  });
}

function getJSON(url) {
  return get(url).then(JSON.parse).catch(function() {
    throw new Error('AJAX Error');
  });
};
