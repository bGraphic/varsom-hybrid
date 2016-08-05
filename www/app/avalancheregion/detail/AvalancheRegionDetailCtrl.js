angular
    .module('Varsom')
    .controller('AvalancheRegionDetailCtrl', function AvalancheRegionDetailCtrl(Utility, $stateParams, region) {

        var vm = this;

        vm.forecast = region.forecast[$stateParams.day];

    });
