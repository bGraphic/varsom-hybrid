/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('MunicipalityCtrl', function MunicipalityCtrl($location, $ionicScrollDelegate, $anchorScroll, $scope, $ionicLoading, $stateParams, AppSettings, Municipality, Utility) {
        var vm = this;
        vm.mun = $stateParams.municipality;

        var init = function () {

            console.log(vm.mun);

            vm.floodForecast = Utility.chooseLanguage(vm.mun.floodWarningForecast);
            vm.landslideForecast = Utility.chooseLanguage(vm.mun.landslideWarningForecast);
            var floodLength = vm.floodForecast.length;
            var days = [];
            vm.max = [];

            for(var i = 0; i < floodLength; i++){
                //Get day
                var floodDate = new Date(vm.floodForecast[i].ValidFrom);
                days.push(floodDate);
                vm.max.push(Math.max(vm.floodForecast[i].ActivityLevel,vm.landslideForecast[i].ActivityLevel));

            }

            vm.days = days;
            vm.locale = AppSettings.getLocale().value;

        };

        vm.printCauseList = Utility.printCauseList;

        vm.scrollTo = function(id){
            $location.hash(vm.mun.municipalityId + id);
            $ionicScrollDelegate.anchorScroll(true);
        };

        $scope.$on('$ionicView.loaded', function() {
            if($stateParams.municipality){
                vm.mun = $stateParams.municipality;
                init();
            } else {
                Municipality.getById($stateParams.municipalityId).$promise.then(function(data){
                    vm.mun = data.results[0];
                    init();
                });
            }
        });


    });