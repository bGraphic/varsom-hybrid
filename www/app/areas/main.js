/*global angular, console, L */

angular.module('Varsom')
  .controller('AreasMainCtrl',
    function ($scope, $state, $stateParams, $http, $timeout, $ionicPlatform, $cordovaGeolocation, $cordovaFile, AppSettings, Localization, Area, areas, parentArea, leafletData) {
      "use strict";

      var vm = this;
      vm.areaType = $stateParams.areaType;
      vm.areas = areas;
      vm.parentArea = parentArea;

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
