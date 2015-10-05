angular
    .module('Varsom')
    .controller('SettingsCtrl', function SettingsCtrl($scope, AppSettings) {
        var vm = this;

        $scope.$on('$ionicView.loaded', function () {
            vm.locale = AppSettings.getLocale();

            vm.setLocale = function (newLoc) {
                AppSettings.setLocale(newLoc);
                $scope.$emit('varsom.translations.changed');
            };

        });

    });