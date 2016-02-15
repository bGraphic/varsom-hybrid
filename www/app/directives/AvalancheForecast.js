
angular
    .module('Varsom')
    .directive('avalancheForecast', function avalancheForecast(Utility) {

        function link(scope) {

            scope.$watch('region', function(region){
                if(!region){
                    return;
                }

                scope.avalancheWarningForecast = Utility.chooseLanguage(region.avalancheWarningForecast);

                if(!scope.avalancheWarningForecast[0].validDay){

                    var forecastLength = scope.avalancheWarningForecast.length;
                    var days = [];

                    for(var i = 0; i < forecastLength; i++){
                        //Get day
                        var date = new Date(scope.avalancheWarningForecast[i].ValidTo);
                        days.push(date.getDay());

                    }

                    scope.days = days;
                }
            });
        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                region: '=',
                translations: '='
            },
            templateUrl: 'app/directives/avalancheforecast.html'
        };

    });