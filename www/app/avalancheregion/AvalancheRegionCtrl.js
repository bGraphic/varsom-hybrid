/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('AvalancheRegionCtrl', function AvalancheRegionCtrl($scope, $ionicLoading, $stateParams, Utility, AvalancheRegion, Localization) {
        var vm = this;
        vm.region = $stateParams.region;
        vm.days = [];

        var init = function () {
            vm.region= $stateParams.region;
            vm.avalancheForecast = Utility.chooseLanguage(vm.region.avalancheWarningForecast);

            vm.days.push(new Date(vm.avalancheForecast[0].ValidTo).getDay());
            vm.days.push(new Date(vm.avalancheForecast[1].ValidTo).getDay());
            vm.days.push(new Date(vm.avalancheForecast[2].ValidTo).getDay());
            console.log(vm.avalancheForecast);
        };

        vm.printCauseList = Utility.printCauseList;

        vm.scrollTo = function(id){
            $location.hash(vm.mun.municipalityId + id);
            $ionicScrollDelegate.anchorScroll(true);
        };


        $scope.$on('$ionicView.loaded', function() {
            if($stateParams.region){

                init();
            }
        });


    });