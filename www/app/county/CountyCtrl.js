/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountyCtrl', function CountyCtrl($scope, $ionicLoading, $stateParams, County, Municipality, Localization) {
        var model = this;
        var translation = Localization.getTranslations();

        if($stateParams.county){
            model.county = $stateParams.county;
            init();
        } else {
            County.getById($stateParams.countyId).then(function(result){
                model.county = result;
                init();
            });
        }

        function init () {
            console.log(model.county.countyId);
            Municipality.listAll(model.county.countyId).then(function (municipalities) {
                model.municipalities = municipalities;
                $ionicLoading.hide();
            });
        }

        $scope.$on('$ionicView.afterEnter', function() {
            // the view should be ready and transition done
            if(!model.municipalities)
                $ionicLoading.show({template: translation.general['loading...']});
        });


        //$scope.county = $stateParams.county;
       // console.log(model.county.get('countyId'));
    });