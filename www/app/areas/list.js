angular
    .module('Varsom')
    .controller('AreasListCtrl', function ($scope, $stateParams, $ionicLoading, Area, Utility, areas) {

        var vm = this;
        vm.areas = areas;

        $scope.$on("areas.refreshed", function (event, args) {
            console.log("AreasListCtrl: areas.refreshed ", event, args);
            Area.getAreas($stateParams.areaType, $stateParams.parentId).then(function (areas) {
                vm.areas = areas;
            });
        });
    });