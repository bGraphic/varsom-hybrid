/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .controller('CountiesCtrl', function CountiesCtrl($scope, $q, $ionicLoading, Localization, AppSettings, County) {
        var vm = this;

        $ionicLoading.show();

        $scope.$on('$ionicView.loaded', function() {

            vm.hazardRatingStyles = AppSettings.hazardRatingStyles;

            vm.counties = County.allCounties;
            vm.counties.$promise.then(function(){
                $ionicLoading.hide();
            });

            vm.pullToRefresh = function(){
                County.refreshAllCounties()
                    .then(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }


        });

/*        $scope.$on('$ionicView.beforeEnter', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });

        $scope.$on('$ionicView.beforeLeave', function() {
            $ionicLoading.show({template: translation.general['loading...']});
        });*/


    });