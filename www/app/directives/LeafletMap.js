/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .directive('leafletMap', function LeafletMap($http, $timeout, AppSettings) {
        function link(scope, elem, attrs) {
            var chosenLayer, el, map, layer;
            var small = true;
            var styles = AppSettings.hazardRatingStyles;

            scope.$applyAsync(function(){

                el = document.getElementById(scope.leafletId);
                angular.element(el).css('z-index', '1');

                map = L.map(el, {
                    center: [64.871, 16.949],
                    zoom: 4,
                    zoomControl:false,
                    attributionControl: false
                });
                layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png');
                //var geoLayer = L.geoJson()

                scope.regions.$promise.then(function (regions) {

                    regions.results.forEach(function (region) {
                        $http.get(region.geoJSONmin.url,{cache:true}).then(function (geojson) {
                            L.geoJson(geojson.data, {
                                onEachFeature: onEachFeature
                            }).addTo(map);
                        });

                        function onEachFeature(feature, layer) {

                            layer.setStyle(styles[region.maxLevel]);
                            // console.log(layer.getBounds().contains());

                            layer.on('click', function (event) {
                                regionClicked(event, region, layer);
                                //$state.go('app.avalanchemap', {region: region, feature: feature, latlng: event.latlng});
                            });

                            layer.on('mousedown', function (event) {
                                console.log('Mousing down');
                                layer.setStyle({
                                    fillColor: '#cccccc'
                                });
                                //$state.go('app.avalanchemap', {region: region, feature: feature, latlng: event.latlng});
                            });

                        }
                    });

                });

                map.addLayer(layer);

                map.locate();
                map.on('locationfound', onLocationFound);
                map.on('click', clickOutside);

            });

            scope.$on('$destroy', function() {
                map.remove();
            });

            function regionClicked (event, region, layer) {

                if(event) {
                    event.originalEvent.preventDefault();
                    //event.originalEvent.preventBubble();

                }

                if(small){
                    small = !small;
                    scope.vm.showList = !scope.vm.showList;
                    //map.setView(event.latlng, 6, {animate:true});

                }

                if(chosenLayer) {
                    chosenLayer.setStyle(styles[scope.vm.chosenRegion.maxLevel]);
                }
                chosenLayer = layer;
                chosenLayer.setStyle(styles.clicked);

                console.log(region);
                scope.vm.chosenRegion = region;
                scope.vm.chosenRegionClass = styles[region.maxLevel].className;
                scope.showMapInfo = true;
            }

            function clickOutside (event) {
                console.log('Click outside', event);


                //Hack to make this get called in the next tick, as the function fires before regionClicked
                $timeout(function(){
                    if(!event.originalEvent.isDefaultPrevented()) {
                        scope.vm.showList = !scope.vm.showList;
                        small = !small;

                        scope.showMapInfo = false;
                        if(chosenLayer)
                            chosenLayer.setStyle(styles[scope.vm.chosenRegion.maxLevel]);
                    }
                });

            }

            function onLocationFound(e) {
                //Make sure location is in Norway
                if(e.latitude < 57 || e.longitude < 3 || e.latitude > 72 || e.longitude > 34 )
                    return;

                console.log('Found location',e);
                var radius = e.accuracy / 2;

                /*L.marker(e.latlng).addTo(map)
                 .bindPopup("You are within " + radius + " meters from this point").openPopup();*/

                L.circle(e.latlng, radius).addTo(map);
                map.setView(e.latlng, 6, {animate:true});

            }
        }

        return {
            restrict: 'E',
            link: link,
            transclude: true,
            scope: {
                regions: '=',
                vm:'=',
                leafletId: '@'
            },
            templateUrl: 'app/directives/LeafletMap.html'
        };

    });