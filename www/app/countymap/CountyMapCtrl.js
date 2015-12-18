/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyMapCtrl', function CountyMapCtrl($scope, $timeout, $ionicLoading, AppSettings) {
        var vm = this;
        var chosenLayer = undefined;

        $scope.$on('$ionicView.loaded', function () {
            var styles = AppSettings.hazardRatingStyles;

            vm.countyClicked = function (event, county, layer) {
                event.originalEvent.preventDefault();
                if(chosenLayer) {
                    chosenLayer.setStyle(styles[vm.chosenCounty.maxLevel]);
                }
                chosenLayer = layer;
                chosenLayer.setStyle(styles.clicked);

                console.log(county);
                vm.chosenCounty = county;
                vm.chosenCountyClass = AppSettings.hazardRatingStyles[county.maxLevel].className;
                vm.showMapInfo = true;
            };

            vm.clickOutside = function (event) {
                console.log('Click outside', event);

                //Hack to make this get called in the next tick, as the function fires before countyClicked
                $timeout(function(){
                    if(!event.isDefaultPrevented()) {
                        vm.showMapInfo = false;
                        chosenLayer.setStyle(styles[vm.chosenCounty.maxLevel]);
                    }
                });

            };
        });

    });