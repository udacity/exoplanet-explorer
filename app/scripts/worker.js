'use strict';
// if a search request arrives before the data is ready,
// send back a pending state, then send the data when it's
// ready to the same requester.

// http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
/**
 * Performs a binary search on the host array. This method can either be
 * injected into Array.prototype or called with a specified scope like this:
 * binaryIndexOfClosestNumber.call(someArray, searchElement);
 *
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not found.
 */
function binaryIndexOfClosestNumber(searchElement, searchProperty) {
  var minIndex = 0;
  var maxIndex = this.length - 1;
  var currentIndex;
  var currentElement;

  var diff;
  var lastDiff;

  while (minIndex <= maxIndex) {
    currentIndex = (minIndex + maxIndex) / 2 | 0;
    currentElement = this[currentIndex][searchProperty];
    diff = currentElement - searchElement;

    if (diff < 0) {
      minIndex = currentIndex + 1;
    } else if (diff > 0) {
      maxIndex = currentIndex - 1;
    } else if (diff < lastDiff) { // this logic is wrong. need different criteria for stopping
      lastDiff = diff;
    } else {
      return currentIndex;
    }
  }

  return -1;
}

// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

// match what the homepage says
var queryPairings = {
  radius: {
    '0': {
      specific: -1
    },
    '1': {
      lower: 0,
      upper: 20
    },
    '2': {
      lower: 20,
      upper: 100
    },
    '3': {
      lower: 100,
      upper: -1
    }
  },
  mass: {
    '0': {
      specific: -1
    },
    '1': {
      lower: 0,
      upper: 2
    },
    '2': {
      lower: 2,
      upper: 100
    },
    '3': {
      lower: 100,
      upper: -1
    }
  },
  distance: {
    '0': {
      specific: -1
    },
    '1': {
      lower: 0,
      upper: 20
    },
    '2': {
      lower: 20,
      upper: 1000
    },
    '3': {
      lower: 1000,
      upper: -1
    }
  },
  temperature: {
    '0': {
      specific: -1
    },
    '1': {
      lower: 0,
      upper: 200
    },
    '2': {
      lower: 200,
      upper: 330
    },
    '3': {
      lower: 330,
      upper: 700
    },
    '4': {
      lower: 700,
      upper: -1
    }
  }
}

// queryString > queryParts > parts > pieces
function handleSlidersQuery(queryString) {
  var params = [];
  queryString = JSON.parse(queryString.replace('sliders-', ''));

  // matches the slider query with the pairings above
  for (var q in queryString) {
    var param = {
      field: q
    };
    var values = queryPairings[q][queryString[q]];
    for (var r in values) {
      param[r] = values[r];
    }
    params.push(param);
  }

  return params;
};

// queryString eg: distance 10 20, mass 1 3
// distance between 10 and 20 ly and mass between 1 and 3 masse
function handleCustomQuery(queryString) {
  var params = [];
  // split on commas
  // split result on spaces
  // if known field and 1 value, specific
  // if known field and 2 values, lower and upper

  var queryParts = queryString.split(',');
  queryParts.forEach(function (part) {
    var pieces = part.replace(/\W+/g, ' ').split(' ');

    if (pieces.length === 2) {
      params.push({
        field: pieces[0],
        specific: pieces[1]
      });
    } else if (pieces.length === 3) {
      params.push({
        field: pieces[0],
        lower: pieces[1],
        upper: pieces[2]
      })
    }
  });
  return params;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Example_2_Advanced_passing_JSON_Data_and_creating_a_switching_system
var queryableFunctions = {
  query: function(queryString) {
    performance.mark('mark_start_searching');

    if (!queryString || typeof queryString !== 'string') {
      reply('returnedQuery', {nosearch: true});
      return;
    }

    // query payload
    var params = {};
    var type = 'byField';

    try {
      if (queryString.indexOf('sliders-') === 0) {
        // made with sliders
        params = handleSlidersQuery(queryString);
      } else {
        // it's custom
        params = handleCustomQuery(queryString);
      }
    } catch (e) {
      // if something is wrong with the payload, just search all fields
      type = 'general';
      params = {
        specific: queryString
      }
    }

    db.makeRequest(type, params).then(function(planets) {
      performance.mark('mark_end_searching');
      performance.measure('measure_planet_searching', 'mark_start_searching', 'mark_end_searching');
      var time = performance.getEntriesByName('measure_planet_searching');
      console.log('Retrieved search results in: ' + Math.round(time[0].duration) + 'ms');

      reply('returnedQuery', planets);
    })
    .catch(function() {
      reply('returnedQuery', {error: true});
    })
  },
  getPlanetByName: function(name) {
    if (!name || typeof name !== 'string') {
      reply('gotPlanetByName', {noname: true});
      return;
    }
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

  // planet indexes in master database
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
  this._indexPlanet = function(planetData) {
    var planetName = planetData.pl_name;
    // add to main database
    database.push({name: planetName, data: planetData});
    nameIndex[planetName] = database.length - 1;

    // add to indexes
    var distance = planetData.st_dist;
    if (distance) {
      distanceIndex.push({planetName: planetName, distance: distance});
    }

    var radius = null;
    if (planetData.pl_rade) {
      radius = planetData.pl_rade;
    } else if (planetData.pl_radj) {
      radius = planetData.pl_radj * 11.2;
    }
    if (radius) {
      radiusIndex.push({planetName: planetName, radius: radius});
    }

    var mass = null;
    if (planetData.pl_masse) {
      mass = planetData.pl_masse;
    } else if (planetData.pl_massj) {
      mass = planetData.pl_massj * 317.8;
    }
    if (mass) {
      massIndex.push({planetName: planetName, mass: mass});
    }

    if (radius && mass) {
      var density = mass / ((4 / 3) * (Math.PI) * (radius * radius * radius));
      densityIndex.push({planetName: planetName, density: density});
    }

    if (planetData.pl_eqt) {
      var temperature = planetData.pl_eqt;
      temperatureIndex.push({planetName: planetName, temperature: temperature});
    }

    if (planetData.pl_facility) {
      var facility = planetData.pl_facility;
      facilityIndex.push({planetName: planetName, facility: facility});
    }

    if (planetData.pl_telescope) {
      var telescope = planetData.pl_telescope;
      telescopeIndex.push({planetName: planetName, telescope: telescope});
    }

    if (planetData.pl_discmethod) {
      var method = planetData.pl_discmethod;
      methodIndex.push({planetName: planetName, method: method});
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
    performance.mark('mark_start_indexing');

    planets.forEach(function(planet) {
      self._indexPlanet(planet);
    });
    self._sortIndexes();

    searchReady = true;
    performance.mark('mark_end_indexing');

    fireSearchReady();

    performance.measure('measure_planet_indexing', 'mark_start_indexing', 'mark_end_indexing');
    var time = performance.getEntriesByName('measure_planet_indexing');
    console.log('Indexed planets in: ' + Math.round(time[0].duration) + 'ms');
  };
  this._sortIndexes = function() {
    radiusIndex.sort(function(a, b) {
      return a.radius - b.radius;
    });
    massIndex.sort(function(a, b) {
      return a.mass - b.mass;
    });
    densityIndex.sort(function(a, b) {
      return a.density - b.density;
    });
    temperatureIndex.sort(function(a, b) {
      return a.temperature - b.temperature;
    });
    facilityIndex.sort(function(a, b) {
      if (a.facility < b.facility) {
        return -1;
      } else if (a.facility > b.facility) {
        return 1;
      } else {
        return 0;
      }
    });
    telescopeIndex.sort(function(a, b) {
      if (a.telescope < b.telescope) {
        return -1;
      } else if (a.telescope > b.telescope) {
        return 1;
      } else {
        return 0;
      }
    });
    methodIndex.sort(function(a, b) {
      if (a.method < b.method) {
        return -1;
      } else if (a.method > b.method) {
        return 1;
      } else {
        return 0;
      }
    });
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
      case 'byField':
        req = function() {
          // the idea is to start with all planets and then exclude planets
          // that don't meet search criteria
          return self.ready().then(function() {
            var possibleResults = clone(database);
            params.forEach(function(param) {
              console.log(param);
              if (param.lower !== undefined && param.upper !== undefined) {
                var index = null;
                switch (param.field) {
                  case 'distance':
                    index = distanceIndex;
                    break;
                  case 'radius':
                    index = radiusIndex;
                    break;
                  case 'mass':
                    index = massIndex;
                    break;
                  case 'temperature':
                    index = temperatureIndex;
                    break;
                  default:
                    // not sure how this could happen
                    break;
                }

                var lower, upper;
                if (param.lower === -1) {
                  lower = 0;
                } else {
                  lower = (function() {
                    var i = 0;
                    index.forEach(function (p, ind) {
                      if (p[param.field] < param.lower) {
                        i = ind;
                      }
                    });
                    return i;
                  })();
                }
                if (param.upper === -1) {
                  upper = index[index.length - 1 ];
                } else {
                  upper = (function() {
                    var i = 0;
                    for (var i = index.length - 1; i === 0; i--) {
                      if (index[i][param.field] > param.upper) {
                        i = ind;
                      }
                    }
                    return i;
                  })();
                }
              } else if (param.specific !== undefined) {
                console.log('specific!');
              }
            });
            return possibleResults;
          })
          .then(function() {
            console.log('finished');
            // when all finish, sort the planets by name
            // return the sorted array of planets
            // if there are no results, return empty array
            
            return possibleResults;
          })
          .catch(function(e) {
            console.log(e);
            // something went wrong, throw error
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
