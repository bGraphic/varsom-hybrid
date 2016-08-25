/*global angular, console */

(function () {
  'use strict';

  function AvalancheRegionProblemCtrl($stateParams, Utility) {
    var vm = this;
    vm.problem = $stateParams.problem;
    vm.printExposedHeight = Utility.printExposedHeight;
    vm.printExpositionList = Utility.printExpositionList;
    console.log(vm.problem);
  }

  angular.module('Varsom')
    .controller('AvalancheRegionProblemCtrl', AvalancheRegionProblemCtrl);

})();
