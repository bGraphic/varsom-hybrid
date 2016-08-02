angular
    .module('Varsom')
    .controller('AvalancheRegionsCtrl', function AvalancheRegionsCtrl($scope, $ionicLoading, AppSettings, AvalancheRegion, Utility) {
        var vm = this;

        $ionicLoading.show();

        $scope.$on('$ionicView.loaded', function () {

            AppSettings.setDefaultView('/app/avalancheregions');

            //Hide loading when promise is resolved
            AvalancheRegion.allRegions.$promise.then(function () {
                $ionicLoading.hide();
                vm.days = Utility.getDays(vm.regions.results[0].avalancheWarningForecast);
            });

            vm.regions = AvalancheRegion.allRegions;
            vm.util = Utility;


            vm.pullToRefresh = function () {
                AvalancheRegion.refreshAllRegions()
                    .then(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }

        });
    });