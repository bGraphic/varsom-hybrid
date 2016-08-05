/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('MunicipalityCtrl', function MunicipalityCtrl($location, $anchorScroll, municipality) {
        var vm = this;
        vm.mun = municipality;
        vm.floodForecast = vm

        console.log(vm.mun);

        vm.scrollTo = function(id){
            $location.hash(vm.mun.municipalityId + id);
            $ionicScrollDelegate.anchorScroll(true);
        };

    });