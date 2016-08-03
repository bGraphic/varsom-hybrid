angular
    .module('Varsom')
    .provider('Area', function () {

        function isCounty(area) {
            if (area.hasOwnProperty('countyId') && !area.hasOwnProperty('municipalityId')) {
                return true;
            } else {
                return false;
            }
        }

        function isMunicipality(area) {
            if (area.hasOwnProperty('municipalityId')) {
                return true;
            } else {
                return false;
            }
        }

        function isRegion(area) {
            if (area.hasOwnProperty('regionId')) {
                return true;
            } else {
                return false;
            }
        }

        function getId(area) {
            if (area.hasOwnProperty('municipalityId')) {
                return area.municipalityId;
            }

            if (area.hasOwnProperty('countyId')) {
                return area.countyId;
            }

            if (area.hasOwnProperty('regionId')) {
                return area.regionId;
            }
        }

        function getForecast(area, forecastType) {
            var forecastString = null;

            if (area.hasOwnProperty("regionId")) {
                forecastString = area["avalancheWarningForecast"];
            } else {
                forecastString = area[forecastType + "WarningForecast"];
            }

            if (forecastString) {
                return JSON.parse(forecastString);
            }
        }

        function setAreas(areas, areaType, parentId) {
            if (parentId) {
                storage[areaType + parentId] = areas;
            } else {
                storage[areaType] = areas;
            }
        }

        function getAreas(areaType, parentId) {
            if (parentId) {
                return storage[areaType + parentId];
            } else {
                return storage[areaType];
            }
        }

        function getHighestForecast(forecast1, forecast2) {
            var highestForecast = [];

            forecast1 = forecast1 ? forecast1 : [{ActivityLevel: 0}, {ActivityLevel: 0}, {ActivityLevel: 0}];
            forecast2 = forecast2 ? forecast2 : [{ActivityLevel: 0}, {ActivityLevel: 0}, {ActivityLevel: 0}];

            for (var i = 0; i < 3; i++) {
                if (forecast1[i].ActivityLevel > forecast2[i].ActivityLevel) {
                    highestForecast.push(forecast1[i]);
                } else {
                    highestForecast.push(forecast2[i]);
                }
            }

            return highestForecast;
        }

        function transformAreas(areas) {
            angular.forEach(areas, function (area) {
                if (isRegion(area)) {
                    area.forecast = getForecast(area);
                } else {
                    var floodForecastNo = getForecast(area, "flood").no;
                    var landslideForecastNo = getForecast(area, "landslide").no;

                    area.forecast = {
                        no: getHighestForecast(floodForecastNo, landslideForecastNo)
                    }
                }
            });
        }

        function loadAreas(areaType, parentId) {
            var query = {};
            var options = {};

            if (parentId && areaType == "municipalities") {
                query.countyId = parentId;
            }

            if (areaType == "counties") {
                options.order = "-countyId";
            } else if (areaType == "municipalities") {
                options.order = "name";
            } else if (areaType == "regions") {
                options.order = 'sortOrder';
            }
            console.log("AreaProvider: Loading areas ", areaType, query, options);
            return appstax.find(areaType, query, options).then(function (areas) {
                console.log("AreaProvider: Loaded areas ", areas);
                transformAreas(areas);
                console.log("AreaProvider: Transformed areas ", areas);
                setAreas(areas, areaType, parentId);
                return getAreas(areas, areaType, parentId);
            });
        }

        this.setAppKey = function (appKey) {
            appstax.init(appKey);
        };

        var storage = {};

        this.$get = function ($q, $rootScope) {
            return {
                getAreas: function (areaType, parentId) {
                    if (parentId && areaType !== "municipalities") {
                        console.error("Area Service: Only municipalities can have parent id");
                        parentId = undefined;
                    }

                    if (!getAreas(areaType, parentId)) {
                        return loadAreas(areaType, parentId).then(function () {
                            var args = {areaType: areaType, parentId: parentId};
                            console.log("AreaProvider: areas.initiated", args);
                            $rootScope.$broadcast("areas.initiated", args);
                            return getAreas(areaType, parentId);
                        });
                    } else {
                        return $q.when(getAreas(areaType, parentId));
                    }
                },
                refreshAreas: function (areaType, parentId) {
                    return loadAreas(areaType, parentId).then(function () {
                        var args = {areaType: areaType, parentId: parentId};
                        console.log("AreaProvider: areas.refreshed", args);
                        $rootScope.$broadcast("areas.refreshed", args);
                        return getAreas(areaType, parentId);
                    });
                },
                isCounty: isCounty,
                isMunicipality: isMunicipality,
                isRegion: isRegion,
                getId: getId
            };
        }
    });