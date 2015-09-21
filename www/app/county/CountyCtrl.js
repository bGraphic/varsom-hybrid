/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyCtrl', function CountyCtrl($scope, $ionicLoading, $stateParams, County, Municipality, Localization) {
        var model = this;
        var translation;


        function init () {
            model.municipalities = Municipality.listAllForCounty(model.county.countyId);
            console.log('MUN', model.municipalities);
           /* Municipality.listAll(model.county.countyId).then(function (municipalities) {
                model.municipalities = municipalities;
                //$ionicLoading.hide();
            });*/
        }

        $scope.$on('$ionicView.loaded', function() {
            translation = Localization.getTranslations();
            if($stateParams.county){
                model.county = $stateParams.county;
                init();
            } else {
                County.getById($stateParams.countyId).$promise.then(function(data){
                    model.county = data.results[0];
                    init();
                });
            }
        });




        //$scope.county = $stateParams.county;
       // console.log(model.county.get('countyId'));
    });