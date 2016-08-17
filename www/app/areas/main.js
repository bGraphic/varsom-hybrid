/*global angular, console, L */

angular.module('Varsom')
  .controller('AreasMainCtrl',
    function ($scope, $state, $stateParams, $http, $timeout, $cordovaGeolocation, AppSettings, Localization, Area, areas, parentArea, leafletData) {
      "use strict";

      var vm = this;
      vm.parentArea = parentArea;
      vm.areas = areas;

      vm.titleKey = ("regions" === $stateParams.areaType) ? "avalanche" : "landslide-flood";
      vm.hasMap = !$stateParams.parentId;

      vm.goToArea = function (area) {

        switch ($stateParams.areaType) {
        case "counties":
          $state.go('app.areas', {
            areaType: "municipalities",
            parentId: area.Id
          });
          break;
        case "municipalities":
          $state.go('app.municipality', {
            areaId: area.Id
          });
          break;
        case "regions":
          $state.go('app.region', {
            areaId: area.Id
          });
          break;
        }

      };

      vm.pullToRefresh = function () {
        Area.refreshAreas($stateParams.areaType, $stateParams.parentId).then(function (ares) {
          vm.areas = areas;
          $scope.$broadcast('scroll.refreshComplete');
        });
      };

      // MAP

      vm.map = {
        fullscreen: false,
        center: {
          lat: 64.871 - 2,
          lng: 16.949,
          zoom: 4
        },
        defaults: {
          zoomControl: false,
          attributionControl: false
        },
        tiles: {
          url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
        },
        paths: {}
      };

      function getAreaFromGeoJson(feature) {
        var areaId = null;
        if (feature.properties.hasOwnProperty("fylkesnr")) {
          areaId = feature.properties.fylkesnr;
        } else if (feature.properties.hasOwnProperty("omraadeid")) {
          areaId = feature.properties.omraadeid;
        }
        if (areaId) {
          return vm.areas.getArea(areaId);
        }
      }

      function geoJsonStyle(feature) {
        var area = getAreaFromGeoJson(feature);
        return AppSettings.hazardRatingStyles[area.Rating];
      }

      if (vm.hasMap) {
        $cordovaGeolocation
          .getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: false
          })
          .then(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            var latlng = L.latLng(lat, long);

            //Make sure location is in Norway
            if (lat < 57 || long < 3 || lat > 72 || long > 34) {
              return;
            }

            console.log('Found location', position);
            var radius = position.coords.accuracy;

            /*L.marker(e.latlng).addTo(map)
             .bindPopup("You are within " + radius + " meters from this point").openPopup();*/

            vm.map.paths = {
              currentPos: {
                latlngs: {
                  lat: lat,
                  lng: long
                },
                radius: radius,
                type: 'circle'
              }
            };

            vm.map.center = {
              lat: (lat - 2.5),
              lng: long,
              zoom: 6
            };

          }, function (err) {
            // error
          });

        var url = "/geojson/" + $stateParams.areaType + ".geojson";

        $http.get(url).success(function (data, status) {

          leafletData.getMap().then(function (map) {
            map.on('click', function (event) {
              $timeout(function () {
                if (!event.originalEvent.isDefaultPrevented()) {
                  vm.map.fullscreen = !vm.map.fullscreen;
                }
              });
            });

            vm.geojson = L.geoJson(data, {
              style: geoJsonStyle,
              onEachFeature: function (feature, layer) {
                layer.on("click", function (event) {
                  event.originalEvent.preventDefault();
                  var area = getAreaFromGeoJson(feature);
                  vm.map.selectedArea = area;
                });
              }
            }).addTo(map);
          });

          angular.forEach(vm.areas, function (area, key) {
            var watchid = "vm.areas[" + key + "].Rating";

            $scope.$watch(watchid, function (newValue, oldValue) {
              if (newValue !== oldValue) {
                vm.geojson.setStyle(geoJsonStyle);
              }
            });
          });
        });
      }

      $scope.$watch("vm.map.selectedArea", function (newValue) {
        console.log("vm.map.selectedArea");
        if (newValue) {
          vm.map.fullscreen = true;
        } else {
          vm.map.fullscreen = false;
        }
      });

      $scope.$on("leafletDirectiveGeoJson.click", function (ev, leafletPayload) {

        var areaId = null;

        if (leafletPayload.model.hasOwnProperty("properties")) {

          if (leafletPayload.model.properties.hasOwnProperty("fylkesnr")) {
            areaId = leafletPayload.model.properties.fylkesnr;
          } else if (leafletPayload.model.properties.hasOwnProperty("omraadeid")) {
            areaId = leafletPayload.model.properties.omraadeid;
          }
        }

        Area($stateParams.areaType, areaId).$loaded().then(function (area) {
          console.log("AreasMainCtrl: area selected in map", area);
          vm.map.selectedArea = area;
        });
      });

    });

angular.module('Varsom')
  .directive('forecastWidget', function ForecastWidget() {
    "use strict";
    return {
      restrict: 'E',
      scope: {
        forecast: '=',
        label: '='
      },
      templateUrl: '/templates/forecast-widget.html'
    };

  });

angular.module('Varsom')
  .directive('areaWidget', function AreaWidget($stateParams) {
    "use strict";
    return {
      restrict: 'E',
      scope: {
        area: '=',
        translations: '='
      },
      templateUrl: function (elem, attr) {
        if ('regions' === $stateParams.areaType) {
          return '/templates/area-region-widget.html';
        } else {
          return '/templates/area-county-widget.html';
        }

      }
    };
  });
