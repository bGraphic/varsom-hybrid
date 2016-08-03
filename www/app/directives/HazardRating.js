
angular
    .module('Varsom')
    .directive('hazardRating', function HazardRating(AppSettings) {

        function link(scope) {

            scope.noHazardRating = '?';
            scope.styles = AppSettings.hazardRatingStyles;

            scope.parsedRating = parseInt(scope.warning.ActivityLevel);
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