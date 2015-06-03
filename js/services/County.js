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

        var countiesDeferred = $q.defer();
        service.countiesLoaded = countiesDeferred.promise;

        query.find({
            success: function (results) {
                var countyArray = [];

                for (var i = 0; i < results.length; i++) {
                    // Iteratoration for class object.
                    countyArray.push({
                        name: results[i].get('name'),
                        geojson: results[i].get('geoJSONmed').url()
                    });
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