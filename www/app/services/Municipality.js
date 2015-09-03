/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .factory('Municipality', function Municipality($q) {
        var service = {};
        var Municipality = Parse.Object.extend('Municipality');
        var query = new Parse.Query(Municipality);

        service.loadMunicipalities = function (countyID) {
            var deferred = $q.defer();
            service.loaded = deferred.promise;
            query.equalTo('countyId', countyID);
            query.ascending('name');

            query.find({
                success: function (results) {
                    var arr = [];

                    for (var i = 0; i < results.length; i++) {
                        // Iteratoration for class object.
                        var obj = {
                            name: results[i].get('name')

                        };

                        arr.push(obj);
                    }
                    deferred.resolve(arr);
                },
                error: function (error) {
                    deferred.reject();
                    alert("Error: " + error.code + " " + error.message);
                }
            });

        };

        return service;
    });