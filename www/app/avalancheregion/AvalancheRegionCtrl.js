/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('AvalancheRegionCtrl', function AvalancheRegionCtrl($scope, $location, $ionicScrollDelegate, $ionicLoading, $stateParams, Utility) {
        var vm = this;
        vm.region = $stateParams.region;
        vm.days = [];

        var init = function () {
            vm.region= $stateParams.region;
            vm.avalancheForecast = Utility.chooseLanguage(vm.region.avalancheWarningForecast);

            vm.days.push(new Date(vm.avalancheForecast[0].ValidFrom));
            vm.days.push(new Date(vm.avalancheForecast[1].ValidFrom));
            vm.days.push(new Date(vm.avalancheForecast[2].ValidFrom));
            console.log(vm.avalancheForecast);
        };

        vm.printCauseList = Utility.printCauseList;

        vm.scrollTo = function(id){
            $location.hash(vm.region.regionId + id);
            $ionicScrollDelegate.anchorScroll(true);
        };


        $scope.$on('$ionicView.loaded', function() {
            if($stateParams.region){

                init();
            }
        });


    });