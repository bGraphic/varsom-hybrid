/*global angular */

angular.module('Varsom')
  .controller('AvalancheRegionCtrl',
    function AvalancheRegionCtrl($scope, $location, $ionicScrollDelegate, $ionicLoading, $stateParams, Localization, Utility, region) {
      "use strict";

      var vm = this;
      vm.region = region;
      vm.days = [];

      vm.getAvalancheForecast = function (num) {
        if (vm.region) {
          return vm.region.Forecast[num];
        }
      };

      var init = function () {

        vm.days = Utility.getDays(vm.region.avalancheWarningForecast);
      };

      vm.util = Utility;

      vm.getAvalancheForecastText = function (num) {
        var forecast = vm.getAvalancheForecast(num);
        if (!forecast) {
          return;
        }

        if (forecast.MainText) {
          return forecast.MainText;
        } else if (forecast.AvalancheDanger) {
          if (forecast.AvalancheDanger.length > 150) {
            return forecast.AvalancheDanger.substring(0, 150) + '...';
          } else {
            return forecast.AvalancheDanger;
          }
        }

      };

      vm.getDangerLevelName = function (num) {
        var forecast = vm.getAvalancheForecast(num);
        if (forecast && forecast.DangerLevelName) {
          return forecast.DangerLevelName.replace(/[0-9] /, '');
        } else {
          return Localization.getText('ukjent');
        }

      };

      vm.scrollTo = function (id) {
        $location.hash(vm.region.regionId + id);
        $ionicScrollDelegate.anchorScroll(true);
      };

    });
