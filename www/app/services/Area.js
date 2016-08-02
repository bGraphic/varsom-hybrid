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
                setAreas(areas, areaType, parentId);
                return getAreas(areaType, parentId);
            });
        }

        this.setAppKey = function (appKey) {
            appstax.init(appKey);
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
                        return loadAreas(areaType, parentId);
                    } else {
                        var defer;
                        defer = $q.defer();
                        return $q.when(getAreas(areaType, parentId));
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