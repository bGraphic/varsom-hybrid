/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .directive('leafletMap', function LeafletMap(County, $http, $state, $timeout) {
        var styles = {
            '0': {
                weight: 3,
                color: '#C8C8C8',
                dashArray: '',
                fillOpacity: 0.5
            },
            '1': {
                weight: 3,
                color: '#75B100',
                dashArray: '',
                fillOpacity: 0.5
            },
            '2': {
                weight: 3,
                color: '#FFCC33',
                dashArray: '',
                fillOpacity: 0.5
            },
            '3': {
                weight: 3,
                color: '#E46900',
                dashArray: '',
                fillOpacity: 0.5
            },
            '4': {
                weight: 3,
                color: '#D21523',
                dashArray: '',
                fillOpacity: 0.5
            },
            '5': {
                weight: 3,
                color: '#3E060B',
                dashArray: '',
                fillOpacity: 0.5
            },
            clicked: {
                weight: 3,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.5
            }
        };

        function link(scope, elem, attrs) {
            var options = scope.leafletMap;

            if (options.small)
                elem.css('height', '200px');
            else
                elem.css('height', '100%');

            var map = L.map(elem[0], {
                center: [64.871, 16.949],
                zoom: 4
            });

            var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png');

            map.addLayer(layer);

            if (options.small) {
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                if (map.tap) map.tap.disable();
            }
            if (options.userPos) {
                console.log(options.userPos);
                map.locate({setView: true, maxZoom: 8});
                map.on('locationfound', onLocationFound);
            }

            County.loaded.then(function (counties) {
                counties.forEach(function (county) {
                    $http.get(county.geojson, {cache: true})
                        .success(function (data) {
                            L.geoJson(data, {
                                onEachFeature: function (feature, layer) {
                                    layer.setStyle(styles[county.forecasts.maxLevel]);
                                    layer.on('click', function (event) {
                                        $state.go('county', {county: county});
                                        layer.setStyle(styles.clicked);

                                        $timeout(function () {
                                            layer.setStyle(styles[county.forecasts.maxLevel]);
                                        }, 500);
                                    });
                                }
                            }).addTo(map);
                        });
                });
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
                leafletMap: '='
            }
        };

    });