/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .controller('CountyCtrl', CountyCtrl);

    function CountyCtrl($stateParams){
        var vm = this;

        vm.name = $stateParams.countyName;
    }
})();