angular
    .module('Varsom')
    .controller('AreasMainCtrl', function ($scope, $state, $ionicLoading, $stateParams, Area, areas, $http, AppSettings) {

        var vm = this;
        vm.areas = areas;
        vm.titleKey = ($stateParams.areaType == "regions") ? "avalanche" : "landslide-flood";
        vm.hasMap = !$stateParams.parentId;

        vm.goToArea = function (area) {

            if (Area.isCounty(area)) {
                $state.go('app.areas', {areaType: "municipalities", parentId: Area.getId(area)});
            }

            if (Area.isMunicipality(area)) {
                $state.go('app.municipality', {areaId: Area.getId(area)});
            }

            if (Area.isRegion(area)) {
                $state.go('app.region', {areaId: Area.getId(area)});
            }
        };

        vm.pullToRefresh = function () {
            Area.refreshAreas($stateParams.areaType, $stateParams.parentId).then(function (ares) {
                vm.areas = areas;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        // MAP

        vm.map = {
            fullscreen: false,
            center: {
                lat: 64.871,
                lng: 16.949,
                zoom: 4
            },
            defaults: {
                zoomControl: false,
                attributionControl: false
            },
            tiles: {
                url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
            },
        }

        if (vm.hasMap) {
            $http.get("/geojson/" + $stateParams.areaType + ".geojson").success(function (data, status) {

                vm.map.geojson = {
                    data: data,
                    style: function (feature) {
                        var areaId = null;
                        if (feature.properties.hasOwnProperty("fylkesnr")) {
                            areaId = feature.properties.fylkesnr;
                        } else if (feature.properties.hasOwnProperty("omraadeid")) {
                            areaId = feature.properties.omraadeid;
                        }

                        var area = Area.getArea($stateParams.areaType, areaId);

                        return AppSettings.hazardRatingStyles[area.highestLevel];
                    }
                };
            });
        }

        $scope.$watch("vm.map.selectedArea", function (newValue) {
            if (newValue) {
                vm.map.fullscreen = true;
            } else {
                vm.map.fullscreen = false;
            }
        });

        $scope.$watch("vm.map.fullscreen", function (newValue) {
            if (newValue) {
                vm.map.height = "100%";
            } else {
                vm.map.height = "200px";
            }
        });

        $scope.$on("leafletDirectiveGeoJson.click", function (ev, leafletPayload) {

            var areaId = null;

            if (leafletPayload.model.hasOwnProperty("properties")) {

                if (leafletPayload.model.properties.hasOwnProperty("fylkesnr")) {
                    areaId = leafletPayload.model.properties.fylkesnr;
                } else if (leafletPayload.model.properties.hasOwnProperty("omraadeid")) {
                    areaId = leafletPayload.model.properties.omraadeid;
                }
            }

            Area.fetchArea($stateParams.areaType, areaId).then(function (area) {
                console.log("AreasMapCtrl: area selected ", area);
                vm.map.selectedArea = area;
            });
        });

        $scope.$on("leafletDirectiveMap.click", function (ev, leafletPayload) {

            if (!leafletPayload.model.hasOwnProperty("properties")) {
                if (vm.map.selectedArea) {
                    vm.map.selectedArea = null;
                } else {
                    vm.map.fullscreen = !vm.map.fullscreen;
                }
            }
        });

    });