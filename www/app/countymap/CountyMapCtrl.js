/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyMapCtrl', function CountyMapCtrl($scope, $ionicLoading, AppSettings) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            vm.countyClicked = function (event, county) {
                vm.chosenCounty = county;
                vm.chosenCountyClass = AppSettings.hazardRatingStyles[county.maxLevel].className;
                vm.showMapInfo = true;
            };

            vm.clickOutside = function () {
                vm.showMapInfo = false;
            };
        });

    });