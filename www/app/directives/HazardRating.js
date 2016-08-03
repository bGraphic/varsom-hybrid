
angular
    .module('Varsom')
    .directive('hazardRating', function HazardRating(AppSettings) {

        function link(scope) {

            scope.noHazardRating = '?';
            scope.styles = AppSettings.hazardRatingStyles;

            if (scope.warning.hasOwnProperty("ActivityLevel")) {
                scope.parsedRating = parseInt(scope.warning.ActivityLevel);
            } else if (scope.warning.hasOwnProperty("DangerLevel")) {
                scope.parsedRating = parseInt(scope.warning.DangerLevel);
            }
        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                warning: '='
            },
            template: '<span class="varsom-label {{styles[parsedRating || 0].className}}-bg">{{(parsedRating || noHazardRating)}}</span>'
        };

    });