/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('HomeCtrl', function HomeCtrl($q, County) {
        var HomeModel = this;

        County.listAll().then(function (counties) {
            console.log(counties);
            HomeModel.counties = counties;
        });

        HomeModel.warningClasses = [
            'stable', //Warning level 0
            'calm',
            'balanced',
            'energized',
            'assertive',
            'royal'
        ];
    });