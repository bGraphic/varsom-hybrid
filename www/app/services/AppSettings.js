angular
    .module('Varsom')
    .provider('AppSettings', function AppSettingsProvider(){

        var settings = {};
        var locale = {
            value: 'no',
            available: [
                {key: 'no', name: 'Norsk'},
                {key: 'en', name:'English'}
            ],
            storageKey: 'varsomLocale'
        };
        var parseRestApi = {
            url: 'https://api.parse.com/',
            version: '1',
            header: {}
        };

        settings.hazardRatingStyles = {
            '0': {
                weight: 2,
                color: '#C8C8C8',
                fillColor: '#C8C8C8',
                dashArray: '',
                fillOpacity: 0.5,
                opacity: 0.4,
                className: 'stable'
            },
            '1': {
                weight: 2,
                color: '#75B100',
                fillColor: '#75B100',
                dashArray: '',
                fillOpacity: 0.5,
                opacity: 0.4,
                className: 'calm'
            },
            '2': {
                weight: 2,
                color: '#FFCC33',
                fillColor: '#FFCC33',
                dashArray: '',
                fillOpacity: 0.5,
                opacity: 0.4,
                className: 'balanced'
            },
            '3': {
                weight: 2,
                color: '#E46900',
                fillColor: '#E46900',
                dashArray: '',
                fillOpacity: 0.5,
                opacity: 0.4,
                className: 'energized'
            },
            '4': {
                weight: 2,
                color: '#D21523',
                fillColor: '#D21523',
                dashArray: '',
                fillOpacity: 0.5,
                opacity: 0.4,
                className: 'assertive'
            },
            '5': {
                weight: 2,
                color: '#3E060B',
                fillColor: '#3E060B',
                dashArray: '',
                fillOpacity: 0.5,
                opacity: 0.4,
                className: 'royal'
            },
            clicked: {
                weight: 5,
                color: '#666',
                fillOpacity: 0.9,
                opacity: 0.5
            }
        };

        this.getDefaultView = function () {
            return localStorage.getItem('defaultView') || '/app/counties';
        };

        this.setHazardRatingStyles = function(newStyle){
            settings.hazardRatingStyles = newStyle;
        };

        this.setParseApiHeader = function (header) {
            parseRestApi.header = header;
        };

        this.$get = function AppSettingsFactory(LocalStorage){
            settings.getLocale = function(){
                if(!locale.value)
                    locale.value = LocalStorage.get(locale.storageKey, locale.available[0].key);
                return locale;
            };

            settings.setLocale = function (newLocale) {
                locale.value = LocalStorage.set(locale.storageKey, newLocale);
            };

            settings.getParseUrl = function (path) {
                return parseRestApi.url + parseRestApi.version + path;
            };

            settings.getParseClassUrl = function (path) {
                return parseRestApi.url + parseRestApi.version + '/classes/' + path;
            };

            settings.getParseHeader = function () {
                return parseRestApi.header;
            };

            settings.setDefaultView = function(val){
                LocalStorage.set('defaultView', val);
            };

            return settings;
        };
    });