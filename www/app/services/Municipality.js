/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .factory('Municipality', function Municipality($q, $ionicLoading) {

        var Municipality = Parse.Object.extend('Municipality', {
            initialize: function (attrs, options) { }
        },{
            listAll: function (countyId) {
                $ionicLoading.show({delay: 100});
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
                    }
                }).then(function(){
                    $ionicLoading.hide();
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