angular
    .module('Varsom')
    .controller('AvalancheRegionsCtrl', function AvalancheRegionsCtrl($scope, $http, $q, $ionicLoading, Localization, AppSettings, AvalancheRegion) {
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



                    }
                });

            });
        });

        $scope.$on('$ionicView.loaded', function() {

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