
angular
    .module('Varsom')
    .controller('CountiesCtrl', function CountiesCtrl($scope, $http, $q, $state, $ionicLoading, Localization, AppSettings, County) {
        var vm = this;

        $ionicLoading.show();

        $scope.$on('$ionicView.loaded', function() {

            AppSettings.setDefaultView('/app/counties');

            vm.regions = County.allCounties;

            //Hide loading when promise is resolved
            vm.regions.$promise.then(function(){
                $ionicLoading.hide();
            });

            vm.pullToRefresh = function(){
                County.refreshAllCounties()
                    .then(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }


        });


    });