angular
    .module('Varsom')
    .provider('AppSettings', function AppSettingsProvider(){

        var settings = {};
        var locale = {
            value: undefined,
            storageKey: 'varsomLocale'
        };
        settings.warningStyles = {
            '0': {
                weight: 3,
                color: '#C8C8C8',
                dashArray: '',
                fillOpacity: 0.5
            },
            '1': {
                weight: 3,
                color: '#75B100',
                dashArray: '',
                fillOpacity: 0.5
            },
            '2': {
                weight: 3,
                color: '#FFCC33',
                dashArray: '',
                fillOpacity: 0.5
            },
            '3': {
                weight: 3,
                color: '#E46900',
                dashArray: '',
                fillOpacity: 0.5
            },
            '4': {
                weight: 3,
                color: '#D21523',
                dashArray: '',
                fillOpacity: 0.5
            },
            '5': {
                weight: 3,
                color: '#3E060B',
                dashArray: '',
                fillOpacity: 0.5
            },
            clicked: {
                weight: 3,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.5
            }
        };

        this.setWarningStyles = function(newStyle){
            settings.warningStyles = newStyle;
        };

        this.$get = function AppSettingsFactory(LocalStorage){
            settings.getLocale = function(){
                if(!locale.value)
                    locale.value = LocalStorage.get(locale.storageKey, 'nb');
                return locale.value;
            };

            settings.setLocale = function (newLocale) {
                locale.value = LocalStorage.set(locale.storageKey, newLocale);
            };

            return settings;
        };
    });