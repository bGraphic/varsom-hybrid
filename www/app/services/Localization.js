/**
 * Created by storskel on 07.09.2015.
 */
angular
    .module('Varsom')
    .factory('Localization', function Localization(AppSettings) {
        var service = {};

        var translations = {
            nb: {
                "pullToRefresh": "Dra for å oppdatere",
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
                "avalancheSeasonStart":"Snøskredsdelen av appen er ikke klar enda.",
                "beta":"Dette er en testversjon av Varsom og denne siden er ikke ferdig.",
                "days": ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
                "dummy":"dummy"
            },
            en: {
                "pullToRefresh": "Pull to refresh",
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
                "avalancheSeasonStart":"Avalanche warnings is not yet implemented.",
                "beta":"This is a test version of Varsom, and this page is not yet implemented.",
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
