/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyCtrl', function CountyCtrl($stateParams, Municipality) {
        var model = this;

        model.county = $stateParams.county;

        Municipality.loadMunicipalities(model.county.countyId);

        Municipality.loaded.then(function (municipalities) {
            model.municipalities = municipalities;
        });
        //$scope.county = $stateParams.county;
        console.log(model.county);
    });