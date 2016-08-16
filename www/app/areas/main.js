/*global angular, console */

angular.module('Varsom')
  .controller('AreasMainCtrl',
    function ($scope, $state, $stateParams, $http, AppSettings, Localization, Area, areas, parentArea) {
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
            areaId: Area.Id
          });
          break;
        case "regions":
          $state.go('app.region', {
            areaId: Area.Id
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
          lat: 64.871,
          lng: 16.949,
          zoom: 4
        },
        defaults: {
          zoomControl: false,
          attributionControl: false
        },
        tiles: {
          url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
        }
      };

      if (vm.hasMap) {
        $http.get("/geojson/" + $stateParams.areaType + ".geojson").success(function (data, status) {

          vm.map.geojson = {
            data: data,
            style: function (feature) {
              var areaId = null,
                area = null;

              if (feature.properties.hasOwnProperty("fylkesnr")) {
                areaId = feature.properties.fylkesnr;
              } else if (feature.properties.hasOwnProperty("omraadeid")) {
                areaId = feature.properties.omraadeid;
              }

              area = Area($stateParams.areaType, areaId);

              return AppSettings.hazardRatingStyles[area.highestLevel];
            }
          };
        });
      }

      $scope.$watch("vm.map.selectedArea", function (newValue) {
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

      $scope.$on("leafletDirectiveMap.click", function (ev, leafletPayload) {

        if (!leafletPayload.model.hasOwnProperty("properties")) {
          if (vm.map.selectedArea) {
            vm.map.selectedArea = null;
          } else {
            vm.map.fullscreen = !vm.map.fullscreen;
          }
        }
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
