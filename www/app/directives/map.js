/*global angular */

angular.module('Varsom')
  .directive('map', function HazardRating($timeout, $http, $cordovaGeolocation, AppSettings, Areas, leafletData) {
    "use strict";

    function link(scope) {

      var onMapClick = function () {
        scope.selectedArea = null;
        scope.$emit("varsom.map.clicked", scope.selectedArea);
      };

      var onAreaClick = function (area) {
        scope.selectedArea = area;
      };

      var getAreaFromGeoJson = function (feature) {
        var areaId = null;
        if (feature.properties.hasOwnProperty("fylkesnr")) {
          areaId = feature.properties.fylkesnr;
        } else if (feature.properties.hasOwnProperty("omraadeid")) {
          areaId = feature.properties.omraadeid;
        }
        if (areaId) {
          return scope.areas.getArea(areaId);
        }
      }

      var onEachGeoJsonFeature = function (feature, layer) {
        layer.on("click", function (event) {
          event.originalEvent.preventDefault();
          var area = getAreaFromGeoJson(feature);
          onAreaClick(area);
        });
      }

      var geoJsonFeatureStyle = function (feature) {
        var area = getAreaFromGeoJson(feature);
        var style = angular.copy(AppSettings.hazardRatingStyles[area.Rating]);
        if (scope.selectedArea && scope.selectedArea.Id === area.Id) {
          style = angular.extend(style, AppSettings.hazardRatingStyles.clicked);
        }
        return style;
      }

      var updateGeoJsonStyle = function () {
        if (scope.geoJsonLayer) {
          scope.geoJsonLayer.setStyle(geoJsonFeatureStyle);
        }
      }

      var addGeoJsonAreasToMap = function (geoJsonData) {
        leafletData.getMap().then(function (map) {
          var geoJsonLayer = L.geoJson(geoJsonData, {
            style: geoJsonFeatureStyle,
            onEachFeature: onEachGeoJsonFeature
          }).addTo(map);

          angular.extend(scope, {
            geoJsonLayer: geoJsonLayer
          });

        });
      }

      var fetchAndAddGeoJsonAreasToMap = function () {
        var url = "geojson/" + scope.areaType + ".geojson";

        $http.get(url).success(function (data, status) {
          addGeoJsonAreasToMap(data);
        }).error(function (error) {
          console.log("Map Directive: Http geojson get error", error);
        });
      }

      var listenForRatingChangeInAreas = function () {
        angular.forEach(scope.areas, function (area, key) {
          var watchid = "areas[" + key + "].Rating";
          scope.$watch(watchid, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              updateGeoJsonStyle();
            }
          });
        });
      }

      var listenForNewSelectedArea = function () {
        scope.$watch("selectedArea", function (newValue, oldValue) {

          if (newValue !== oldValue) {
            console.log("Map Directive: Selected area changed");
            updateGeoJsonStyle();
            scope.$emit("varsom.map.area.selected", scope.selectedArea)
          }
        });
      }

      var listenToClicksOnMap = function () {
        leafletData.getMap().then(function (map) {
          map.on('click', function (event) {
            $timeout(function () {
              if (!event.originalEvent.isDefaultPrevented()) {
                onMapClick();
              }
            });
          })
        });
      }

      var listenForCurrentLocation = function () {
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

            console.log('Map Directive: Found position', position);
            var radius = position.coords.accuracy;

            angular.extend(scope, {
              paths: {
                currentPos: {
                  latlngs: {
                    lat: lat,
                    lng: long
                  },
                  radius: radius,
                  type: 'circle'
                }
              },
              center: {
                lat: (lat - 2.5),
                lng: long,
                zoom: 6
              }
            });

          }, function (error) {
            console.log('Map Directive: Could not find position', error);
          });
      }

      fetchAndAddGeoJsonAreasToMap();
      listenForRatingChangeInAreas();
      listenForNewSelectedArea();
      listenToClicksOnMap();
      listenForCurrentLocation();
    }

    return {
      restrict: 'E',
      link: link,
      scope: {
        areaType: '=',
        areas: '=',
      },
      templateUrl: 'app/directives/map.html',
      controller: function ($scope) {
        angular.extend($scope, {
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

        });
      },
    };

  });
