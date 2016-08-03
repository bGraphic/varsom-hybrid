angular
    .module('Varsom')
    .controller('AreasMapCtrl', function ($scope, $stateParams, $state, $ionicLoading, $http, Area, Utility, areas) {

        function hideList() {
            vm.height = "100%";
        }

        function showList() {
            vm.height = "200px";
        }

        function findArea(areaId) {
            return Area.getAreas($stateParams.areaType).then(function (areas) {
                var foundArea = null;
                angular.forEach(areas, function (area) {
                    if (Area.getId(area) == areaId) {
                        foundArea = area;
                    }
                });
                return foundArea;
            });
        }

        var vm = this;

        vm.areas = areas;

        vm.fullscreen = false;

        vm.center = {
            lat: 64.871,
            lng: 16.949,
            zoom: 4
        }
        vm.defaults = {
            zoomControl: false,
            attributionControl: false
        }
        vm.tiles = {
            url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
        }

        $http.get("/geojson/" + $stateParams.areaType + ".geojson").success(function (data, status) {

            vm.geojson = {
                data: data
            };
        });

        $scope.$watch("mapVm.selectedArea", function (newValue) {
            if (newValue) {
                vm.fullscreen = true;
            } else {
                vm.fullscreen = false;
            }
        });

        $scope.$watch("mapVm.fullscreen", function (newValue) {
            if (newValue) {
                vm.height = "100%";
            } else {
                vm.height = "200px";
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

            findArea(areaId).then(function (area) {
                console.log("AreasMapCtrl: area selected ", area);
                vm.selectedArea = area;
            });
        });

        $scope.$on("leafletDirectiveMap.click", function (ev, leafletPayload) {

            if (!leafletPayload.model.hasOwnProperty("properties")) {
                if (vm.selectedArea) {
                    vm.selectedArea = null;
                } else {
                    vm.fullscreen = !vm.fullscreen;
                }
            }
        });

        $scope.$on("areas.refreshed", function (event, args) {
            console.log("AreasMapCtrl: areas.refreshed ", args);
            Area.getAreas($stateParams.areaType, $stateParams.parentId).then(function (areas) {
                vm.areas = areas;
            });
        });
    });