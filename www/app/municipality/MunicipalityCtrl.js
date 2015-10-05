/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('MunicipalityCtrl', function MunicipalityCtrl($scope, $ionicLoading, $stateParams, County, Municipality, Localization) {
        var vm = this;
        vm.mun = $stateParams.municipality;

        var init = function () {
            vm.mun = $stateParams.municipality;
            console.log(vm.mun);
        };


        $scope.$on('$ionicView.loaded', function() {
            if($stateParams.municipality){

                init();
            }
        });


    });