angular.module('Varsom')
  .controller('AreasMapCtrl',
    function ($scope, $state, $stateParams, $http, $timeout, $ionicPlatform, $cordovaGeolocation, AppSettings, areas, leafletData) {

      var onMapClick = function (event) {
        $timeout(function () {
          if (!event.originalEvent.isDefaultPrevented()) {
            vm.selectedArea = null;
          }
        });
      };

      var getAreaFromGeoJson = function (feature) {
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

      var onEachGeoJsonFeature = function (feature, layer) {
        layer.on("click", function (event) {
          event.originalEvent.preventDefault();
          var area = getAreaFromGeoJson(feature);
          vm.selectedArea = area;
        });
      }

      var geoJsonFeatureStyle = function (feature) {
        var area = getAreaFromGeoJson(feature);
        var style = angular.copy(AppSettings.hazardRatingStyles[area.Rating]);
        if (vm.selectedArea && vm.selectedArea.Id === area.Id) {
          style = angular.extend(style, AppSettings.hazardRatingStyles.clicked);
        }
        return style;
      }

      var updateGeoJsonStyle = function () {
        if (vm.geoJsonLayer) {
          vm.geoJsonLayer.setStyle(geoJsonFeatureStyle);
        }
      }

      var addGeoJsonAreasToMap = function (geoJsonData) {
        leafletData.getMap().then(function (map) {
          var geoJsonLayer = L.geoJson(geoJsonData, {
            style: geoJsonFeatureStyle,
            onEachFeature: onEachGeoJsonFeature
          }).addTo(map);

          angular.extend(vm, {
            geoJsonLayer: geoJsonLayer
          });

        });
      }

      var fetchAndAddGeoJsonAreasToMap = function () {
        var url = "geojson/" + $stateParams.areaType + ".geojson";

        $http.get(url).success(function (data, status) {
          addGeoJsonAreasToMap(data);
        }).error(function (error) {
          console.log("AreasMainCtrl: Http geojson get error", error);
        });
      }

      var listenForChangesOnSelectedArea = function () {
        $scope.$watch("mapVm.selectedArea", function (newValue, oldValue) {
          if (newValue !== oldValue) {
            updateGeoJsonStyle();
          }
        });
      }

      var listenForChangesOnAreas = function () {
        angular.forEach(vm.areas, function (area, key) {
          var watchid = "mapVm.areas[" + key + "].Rating";

          $scope.$watch(watchid, function (newValue, oldValue) {
            if (newValue !== oldValue) {
              updateGeoJsonStyle();
            }
          });
        });
      }

      var listenToClicksOnMap = function () {
        leafletData.getMap().then(function (map) {
          map.on('click', onMapClick);
        });
      }

      var vm = this;

      angular.extend(vm, {
        areas: areas,
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

      fetchAndAddGeoJsonAreasToMap();
      listenForChangesOnSelectedArea();
      listenForChangesOnAreas();
      listenToClicksOnMap();

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

          console.log('AreasMainCtrl: Found location', position);
          var radius = position.coords.accuracy;

          vm.paths = {
            currentPos: {
              latlngs: {
                lat: lat,
                lng: long
              },
              radius: radius,
              type: 'circle'
            }
          };

          vm.center = {
            lat: (lat - 2.5),
            lng: long,
            zoom: 6
          };

        }, function (err) {
          // error
        });

    });
