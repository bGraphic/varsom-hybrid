/*global angular, console */
angular.module('Varsom')
  .factory('LocalStorage', function LocalStorage($window) {
    "use strict";

    return {
      set: function (key, value) {
        $window.localStorage.setItem(key, value);
        return value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage.getItem(key) || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage.setItem(key, JSON.stringify(value));
      },
      getObject: function (key) {
        console.log('Fetching from local storage');
        var fetched = $window.localStorage.getItem(key);
        return fetched ? JSON.parse(fetched) : undefined;
      }
    };
  });
