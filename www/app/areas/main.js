angular
    .module('Varsom')
    .controller('AreasMainCtrl', function ($scope, $state, $ionicLoading, Area) {

        this.goToArea = function (area) {

            if (Area.isCounty(area)) {
                $state.go('app.areas.main', {areaType: "municipalities", parentId: Area.getId(area)});
            }

        };

    });