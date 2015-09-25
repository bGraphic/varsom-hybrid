/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .directive('leafletMap', function LeafletMap(County, AppSettings, $http, $state, $timeout) {
        function link(scope, elem, attrs) {
            var options = scope.leafletMap;
            console.log(options);
            if (options.small)
                elem.css('height', '200px');
            else
                elem.css('height', '100%');

            var styles = AppSettings.hazardRatingStyles;
            var map = L.map(elem[0], {
                center: [64.871, 16.949],
                zoom: 4,
                zoomControl:false,
                attributionControl: false
            });
            var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png');

            map.addLayer(layer);

            if (options.small) {
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                if (map.tap) map.tap.disable();
            } else {
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
                if (map.tap) map.tap.enable();
            }
            if (options.userPos) {
                console.log(options.userPos);
                map.locate({setView: true, maxZoom: 7});
                map.on('locationfound', onLocationFound);
            }

            County.allCounties.$promise.then(function (counties) {
                console.log('Snizzle', counties);

                counties.results.forEach(function (county) {
                    $http.get(county.geoJSONmin.url,{cache:true}).then(function (geojson) {
                        L.geoJson(geojson.data, {
                            onEachFeature: onEachFeature
                        }).addTo(map);
                    });

                    function onEachFeature(feature, layer) {
                        layer.setStyle(styles[county.maxLevel]);

                        if(!options.small){
                            layer.on('click', function (event) {
                                //$state.go('county', {county: county, countyId: county.countyId});
                                layer.setStyle(styles.clicked);
                                $timeout(function () {
                                    layer.setStyle(styles[county.maxLevel]);
                                }, 100);
                                scope.clickHandler({event: event, county: county});
                            });
                        } else {
                            layer.on('click', function (event) {
                                $state.go('app.map');
                            });
                        }
                    }
                });
            });

            scope.$on('$destroy', function() {
                map.remove();
            });

            function onLocationFound(e) {
                var radius = e.accuracy / 2;

                /*L.marker(e.latlng).addTo(map)
                 .bindPopup("You are within " + radius + " meters from this point").openPopup();*/

                L.circle(e.latlng, radius).addTo(map);
            }
        }

        return {
            restrict: 'A',
            link: link,
            scope: {
                leafletMap: '=',
                clickHandler: '&'
            }
        };

    });