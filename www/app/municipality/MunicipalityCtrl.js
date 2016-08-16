/*global angular, console */

angular.module('Varsom')
  .controller('MunicipalityCtrl', function MunicipalityCtrl($location, $anchorScroll, municipality) {
    "use strict";

    var vm = this;
    vm.mun = municipality;
    vm.floodForecast = vm;

    console.log(vm.mun);

    vm.scrollTo = function (id) {
      $location.hash(vm.mun.municipalityId + id);
      $ionicScrollDelegate.anchorScroll(true);
    };

  });
