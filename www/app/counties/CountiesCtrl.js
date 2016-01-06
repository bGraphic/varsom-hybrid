
angular
    .module('Varsom')
    .controller('CountiesCtrl', function CountiesCtrl($scope, $http, $q, $ionicLoading, Localization, AppSettings, County) {
        var vm = this;

        $ionicLoading.show();

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



                    }
                });

            });
        });

        $scope.$on('$ionicView.loaded', function() {

            vm.hazardRatingStyles = AppSettings.hazardRatingStyles;

            vm.counties = County.allCounties;

            //Hide loading when promise is resolved
            vm.counties.$promise.then(function(){
                $ionicLoading.hide();
            });

            vm.pullToRefresh = function(){
                County.refreshAllCounties()
                    .then(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }


        });


    });