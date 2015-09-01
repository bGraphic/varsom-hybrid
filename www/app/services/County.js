/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .factory('County', County);

    function County($q) {
        var service = {};
        var County = Parse.Object.extend('County');
        var query = new Parse.Query(County);
        query.include('FloodWarningForecast');
        query.include('LandSlideWarningForecast');

        var countiesDeferred = $q.defer();
        service.loaded = countiesDeferred.promise;

        query.find({
            success: function (results) {
                var countyArray = [];

                for (var i = 0; i < results.length; i++) {
                    // Iteratoration for class object.
                    var obj = {
                        countyId: results[i].get('countyId'),
                        name: results[i].get('name'),
                        geojson: results[i].get('geoJSONmin').url(),
                        forecasts: {
                            flood: results[i].get('FloodWarningForecast'),
                            landslide: results[i].get('LandSlideWarningForecast')
                        }
                    };
                    var tempBiggestLevel = -1;

                    for(var j = obj.forecasts.flood.length; j--;){
                        if(obj.forecasts.flood[j].attributes.activityLevel > tempBiggestLevel)
                            tempBiggestLevel = obj.forecasts.flood[j].attributes.activityLevel;
                        if(obj.forecasts.landslide[j].attributes.activityLevel > tempBiggestLevel)
                            tempBiggestLevel = obj.forecasts.landslide[j].attributes.activityLevel;
                    }

                    obj.forecasts.maxLevel = tempBiggestLevel;

                    countyArray.push(obj);
                }
                countiesDeferred.resolve(countyArray);
            },
            error: function (error) {
                countiesDeferred.reject();
                alert("Error: " + error.code + " " + error.message);
            }
        });

        return service;
    }
})();