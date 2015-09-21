/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('HomeCtrl', function HomeCtrl($scope, $q, $ionicLoading, Localization, County) {
        var model = this;
        var translation;

        $scope.$on('$ionicView.loaded', function() {
            translation = Localization.getTranslations();
            model.warningClasses = [
                'stable', //Warning level 0
                'calm',
                'balanced',
                'energized',
                'assertive',
                'royal'
            ];

            model.counties = County.allCounties;

        });

/*        $scope.$on('$ionicView.beforeEnter', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });

        $scope.$on('$ionicView.beforeLeave', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });*/


    });