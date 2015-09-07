/**
 * County Parse model
 */

angular
    .module('Varsom')
    .factory('County', function County($q, $http, $state, $timeout, $ionicLoading, AppSettings) {

        var County = Parse.Object.extend('County', {
            // Instance methods
            initialize: function (attrs, options) {

            },
            fetchGeoJson: function () {
                var defer = $q.defer();
                var self = this;

                $http.get(self.geoJsonMinUrl, {cache: true})
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (error) {
                        defer.reject(error);
                        alert(error);
                    });

                return defer.promise;
            }
        }, {
            //Class methods
            listAll: function () {
                $ionicLoading.show({delay: 100});
                var defer = $q.defer();
                var query = new Parse.Query(this);
                query.limit(100);
                query.descending('countyId');
                query.include('FloodWarningForecast');
                query.include('LandSlideWarningForecast');
                query.find({
                    success: function (counties) {
                        defer.resolve(counties)
                    },
                    error: function (error) {
                        defer.reject(error);
                        alert(error);
                    }
                }).then(function () {
                    $ionicLoading.hide();
                });

                return defer.promise;
            },
            getById: function (countyId) {
                var defer = $q.defer();
                var query = new Parse.Query(this);
                query.equalTo('countyId', countyId);

                query.first({
                    success: function (results) {
                        defer.resolve(results);
                    },
                    error: function (error) {
                        defer.reject(error);
                        alert(error);
                    }
                });

                return defer.promise;
            }

        });

        Object.defineProperties(County.prototype, {
            'countyId': {
                get: function () {
                    return this.get('countyId');
                }
            },
            'name': {
                get: function () {
                    return this.get('name');
                }
            },
            'geoJsonMinUrl': {
                get: function () {
                    return this.get('geoJSONmin').url();
                }
            },

            'floodForecast': {
                get: function () {
                    return this.get('FloodWarningForecast');
                }
            },

            'landSlideForecast': {
                get: function () {
                    return this.get('LandSlideWarningForecast');
                }
            },

            'maxLevel': {
                get: function () {

                    var floodForecast = this.floodForecast,
                        landSlideForecast = this.landSlideForecast;

                    var tempBiggestLevel = -1;

                    for (var j = floodForecast.length; j--;) {
                        var curFloodLevel = floodForecast[j].get('activityLevel'),
                            curLandSlideLevel = landSlideForecast[j].get('activityLevel');

                        if (curFloodLevel > tempBiggestLevel)
                            tempBiggestLevel = curFloodLevel;
                        if (curLandSlideLevel > tempBiggestLevel)
                            tempBiggestLevel = curLandSlideLevel;
                    }

                    return tempBiggestLevel;
                }
            }
        });

        return County;

    });