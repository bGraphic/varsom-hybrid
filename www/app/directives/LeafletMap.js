/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .directive('leafletMap', function LeafletMap(County, AppSettings, $http, $state, $timeout) {


        function link(scope, elem, attrs) {
            var options = scope.leafletMap;
            if (options.small)
                elem.css('height', '200px');
            else
                elem.css('height', '100%');

            var styles = AppSettings.warningStyles;
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

            County.listAll().then(function (counties) {

                counties.forEach(function (county) {
                    county.fetchGeoJson().then(function (geojson) {
                        L.geoJson(geojson, {
                            onEachFeature: onEachFeature
                        }).addTo(map);
                    });

                    function onEachFeature(feature, layer) {
                        layer.setStyle(styles[county.maxLevel]);
                        if(!options.small){
                            layer.on('click', function (event) {
                                $state.go('county', {county: county});
                                layer.setStyle(styles.clicked);

                                $timeout(function () {
                                    layer.setStyle(styles[county.maxLevel]);
                                }, 500);
                            });
                        }
                    }
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