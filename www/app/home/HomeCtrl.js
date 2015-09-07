/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('HomeCtrl', function HomeCtrl($scope, $q, $ionicLoading, Localization, County) {
        var HomeModel = this;
        var translation = Localization.getTranslations();

        County.listAll().then(function (counties) {
            console.log(counties);
            HomeModel.counties = counties;
            $ionicLoading.hide();
        });

        $scope.$on('$ionicView.afterEnter', function() {
            // the view should be ready and transition done
            if(!HomeModel.counties)
                $ionicLoading.show({template: translation.general['loading...']});
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