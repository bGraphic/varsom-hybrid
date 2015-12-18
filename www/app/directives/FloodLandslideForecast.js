
angular
    .module('Varsom')
    .directive('floodLandslideForecast', function floodLandslidefFrecast(AppSettings) {

        function link(scope) {

            scope.$watch('county', function(county){

                if(county && !county.FloodWarningForecast[0].validDay){
                    var floodForecast = county.FloodWarningForecast;
                    var floodLength = floodForecast.length;
                    var days = [];

                    for(var i = 0; i < floodLength; i++){
                        //Get day
                        var floodDate = new Date(floodForecast[i].validTo.iso);
                        days.push(floodDate.getDay());

                    }

                    scope.days = days;
                }
            });
        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                county: '=',
                translations: '='
            },
            templateUrl: 'app/directives/floodlandslideforecast.html'
        };

    });