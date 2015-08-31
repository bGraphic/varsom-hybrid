/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .directive('leafletMap', LeafletMap);

    function LeafletMap(County, $http, $state, $timeout){
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elem, attrs){
            elem.css('height', '480px');

            var map = L.map(elem[0], {
                center: [64.871, 16.949],
                zoom: 4
            });

            var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png');

            var styles = {
                '0': {
                    weight: 3,
                    color: '#C8C8C8',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '1': {
                    weight: 3,
                    color: '#75B100',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '2': {
                    weight: 3,
                    color: '#FFCC33',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '3': {
                    weight: 3,
                    color: '#E46900',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '4': {
                    weight: 3,
                    color: '#D21523',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '5': {
                    weight: 3,
                    color: '#3E060B',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                clicked: {
                    weight: 3,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                }
            };

            map.addLayer(layer);

            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            if (map.tap) map.tap.disable();

            County.countiesLoaded.then(function(counties){
                counties.forEach(function(county){
                    $http.get(county.geojson, {cache: true})
                        .success(function(data){
                            L.geoJson(data, {
                                onEachFeature: function (feature, layer) {
                                    layer.setStyle(styles[county.forecasts.maxLevel]);
                                    layer.on('click', function(event){
                                        $state.go('county', {countyName: county.name});
                                        layer.setStyle(styles.clicked);

                                        $timeout(function(){
                                            layer.setStyle(styles[county.forecasts.maxLevel]);
                                        }, 500);
                                    });
                                }
                            }).addTo(map);
                        });
                });
            });
        }
    }
})();