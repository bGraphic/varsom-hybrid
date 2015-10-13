/**
 * Created by storskel on 07.09.2015.
 */
angular
    .module('Varsom')
    .factory('Localization', function Localization(AppSettings) {
        var service = {};

        var translations = {
            nb: {
                "language": "Språk",
                "loading...": "Laster...",
                "settings":"Innstillinger",
                "landslide-flood":"Jordskred / flom",
                "avalanche":"Snøskred",
                "map":"Kart",
                "municipalities":"Kommuner",
                "landslide":"Jordskred",
                "flood":"Flom",
                "forecastFor":"Varsel for",
                "avalancheSeasonStart":"Snøskredvarslingen starter 1. desember",
                "days": ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
                "dummy":"dummy"
            },
            en: {
                "language": "Language",
                "loading...": "Loading...",
                "settings":"Settings",
                "landslide-flood":"Landslide / flood",
                "avalanche":"Avalanche",
                "map":"Map",
                "municipalities":"Municipalities",
                "landslide":"Landslide",
                "flood":"Flood",
                "forecastFor":"Forecast for",
                "avalancheSeasonStart":"Avalanche warnings commence december 1st",
                "days": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "dummy":"dummy"
            }
        };

        service.getTranslations = function (localeOverride) {
            var locKey = localeOverride || AppSettings.getLocale().value;
            return translations[locKey];
        };

        service.getText = function (key) {
            return (service.getTranslations())[key];
        };

        return service;

    });
