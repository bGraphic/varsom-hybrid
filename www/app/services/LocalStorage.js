/**
 * Created by storskel on 11.06.2015.
 */
angular
    .module('Varsom')
    .factory('LocalStorage', function LocalStorage($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
                return value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    });