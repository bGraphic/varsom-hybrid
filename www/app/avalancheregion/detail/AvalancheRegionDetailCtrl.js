/*global angular */

angular
  .module('Varsom')
  .controller('AvalancheRegionDetailCtrl', function AvalancheRegionDetailCtrl(Utility, $stateParams, region) {
    "use strict";

    var vm = this;

    vm.forecast = region.Forecast[$stateParams.day];

  });
