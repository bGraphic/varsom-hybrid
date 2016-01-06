/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyMapCtrl', function CountyMapCtrl($scope, $http, $ionicSideMenuDelegate, $timeout, $ionicLoading, County, AppSettings) {
        var vm = this;
        var chosenLayer = undefined;

        $scope.$on('leafletMap.loaded', function (event, map) {

            County.allCounties.$promise.then(function (counties) {

                counties.results.forEach(function (county) {
                    $http.get(county.geoJSONmin.url,{cache:true}).then(function (geojson) {
                        L.geoJson(geojson.data, {
                            onEachFeature: onEachFeature
                        }).addTo(map);
                    });

                    function onEachFeature(feature, layer) {

                        layer.setStyle(AppSettings.hazardRatingStyles[county.maxLevel]);
                        // console.log(layer.getBounds().contains());

                        layer.on('click', function (event) {
                            //$state.go('county', {county: county, countyId: county.countyId});
                            console.log(event);

                            vm.countyClicked(event, county, layer);
                        });

                    }
                });

            });
        });

        $scope.$on('$ionicView.enter', function () {
            $ionicSideMenuDelegate.canDragContent(false);
        });

        $scope.$on('$ionicView.leave', function () {
            $ionicSideMenuDelegate.canDragContent(true);
        });

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
                        if(chosenLayer) chosenLayer.setStyle(styles[vm.chosenCounty.maxLevel]);
                    }
                });

            };
        });

    });