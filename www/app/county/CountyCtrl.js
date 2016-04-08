/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyCtrl', function CountyCtrl($scope, $ionicLoading, $stateParams, County, Municipality, Utility) {
        var vm = this;
        vm.county = $stateParams.county;
        $ionicLoading.show();


        var init = function () {
            vm.municipalities = Municipality.listAllForCounty(vm.county.countyId);
            console.log('MUN', vm.municipalities);
            console.log('COUNTY', vm.county);
            vm.days = Utility.getDays(vm.county.floodWarningForecast);
            vm.util = Utility;
           /* Municipality.listAll(model.county.countyId).then(function (municipalities) {
                model.municipalities = municipalities;
                //$ionicLoading.hide();
            });*/
            vm.municipalities.$promise.then(function(){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });

        };

        $scope.$on('$ionicView.loaded', function() {

            vm.clickMap = function (event, county, layer) {
                event.originalEvent.preventDefault();


            };

            vm.pullToRefresh = function () {
                init();
                County.getById($stateParams.countyId).$promise.then(function(data){
                    vm.county = data.results[0];
                    vm.days = Utility.getDays(vm.county.floodWarningForecast);
                });
            };

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