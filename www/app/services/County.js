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
            addGeoJsonToMap: function (map) {
                var self = this;
                var styles = AppSettings.warningStyles;

                function onEachFeature(feature, layer) {
                    layer.setStyle(styles[self.maxLevel]);
                    layer.on('click', function (event) {
                        $state.go('county', {county: self});
                        layer.setStyle(styles.clicked);

                        $timeout(function () {
                            layer.setStyle(styles[self.maxLevel]);
                        }, 500);
                    });
                }

                /*
                 * This does the following:
                 * 1. Fetches geoJSON file
                 * 2. Caches it with angular $http built-in cache
                 * 3. Binds onEachFeature to every geoJSON polygon (color and click event)
                 * 4. Draws polygons on the leaflet map
                 */
                $http.get(self.geoJsonMinUrl, {cache: true})
                    .success(function (data) {
                        L.geoJson(data, {
                            onEachFeature: onEachFeature
                        }).addTo(map);
                    });
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