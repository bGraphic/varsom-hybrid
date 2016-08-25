/*global angular */

angular.module('Varsom')
  .directive('hazardRating', function HazardRating(AppSettings) {
    "use strict";

    function link(scope) {
      scope.styles = AppSettings.hazardRatingStyles;
    }

    return {
      restrict: 'E',
      link: link,
      scope: {
        warning: '='
      },
      template: '<span class="varsom-label {{styles[warning.Rating || 0].className}}-bg">{{(warning.Rating > 0 ? warning.Rating : "?")}}</span>'
    };

  });
