/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('MunicipalityCtrl', function MunicipalityCtrl($scope, $ionicLoading, $stateParams, AppSettings, Municipality) {
        var vm = this;
        vm.mun = $stateParams.municipality;

        var init = function () {
            vm.mun = $stateParams.municipality;
            console.log(vm.mun);

            var floodForecast = vm.mun.FloodWarningForecast;
            var floodLength = floodForecast.length;
            var days = [];

            for(var i = 0; i < floodLength; i++){
                //Get day
                var floodDate = new Date(floodForecast[i].validTo.iso);
                days.push(floodDate.getDay());

            }

            vm.days = days;
            vm.locale = AppSettings.getLocale().value;

        };


        $scope.$on('$ionicView.loaded', function() {
            if($stateParams.municipality){

                init();
            }
        });


    });