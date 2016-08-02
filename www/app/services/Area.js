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
            console.log("Storage", storage);
            if (parentId) {
                return storage[areaType + parentId];
            } else {
                console.log("Returning storage " + areaType, storage[areaType]);
                return storage[areaType];
            }
        }

        function loadAreas(areaType, parentId) {
            var options = {};

            if (parentId && areaType == "municipalities") {
                options = {
                    countyId: parentId
                }
            }

            return appstax.findAll(areaType, options).then(function (areas) {
                console.log("Loaded Areas: ", areas)
                setAreas(areas, areaType, parentId);
                return getAreas(areaType, parentId);
            });
        }

        this.setAppKey = function (appKey) {
            console.log("Setting app key ", appKey);
            appstax.init(appKey);
            console.log("Appstax ", appstax);
        };

        var storage = {};

        this.$get = function ($q) {
            return {
                getAreas: function (areaType, parentId) {
                    if (parentId && areaType !== "municipalities") {
                        console.error("Area Service: Only municipalities can have parent id");
                        parentId = undefined;
                    }

                    if (!getAreas(areaType, parentId)) {
                        console.log("load areas");
                        return loadAreas(areaType, parentId);
                    } else {
                        console.log("get areas directly ", getAreas(areaType, parentId));
                        var defer;
                        defer = $q.defer();
                        defer.resolve(getAreas(areaType, parentId));
                        return defer.promise;
                    }
                },
                isCounty: function (area) {
                    if (area.hasOwnProperty('countyId') && !area.hasOwnProperty('municipalityId')) {
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
                }
            };
        }
    });