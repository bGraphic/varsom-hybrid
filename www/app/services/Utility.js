/*global angular, console */

(function () {

  "use strict";

  function Utility(AppSettings, Localization) {
    this.chooseLanguage = function (obj) {
      var lang = AppSettings.getLocale().value;
      if (!obj) {
        return;
      }
      if (obj[lang]) {
        return obj[lang];
      } else {
        return obj.no;
      }
    };

    this.printCauseList = function (array) {
      if (angular.isArray(array)) {
        return array.map(function (elem) {
          return elem.Name;
        }).join(', ');
      }
    };

    this.printExpositionList = function (expositionStrings, expositions) {
      if (!expositions) {
        return;
      }
      var returnValue = [];
      expositions.split('').forEach(function (val, index) {
        if (val === '1') {
          returnValue.push(expositionStrings[index]);
        }
      });
      console.log(returnValue);

      return returnValue.join(', ');

    };

    this.getDayString = function (dateString) {
      if (dateString) {
        var date = new Date(dateString);
        return Localization.getText("daysFull")[date.getDay()]
      }
    };

    this.getDateString = function (dateString, localizationKey, skipMonth) {
      if (dateString) {
        var date = new Date(dateString);
        return date.getDate() + '.' + (skipMonth ? '' : (' ' + Localization.getText(localizationKey)[date.getMonth()]));
      }

    };

    this.getDateRangeString = function (days) {
      var skipMonth = false;
      if (days && days.length && days.length >= 3) {
        if (days[0].getMonth() === days[2].getMonth()) {
          skipMonth = true;
        }
        return this.getDateString(days[0], 'months', skipMonth) + ' - ' + this.getDateString(days[2], 'months');
      }
    };

    this.printExposedHeight = function (exposedHeightsStrings, exposedHeightFill, exposedHeight1, exposedHeight2) {
      return exposedHeightsStrings[exposedHeightFill].replace('%@', exposedHeight1).replace('%@', exposedHeight2);
    };

    this.getDays = function (forecast) {

      var days = [];

      angular.forEach(forecast, function (warning) {
        if (warning.hasOwnProperty("ValidFrom")) {
          var forecastDate = new Date(warning.ValidFrom);
          days.push(forecastDate);
        }
      });

      return days;
    };

  }

  angular.module('Varsom')
    .service('Utility', Utility);

})();
