(function(){

    function Utility(AppSettings){
        this.chooseLanguage = function(obj){
            var lang = AppSettings.getLocale();
            if(obj[lang]){
                return obj[lang];
            } else {
                return obj['no'];
            }
        }
    }

    angular.module('Varsom')
        .service('Utility', Utility);

})();
