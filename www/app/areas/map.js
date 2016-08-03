angular
    .module('Varsom')
    .controller('AreasMapCtrl', function ($scope, $stateParams, $ionicLoading, $http, Area, Utility, areas) {

        var vm = this;

        vm.areas = areas;

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

            console.log(vm.geojson);
        });

        $scope.$on("areas.refreshed", function (event, args) {
            console.log("AreasMapCtrl: areas.refreshed ", args);
            Area.getAreas($stateParams.areaType, $stateParams.parentId).then(function (areas) {
                vm.areas = areas;
            });
        });
    });