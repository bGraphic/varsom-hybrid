/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl(County){
        var vm = this;

        County.countiesLoaded.then(function(counties){
            console.log(counties);
            vm.counties = counties;
        });
    }
})();