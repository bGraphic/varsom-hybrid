angular
    .module('Varsom')
    .controller('AvalancheRegionDetailCtrl', function AvalancheRegionDetailCtrl(Utility, $stateParams, region) {

        var vm = this;

        vm.forecast = Utility.chooseLanguage(region.forecast)[$stateParams.day];

    });
