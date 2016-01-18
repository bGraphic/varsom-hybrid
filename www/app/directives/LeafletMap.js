/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .directive('leafletMap', function LeafletMap($http, $timeout, AppSettings) {
        function link(scope, elem, attrs) {
            var options = scope.leafletMap;
            var chosenLayer = undefined;
            console.log(options);
            var small = true;
            var styles = AppSettings.hazardRatingStyles;
            var el;


            var map, layer;

            /*
            if (options.small) {
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                //if (map.tap) map.tap.disable();
            } else {
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
                if (map.tap) map.tap.enable();
            }*/






            scope.$emit('leafletMap.loaded', map);

            scope.$on('$destroy', function() {
                map.remove();
            });

            scope.$applyAsync(function(){

                el = document.getElementById(scope.leafletId);

                map = L.map(el, {
                    center: [64.871, 16.949],
                    zoom: 4,
                    zoomControl:false,
                    attributionControl: false
                });
                layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png');
                //var geoLayer = L.geoJson()

                setSize(small);

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



            var regionClicked = function (event, region, layer) {

                if(event) {
                    event.originalEvent.preventDefault();
                    //event.originalEvent.preventBubble();

                }

                if(small){
                    small = !small;
                    scope.vm.showList = !scope.vm.showList;
                    //map.setView(event.latlng, 6, {animate:true});
                    setSize(small);
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
            };

            var clickOutside = function (event) {
                console.log('Click outside', event);


                //Hack to make this get called in the next tick, as the function fires before regionClicked
                $timeout(function(){
                    if(!event.originalEvent.isDefaultPrevented()) {
                        scope.vm.showList = !scope.vm.showList;
                        small = !small;

                        setSize(small);


                        scope.showMapInfo = false;
                        if(chosenLayer)
                            chosenLayer.setStyle(styles[scope.vm.chosenRegion.maxLevel]);
                    }
                });

            };

            function setSize(small){
                var elem = angular.element(el);

                if (small) {
                    elem.css('position', 'static');
                    elem.css('height', '200px');
                } else {
                    elem.css('position', 'absolute');
                    elem.css('top', '0');
                    elem.css('bottom', '0');
                    elem.css('left', '0');
                    elem.css('right', '0');
                    elem.css('height', '100%');
                    elem.css('z-index', '90');
                }

                //$ionicScrollDelegate.resize();
                map.invalidateSize(true);
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