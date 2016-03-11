
angular
    .module('Varsom')
    .directive('floodLandslideForecast', function floodLandslidefFrecast(AppSettings, Utility) {

        function link(scope) {

            scope.$watch('county', function(county){
                if(!county){
                    return;
                }

                scope.floodWarningForecast = Utility.chooseLanguage(county.floodWarningForecast);
                scope.landslideWarningForecast = Utility.chooseLanguage(county.landslideWarningForecast);

            });
        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                days: '=',
                county: '=',
                translations: '='
            },
            templateUrl: 'app/directives/floodlandslideforecast.html'
        };

    });