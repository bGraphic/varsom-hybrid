angular
    .module('Varsom')
    .provider('Area', function () {

        function getId(area) {
            if (area.hasOwnProperty('countyId')) {
                return area.countyId;
            }

            if (area.hasOwnProperty('regionId')) {
                return area.regionId;
            }

            if (area.hasOwnProperty('municipalityId')) {
                return area.municipalityId;
            }
        }

        function loadAreas(areaType, parent) {
            return appstax.findAll(areaType).then(function (areas) {
                storage[areaType] = areas;
                console.log("Loaded areas of type " + areaType + ": ", areas);
                return storage[areaType];
            });
        }

        function getAreas(areaType, parent) {
            if (storage[areaType].length == 0) {
                return loadAreas(areaType, parent);
            } else {
                return storage[areaType];
            }
        }

        this.setAppKey = function (appKey) {
            console.log("Setting app key ", appKey);
            appstax.init(appKey);
            console.log("Appstax ", appstax);
        };

        var storage = {
            counties: [],
            municipalities: [],
            regions: []
        }

        this.$get = function () {
            return {
                getCounties: function () {
                    return getAreas('counties');
                },
                getMunicipalitiesForCounty: function (county) {
                    return getAreas('municipalities', county);
                },
                getRegions: function () {
                    return getAreas('regions');
                }
            };
        }
    });