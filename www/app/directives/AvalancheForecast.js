
angular
    .module('Varsom')
    .directive('avalancheForecast', function avalancheForecast(Utility) {

        function link(scope) {

            scope.$watch('region', function(region){
                console.log('DAYS!!!!!!!', region);
                if(!region){
                    return;
                }

                scope.avalancheWarningForecast = Utility.chooseLanguage(region.avalancheWarningForecast);

            });
        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                days:'=',
                region: '=',
                translations: '='
            },
            templateUrl: 'app/directives/avalancheforecast.html'
        };

    });