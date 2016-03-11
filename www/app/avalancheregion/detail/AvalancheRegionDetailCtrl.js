(function () {
    'use strict';

    function AvalancheRegionDetailCtrl($stateParams) {
        var vm = this;
        vm.forecast = $stateParams.forecast;
        console.log(vm.forecast);
    }

    angular.module('Varsom')
        .controller('AvalancheRegionDetailCtrl', AvalancheRegionDetailCtrl);

})();
