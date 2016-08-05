
angular
    .module('Varsom')
    .directive('floodLandslideForecast', function floodLandslidefFrecast(AppSettings, Utility) {

        function link(scope) {

            scope.$watch('county', function(county){
                if(!county){
                    return;
                }

                scope.floodWarningForecast = county.floodForecast;
                scope.landslideWarningForecast = county.landslideForecast;

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