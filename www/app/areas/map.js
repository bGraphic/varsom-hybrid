angular
    .module('Varsom')
    .controller('AreasMapCtrl', function ($scope, $stateParams, $ionicLoading, Area, Utility, areas) {

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


        $scope.$on("areas.refreshed", function (event, args) {
            console.log("AreasMapCtrl: areas.refreshed ", args);
            Area.getAreas($stateParams.areaType, $stateParams.parentId).then(function (areas) {
                vm.areas = areas;
            });
        });
    });