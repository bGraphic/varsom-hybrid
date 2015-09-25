/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('MapCtrl', function MapCtrl($scope, $ionicLoading, AppSettings) {
        var model = this;
/*        $scope.$on('$ionicView.afterEnter', function () {

            $ionicLoading.hide();
        });*/



        model.countyClicked = function (event, county) {
            model.chosenCounty = county;
            model.chosenCountyClass = AppSettings.hazardRatingStyles[county.maxLevel].className;
            model.showMapInfo = true;
        };

        model.clickOutside = function () {
            model.showMapInfo = false;
        };

    });