/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl(County){
        var HomeModel = this;

        County.loaded.then(function(counties){
            console.log(counties);
            HomeModel.counties = counties.sort(function(a,b){
                if (a.forecasts.maxLevel > b.forecasts.maxLevel) {
                    return -1;
                }
                if (a.forecasts.maxLevel < b.forecasts.maxLevel) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
        });

        HomeModel.warningClasses = [
            'stable', //Warning level 0
            'calm',
            'balanced',
            'energized',
            'assertive',
            'royal'
        ];
    }
})();