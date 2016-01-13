/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .directive('leafletMap', function LeafletMap() {
        function link(scope, elem, attrs) {
            var options = scope.leafletMap;
            console.log(options);
            if (options.small)
                elem.css('height', '200px');
            else
                elem.css('height', '100%');


            var map = L.map(elem[0], {
                center: [64.871, 16.949],
                zoom: 4,
                zoomControl:false,
                attributionControl: false
            });
            var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png');
            //var geoLayer = L.geoJson()


            map.addLayer(layer);

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
            }

            if (options.userPos) {
                console.log(options.userPos);
                map.locate();
                map.on('locationfound', onLocationFound);
            }


            scope.$emit('leafletMap.loaded', map);

            scope.$on('$destroy', function() {
                map.remove();
            });

            scope.$on('leafletMap.center', function(event, latlng) {
                map.setView(latlng, 7);
            });

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
            restrict: 'A',
            link: link,
            scope: {
                leafletMap: '='
            }
        };

    });