
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

                if(!scope.floodWarningForecast[0].validDay){
                    var floodLength = scope.floodWarningForecast.length;
                    var days = [];

                    for(var i = 0; i < floodLength; i++){
                        //Get day
                        var floodDate = new Date(scope.floodWarningForecast[i].ValidTo);
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