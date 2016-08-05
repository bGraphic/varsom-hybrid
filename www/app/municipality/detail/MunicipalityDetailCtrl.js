angular
    .module('Varsom')
    .controller('MunicipalityDetailCtrl', function MunicipalityDetailCtrl(Utility, $stateParams, municipality) {
        var vm = this;

        vm.forecast = Utility.chooseLanguage(municipality[$stateParams.forecastType + "Forecast"])[$stateParams.day];
        vm.printCauseList = Utility.printCauseList;
    });
