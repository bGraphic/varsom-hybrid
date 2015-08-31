/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .controller('CountyCtrl', CountyCtrl);

    function CountyCtrl($stateParams){
        var model = this;

        model.county = $stateParams.county;
        //$scope.county = $stateParams.county;
        console.log(model.county);
    }
})();