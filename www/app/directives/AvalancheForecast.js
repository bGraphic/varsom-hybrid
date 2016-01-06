
angular
    .module('Varsom')
    .directive('avalancheForecast', function avalancheForecast() {

        function link(scope) {

            scope.$watch('region', function(region){

                if(region && !region.AvalancheWarningForecast[0].validDay){
                    var forecast = region.AvalancheWarningForecast;
                    var forecastLength = forecast.length;
                    var days = [];

                    for(var i = 0; i < forecastLength; i++){
                        //Get day
                        var date = new Date(forecast[i].validTo.iso);
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