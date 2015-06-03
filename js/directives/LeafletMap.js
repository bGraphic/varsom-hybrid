/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .directive('leafletMap', LeafletMap);

    function LeafletMap(County, $http){
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elem, attrs){
            elem.css('height', '480px');

            var map = L.map(elem[0], {
                center: [63.871, 11.949],
                zoom: 4
            });

            County.countiesLoaded.then(function(counties){
                counties.forEach(function(county){
                    $http.get(county.geojson, {cache: true})
                        .success(function(data){
                            L.geoJson(data, {
                                onEachFeature: function (feature, layer) {
                                    layer.on('click', function(event){alert('Clicked ' + county.name)});
                                }
                            }).addTo(map);
                        });
                });
            });
        }
    }
})();