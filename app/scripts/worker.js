// if a search request arrives before the data is ready,
// send back a pending state, then send the data when it's
// ready to the same requester.

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Example_2_Advanced_passing_JSON_Data_and_creating_a_switching_system
var queryableFunctions = {
  query: function(queryString) {
    // TODO: parse the string
    // TODO: query the db differently depending on string

    var type = 'type of query';
    var params = 'params of query';
    db.makeRequest(type, params).then(function(planets) {
      reply('returnedQuery', planets);
    })
    .catch(function() {
      reply('returnedQuery', []);
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
  var database = [];
  var index = {};
  var dataReceived = false;
  var searchReady = false;
  var requestError = false;
  var fireSearchReady = function() {};
  var fireParsingFailed = function() {};
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
    database.push({name: planetData.pl_name, data: planetData});
    index[planetData.pl_name] = database.length - 1;
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
    planets.forEach(function(planet) {
      self._loadPlanetIntoDatabase(planet);
    });
    searchReady = true;
    fireSearchReady();
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
          // something else!
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
      }
      else {
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
