/*global angular */

angular.module('Varsom')
  .controller('MunicipalityDetailCtrl',
    function MunicipalityDetailCtrl(Utility, $stateParams, municipality) {
      "use strict";

      var vm = this;

      vm.forecast = municipality[$stateParams.forecastType + "Forecast"][$stateParams.day];
      vm.printCauseList = Utility.printCauseList;
    });
