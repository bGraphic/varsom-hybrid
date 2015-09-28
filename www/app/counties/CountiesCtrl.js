/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountiesCtrl', function CountiesCtrl($scope, $q, $ionicLoading, Localization, AppSettings, County) {
        var vm = this;
        var translation;

        $scope.$on('$ionicView.loaded', function() {
            translation = Localization.getTranslations();
            vm.hazardRatingStyles = AppSettings.hazardRatingStyles;

            vm.counties = County.allCounties;

        });

/*        $scope.$on('$ionicView.beforeEnter', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });

        $scope.$on('$ionicView.beforeLeave', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });*/


    });