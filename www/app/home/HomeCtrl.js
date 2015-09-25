/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('HomeCtrl', function HomeCtrl($scope, $q, $ionicLoading, Localization, AppSettings, County) {
        var model = this;
        var translation;

        $scope.$on('$ionicView.loaded', function() {
            translation = Localization.getTranslations();
            model.hazardRatingStyles = AppSettings.hazardRatingStyles;

            model.counties = County.allCounties;

        });

/*        $scope.$on('$ionicView.beforeEnter', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });

        $scope.$on('$ionicView.beforeLeave', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });*/


    });