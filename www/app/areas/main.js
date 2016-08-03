angular
    .module('Varsom')
    .controller('AreasMainCtrl', function ($scope, $state, $ionicLoading, $stateParams, Area) {

        var vm = this;

        if ($stateParams.areaType == "regions") {
            vm.titleKey = "avalanche";
        } else {
            vm.titleKey = "landslide-flood";
        }

        vm.goToArea = function (area) {

            if (Area.isCounty(area)) {
                $state.go('app.areas.main', {areaType: "municipalities", parentId: Area.getId(area)});
            }

            if (Area.isMunicipality(area)) {
                //TODO: Add state transistion for selected municipality
            }

            if (Area.isRegion(area)) {
                //TODO: Add state transistion for selected region
            }

        };

        vm.pullToRefresh = function () {
            Area.refreshAreas($stateParams.areaType, $stateParams.parentId).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

    });