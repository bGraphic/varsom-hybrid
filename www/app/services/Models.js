/*global angular, firebase */

angular.module('Varsom')
  .service("FirebaseRef", function () {
    "use strict";

    function areaRefString(areaType, areaId) {
      if (parseInt(areaId, 10) < 10) {
        areaId = "0" + parseInt(areaId, 10);
      }

      if ("municipalities" === areaType) {
        var countyId = areaId.substring(0, 2);
        return "municipalities/id" + countyId + "/id" + areaId;
      } else {
        return areaType + "/id" + areaId;
      }
    }

    var rootRef = firebase.database().ref();

    this.forecastRef = function (warningType, areaType, areaId) {
      var ref = rootRef.child("forecast/" + warningType);
      ref = ref.child(areaRefString(areaType, areaId));
      ref = ref.child("Forecast");
      return ref;
    };

    this.areaRef = function (areaType, areaId) {
      var ref = rootRef.child("areas");
      ref = ref.child(areaRefString(areaType, areaId));
      return ref;
    };

    this.areasRef = function (areaType, parentId) {
      var ref = rootRef.child("areas");

      if ("regions" === areaType) {
        ref = ref.child("/regions/");
      } else if (parentId) {
        ref = ref.child("/municipalities/id" + parentId);
      } else {
        ref = ref.child("/counties/");
      }

      return ref;
    };

    this.areaType = function (areaRef) {
      if (areaRef.parent.key.indexOf("id") < 0) {
        return areaRef.parent.key;
      } else {
        return areaRef.parent.parent.key;
      }
    };
  });

angular.module('Varsom')
  .factory("Forecast", function ($firebaseObject, FirebaseRef, $firebaseArray) {
    "use strict";

    var Forecast = $firebaseObject.$extend({
      $$defaults: {
        'day0': {
          Rating: 0
        },
        'day1': {
          Rating: 0
        },
        'day2': {
          Rating: 0
        }
      }
    });

    return function (warningType, areaType, areaId) {
      var forecastRef = FirebaseRef.forecastRef(warningType, areaType, areaId);
      return new Forecast(forecastRef);
    };

  });

angular.module('Varsom')
  .factory("Area", function ($firebaseObject, FirebaseRef, Forecast) {
    "use strict";

    function getHighestForecast(landslideForecast, floodForecast) {
      if (!landslideForecast.day0 || !landslideForecast.day1 || !landslideForecast.day2 || !floodForecast.day0 || !floodForecast.day1 || !floodForecast.day2) {
        return null;
      }

      var highestForecast = [];
      angular.forEach(landslideForecast, function (landslideWarning, key) {
        var floodWarning = floodForecast[key];
        if (floodWarning.Rating > landslideWarning.Rating) {
          highestForecast.push(floodWarning);
        } else {
          highestForecast.push(landslideWarning);
        }
      });
      return highestForecast;
    }

    function setHighestForecast(area) {
      var highestForecast = getHighestForecast(area.LandslideForecast, area.FloodForecast);

      if (highestForecast) {
        area.Forecast = highestForecast;
      }
    }

    function getHighestRating(forecast) {
      var highestRating = 0;
      angular.forEach(forecast, function (warning) {
        highestRating = warning.Rating > highestRating ? warning.Rating : highestRating;
      });
      return highestRating;
    }

    function setHighestRating(area) {
      area.Rating = getHighestRating(area.Forecast);
    }

    var Area = $firebaseObject.$extend({
      $$defaults: {
        Rating: 0,
        Forecast: {
          'day0': {
            Rating: 0
          },
          'day1': {
            Rating: 0
          },
          'day2': {
            Rating: 0
          }
        }
      },
      $$updated: function (snap) {
        this.Id = snap.val().Id;
        this.Name = snap.val().Name;
        this.AreaType = FirebaseRef.areaType(snap.ref);

        if ("regions" === this.AreaType) {
          this.Forecast = Forecast("avalanche", this.AreaType, this.Id);
          this.Forecast.$watch(function () {
            setHighestRating(area);
          });
        } else {
          this.LandslideForecast = Forecast("landslide", this.AreaType, this.Id);
          this.FloodForecast = Forecast("flood", this.AreaType, this.Id);
          var area = this;
          this.LandslideForecast.$watch(function () {
            setHighestForecast(area);
            setHighestRating(area);
          });
          this.FloodForecast.$watch(function () {
            setHighestForecast(area);
            setHighestRating(area);
          });
        }
      }
    });

    return function (areaType, areaId) {
      var ref = FirebaseRef.areaRef(areaType, areaId);
      return new Area(ref);
    };

  });

angular.module('Varsom')
  .factory("Areas", function ($firebaseArray, FirebaseRef, Area) {
    "use strict";

    var Areas = $firebaseArray.$extend({
      $$added: function (snap, prevChildKey) {
        return Area(FirebaseRef.areaType(snap.ref), snap.val().Id);
      },
      getArea: function (areaId) {
        if (parseInt(areaId, 10) < 10) {
          areaId = "0" + parseInt(areaId, 10);
        }
        return this.$getRecord("id" + areaId);
      }
    });

    return function (areaType, parentId) {
      var ref = FirebaseRef.areasRef(areaType, parentId);
      return Areas(ref);
    };
  });
