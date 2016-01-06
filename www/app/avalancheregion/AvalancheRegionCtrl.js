/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('AvalancheRegionCtrl', function AvalancheRegionCtrl($scope, $ionicLoading, $stateParams, AvalancheRegion, Localization) {
        var vm = this;
        vm.region = $stateParams.region;

        var init = function () {
            vm.region= $stateParams.region;
            console.log(vm.region);
        };


        $scope.$on('$ionicView.loaded', function() {
            if($stateParams.region){

                init();
            }
        });


    });