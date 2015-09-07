/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .factory('Municipality', function Municipality($q) {

        var Municipality = Parse.Object.extend('Municipality', {
            initialize: function (attrs, options) { }
        },{
            listAll: function (countyId) {
                var defer = $q.defer();
                var query = new Parse.Query(this);
                query.equalTo('countyId', countyId);
                query.ascending('name');

                query.find({
                    success: function (results) {
                        defer.resolve(results);
                    },
                    error: function (error) {
                        defer.reject(error);
                        alert('Could not fetch municipalities');
                        console.log(error);
                    }
                });

                return defer.promise;
            }
        });

        Object.defineProperties(Municipality.prototype, {
            'name': {
                get: function () {
                    return this.get('name');
                }
            }
        });

        return Municipality;
    });