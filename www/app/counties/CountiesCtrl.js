
angular
    .module('Varsom')
    .controller('CountiesCtrl', function CountiesCtrl($scope, $http, $q, $state, $ionicLoading, Localization, AppSettings, County, Utility) {
        var vm = this;

        $ionicLoading.show();

        $scope.$on('$ionicView.loaded', function() {

            AppSettings.setDefaultView('/app/counties');

            vm.regions = County.allCounties;

            vm.util = Utility;


            //Hide loading when promise is resolved
            vm.regions.$promise.then(function(){
                console.log(vm.regions);
                vm.days = Utility.getDays(vm.regions.results[0].floodWarningForecast);

                $ionicLoading.hide();
            });

            vm.pullToRefresh = function(){
                County.refreshAllCounties()
                    .then(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            };

            vm.goToCounty = function(county){
                if(county.countyId !== '03'){
                    $state.go('app.county', {county:county, countyId: county.countyId});
                } else {
                    $state.go('app.municipality', {municipalityId: '0301'});
                }
            };


        });


    });