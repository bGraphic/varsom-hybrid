angular
    .module('Varsom')
    .controller('AvalancheRegionsCtrl', function AvalancheRegionsCtrl($scope, $timeout, $state, $http, $q, $ionicLoading, Localization, LocalStorage, AppSettings, AvalancheRegion) {
        var vm = this;


        $ionicLoading.show();


        $scope.$on('$ionicView.loaded', function() {

            AppSettings.setDefaultView('/app/avalancheregions');

            //Hide loading when promise is resolved
            AvalancheRegion.allRegions.$promise.then(function(){
                $ionicLoading.hide();
            });

            vm.regions = AvalancheRegion.allRegions;


            vm.pullToRefresh = function(){
                AvalancheRegion.refreshAllRegions()
                    .then(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }

        });
    });