
angular
    .module('Varsom')
    .directive('hazardRating', function HazardRating(AppSettings) {

        function link(scope) {

            scope.noHazardRating = '?';
            scope.styles = AppSettings.hazardRatingStyles;

        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                varsomRating: '='
            },
            template: '<span class="varsom-label {{styles[varsomRating || 0].className}}-bg" ng-bind="varsomRating || noHazardRating"></span>'
        };

    });