/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyCtrl', function CountyCtrl($scope, $ionicLoading, $stateParams, County, Municipality, Localization) {
        var vm = this;
        vm.county = $stateParams.county;
        $ionicLoading.show();


        var init = function () {
            vm.municipalities = Municipality.listAllForCounty(vm.county.countyId);
            console.log('MUN', vm.municipalities);
            console.log(vm.county);
           /* Municipality.listAll(model.county.countyId).then(function (municipalities) {
                model.municipalities = municipalities;
                //$ionicLoading.hide();
            });*/
            $ionicLoading.hide();


        };

        $scope.$on('$ionicView.loaded', function() {

            if($stateParams.county){
                vm.county = $stateParams.county;
                init();
            } else {
                County.getById($stateParams.countyId).$promise.then(function(data){
                    vm.county = data.results[0];
                    init();
                });
            }
        });




        //$scope.county = $stateParams.county;
       // console.log(model.county.get('countyId'));
    });