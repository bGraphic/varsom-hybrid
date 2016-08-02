angular
    .module('Varsom')
    .controller('AreasMainCtrl', function ($scope, $state, $ionicLoading, Area) {

        this.goToArea = function (area) {

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

    });