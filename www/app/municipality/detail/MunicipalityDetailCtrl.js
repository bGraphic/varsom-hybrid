(function () {
    'use strict';

    function MunicipalityDetailCtrl($stateParams, Utility) {
        var vm = this;

        vm.forecast = $stateParams.forecast;
        vm.printCauseList = Utility.printCauseList;

        console.log($stateParams);

    }

    angular.module('Varsom')
        .controller('MunicipalityDetailCtrl', MunicipalityDetailCtrl);

})();
