/**
 * Created by storskel on 07.09.2015.
 */
angular
    .module('Varsom')
    .factory('Localization', function Localization(AppSettings) {
        var service = {};

        var translations = {
            no: {
                "ukjent": "Ukjent",
                "Skredtype": "Skredtype",
                "skredfare": "Skredfare",
                "advice": "Råd",
                "skredSnoDekke": "Skred og snødekke",
                "vær": "Vær",
                "Utløsningsårsak": "Utløsningsårsak",
                "Utbredelse": "Utbredelse",
                "Høyde": "Mest utsatt høyde",
                "Skredstørrelse": "Skredstørrelse",
                "Sannsynlighet": "Sannsynlighet",
                "Eksposisjon": "Mest utsatt himmelretning",
                "expositions": ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV'],
                "pullToRefresh": "Dra for å oppdatere",
                "language": "Språk",
                "problems": "Problemer",
                "exposedHeights": ["Ikke gitt", "Over %@ moh", "Under %@ moh", "Over %@ og under %@ moh", "Mellom %@ og %@ moh"],
                "moh": "moh",
                "loading...": "Laster...",
                "settings": "Innstillinger",
                "landslide-flood": "Flom / jordskred",
                "avalanche": "Snøskred",
                "map": "Kart",
                "municipalities": "Kommuner",
                "landslide": "Jordskred",
                "landslideType": "Skredtyper",
                "flood": "Flom",
                "forecastFor": "Varsel for",
                "highestForecast": "Varsel for perioden",
                "avalancheSeasonStart": "Snøskredsdelen av appen er ikke klar enda.",
                "beta": "Dette er en testversjon av Varsom og denne siden er ikke ferdig.",
                "days": ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
                "daysFull": ["Søndag", "Manda", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
                "months": ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sept", "okt", "nov", "des"],
                "monthsFull": ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
                "Updates": "Oppdateringer",
                "dummy": "dummy"
            },
            en: {
                "ukjent": "Unknown",
                "Skredtype": "Avalanche type",
                "skredfare": "Avalanche danger",
                "advice": "Advice",
                "skredSnoDekke": "Avalanche and snow cover",
                "vær": "Weather",
                "Utløsningsårsak": "Trigger/release",
                "Utbredelse": "Distribution",
                "Høyde": "Exposed height",
                "Skredstørrelse": "Avalanche size",
                "Sannsynlighet": "Probalility",
                "Eksposisjon": "Exposition",
                "expositions": ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
                "pullToRefresh": "Pull to refresh",
                "language": "Language",
                "problems": "Problems",
                "landslideType": "Landslide types",
                "exposedHeights": ["Not given", "Above %@ masl", "Below %@ masl", "Above %@ and below %@ masl", "Between %@ and %@ masl"],
                "moh": "masl",
                "loading...": "Loading...",
                "settings": "Settings",
                "landslide-flood": "Flood / landslide",
                "avalanche": "Avalanche",
                "map": "Map",
                "municipalities": "Municipalities",
                "landslide": "Landslide",
                "flood": "Flood",
                "forecastFor": "Forecast for",
                "highestForecast": "Highest warnings for",
                "avalancheSeasonStart": "Avalanche warnings is not yet implemented.",
                "beta": "This is a test version of Varsom, and this page is not yet implemented.",
                "days": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "daysFull": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Okt", "Nov", "Dec"],
                "monthsFull": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                "Updates": "Updates",
                "dummy": "dummy"
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
