/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('AvalancheMapCtrl', function AvalancheMapCtrl($scope, $http, $ionicSideMenuDelegate, $timeout, $ionicLoading, AvalancheRegion, AppSettings) {
        var vm = this;
        var chosenLayer = undefined;

        $scope.$on('leafletMap.loaded', function (event, map) {

            AvalancheRegion.allRegions.$promise.then(function (region) {

                region.results.forEach(function (region) {
                    $http.get(region.geoJSONmin.url,{cache:true}).then(function (geojson) {
                        L.geoJson(geojson.data, {
                            onEachFeature: onEachFeature
                        }).addTo(map);
                    });

                    function onEachFeature(feature, layer) {

                        layer.setStyle(AppSettings.hazardRatingStyles[region.maxLevel]);
                        // console.log(layer.getBounds().contains());

                        layer.on('click', function (event) {
                            //$state.go('region', {region: region, regionId: region.regionId});
                            console.log(event);

                            vm.regionClicked(event, region, layer);
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

            vm.regionClicked = function (event, region, layer) {

                event.originalEvent.preventDefault();
                if(chosenLayer) {
                    chosenLayer.setStyle(styles[vm.chosenRegion.maxLevel]);
                }
                chosenLayer = layer;
                chosenLayer.setStyle(styles.clicked);

                console.log(region);
                vm.chosenRegion = region;
                vm.chosenRegionClass = styles[region.maxLevel].className;
                vm.showMapInfo = true;
            };

            vm.clickOutside = function (event) {
                console.log('Click outside', event);

                //Hack to make this get called in the next tick, as the function fires before regionClicked
                $timeout(function(){
                    if(!event.isDefaultPrevented()) {
                        vm.showMapInfo = false;
                        if(chosenLayer) chosenLayer.setStyle(styles[vm.chosenRegion.maxLevel]);
                    }
                });

            };
        });

    });