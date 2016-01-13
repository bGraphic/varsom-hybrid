
angular
    .module('Varsom')
    .controller('CountiesCtrl', function CountiesCtrl($scope, $http, $q, $state, $ionicLoading, Localization, AppSettings, County) {
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

                        layer.on('click', function (event) {
                            event.originalEvent.preventDefault();
                            console.log(event);
                            console.log('Clicked COUNTY!! ' + county.name);
                            $state.go('app.countymap', {county: county, feature: feature, latlng: event.latlng});
                        });

                    }
                });

            });
        });

        $scope.$on('$ionicView.loaded', function() {

            AppSettings.setDefaultView('/app/counties');

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

        function countyClicked(event, county, feature){

        }


    });