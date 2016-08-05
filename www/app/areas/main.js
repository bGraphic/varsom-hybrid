angular
    .module('Varsom')
    .controller('AreasMainCtrl', function ($scope, $state, $ionicLoading, $stateParams, Area, areas, $http) {

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
        vm.titleKey = ($stateParams.areaType == "regions") ? "avalanche" : "landslide-flood";
        vm.hasMap = !$stateParams.parentId;

        vm.goToArea = function (area) {

            if (Area.isCounty(area)) {
                $state.go('app.areas', {areaType: "municipalities", parentId: Area.getId(area)});
            }

            if (Area.isMunicipality(area)) {
                // TODO: Create transition
            }

            if (Area.isRegion(area)) {
                // TODO: Create transition
            }
        };

        vm.pullToRefresh = function () {
            Area.refreshAreas($stateParams.areaType, $stateParams.parentId).then(function () {
                vm.areas = Area.getAreas($stateParams.areaType, $stateParams.parentId);
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

        $http.get("/geojson/" + $stateParams.areaType + ".geojson").success(function (data, status) {

            vm.map.geojson = {
                data: data
            };
        });

        $scope.$watch("mainVm.map.selectedArea", function (newValue) {
            if (newValue) {
                vm.map.fullscreen = true;
            } else {
                vm.map.fullscreen = false;
            }
        });

        $scope.$watch("mainVm.map.fullscreen", function (newValue) {
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

            findArea(areaId).then(function (area) {
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