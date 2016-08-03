angular
    .module('Varsom')
    .provider('Area', function () {

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
                setAreas(areas, areaType, parentId);
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
                            $rootScope.$broadcast("areas.initiated", args);
                            console.log("AreaProvider: area.areas.initiated", args);
                            return getAreas(areaType, parentId);
                        });
                    } else {
                        var defer;
                        defer = $q.defer();
                        return $q.when(getAreas(areaType, parentId));
                    }
                },
                refreshAreas: function (areaType, parentId) {
                    return loadAreas(areaType, parentId).then(function () {
                        var args = {areaType: areaType, parentId: parentId};
                        $rootScope.$broadcast("areas.refreshed", args);
                        console.log("AreaProvider: area.areas.refreshed", args);
                        return getAreas(areaType, parentId);
                    });
                },
                isCounty: function (area) {
                    if (area.hasOwnProperty('countyId') && !area.hasOwnProperty('municipalityId')) {
                        return true;
                    } else {
                        return false;
                    }
                },
                isMunicipality: function (area) {
                    if (area.hasOwnProperty('municipalityId')) {
                        return true;
                    } else {
                        return false;
                    }
                },
                isRegion: function (area) {
                    if (area.hasOwnProperty('regionId')) {
                        return true;
                    } else {
                        return false;
                    }
                },
                getId: function (area) {
                    if (area.hasOwnProperty('municipalityId')) {
                        return area.municipalityId;
                    }

                    if (area.hasOwnProperty('countyId')) {
                        return area.countyId;
                    }

                    if (area.hasOwnProperty('regionId')) {
                        return area.regionId;
                    }
                },
                getForecast: function (area, forecastType) {
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
            };
        }
    });