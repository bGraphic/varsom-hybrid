angular
    .module('Varsom')
    .controller('AvalancheRegionsCtrl', function AvalancheRegionsCtrl($scope, $state, $http, $q, $ionicLoading, Localization, LocalStorage, AppSettings, AvalancheRegion) {
        var vm = this;

        $ionicLoading.show();

        $scope.$on('leafletMap.loaded', function (event, map) {

            AvalancheRegion.allRegions.$promise.then(function (counties) {

                counties.results.forEach(function (region) {
                    $http.get(region.geoJSONmin.url,{cache:true}).then(function (geojson) {
                        L.geoJson(geojson.data, {
                            onEachFeature: onEachFeature
                        }).addTo(map);
                    });

                    function onEachFeature(feature, layer) {

                        layer.setStyle(AppSettings.hazardRatingStyles[region.maxLevel]);
                        // console.log(layer.getBounds().contains());

                        layer.on('click', function (event) {
                            event.originalEvent.preventDefault();
                            console.log(event);
                            console.log('Clicked Avalanche region ' + region.name);
                            $state.go('app.avalanchemap', {region: region, feature: feature, latlng: event.latlng});
                        });

                    }
                });

            });
        });

        $scope.$on('$ionicView.loaded', function() {

            AppSettings.setDefaultView('/app/avalancheregions');

            vm.hazardRatingStyles = AppSettings.hazardRatingStyles;

            vm.regions = AvalancheRegion.allRegions;

            //Hide loading when promise is resolved
            vm.regions.$promise.then(function(){
                $ionicLoading.hide();
            });

            vm.pullToRefresh = function(){
                AvalancheRegion.refreshAllRegions()
                    .then(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }


        });
    });