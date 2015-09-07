/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyCtrl', function CountyCtrl($stateParams, County, Municipality) {
        var model = this;

        if($stateParams.county){
            model.county = $stateParams.county;
            init();
        } else {
            County.getById($stateParams.countyId).then(function(result){
                model.county = result;
                init();
            }, function(error) {
                alert(error);
            });
        }



        function init () {
            console.log(model.county.countyId);
            Municipality.listAll(model.county.countyId).then(function (municipalities) {
                model.municipalities = municipalities;
            });
        }


        //$scope.county = $stateParams.county;
       // console.log(model.county.get('countyId'));
    });