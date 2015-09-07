/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .directive('leafletMap', function LeafletMap(County, $http, $state, $timeout) {


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

            County.listAll().then(function (counties) {
                counties.forEach(function (county) {
                    console.log(county.geoJsonMinUrl);
                    county.addGeoJsonToMap(map);
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