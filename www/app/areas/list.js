angular
    .module('Varsom')
    .controller('AreasListCtrl', function ($scope, $stateParams, $ionicLoading, Area, Utility, areas) {

        function updateForecasts(areas) {
            angular.forEach(areas, function (area) {
                if (Area.isRegion(area)) {
                    area.forecast = Area.getForecast(area);
                } else {
                    var floodForecast = Utility.chooseLanguage(Area.getForecast(area, "flood"));
                    var landslideForecast = Utility.chooseLanguage(Area.getForecast(area, "landslide"));

                    floodForecast = floodForecast ? floodForecast : [{ActivityLevel: 0}, {ActivityLevel: 0}, {ActivityLevel: 0}];
                    landslideForecast = landslideForecast ? landslideForecast : [{ActivityLevel: 0}, {ActivityLevel: 0}, {ActivityLevel: 0}];

                    area.forecast = [];

                    for (var i = 0; i < 3; i++) {
                        if (floodForecast[i].ActivityLevel > landslideForecast[i].ActivityLevel) {
                            area.forecast.push(floodForecast[i]);
                        } else {
                            area.forecast.push(landslideForecast[i]);
                        }
                    }

                }
            });
        }

        var vm = this;

        vm.areas = areas;

        $scope.$on("areas.refreshed", function (event, args) {
            console.log("AreasListCtrl: areas.refreshed ", event, args);
            Area.getAreas($stateParams.areaType, $stateParams.parentId).then(function (areas) {
                vm.areas = areas;
                updateForecasts(vm.areas);
            });
        });

        $scope.$watch(vm.areas, function () {
            console.log("AreasListCtrl: changes to vm.areas");
            updateForecasts(vm.areas);
        });
    });