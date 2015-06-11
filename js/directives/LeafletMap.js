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
                default: {
                    weight: 3,
                    color: '#387ef5',
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
                                    layer.setStyle(styles.default);
                                    layer.on('click', function(event){
                                        $state.go('county');
                                        layer.setStyle(styles.clicked);

                                        $timeout(function(){
                                            layer.setStyle(styles.default);
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