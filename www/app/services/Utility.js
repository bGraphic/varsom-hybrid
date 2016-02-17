(function(){

    function Utility(AppSettings){
        this.chooseLanguage = function(obj){
            var lang = AppSettings.getLocale()
            if(obj[lang]){
                return obj[lang]
            } else {
                return obj['no']
            }
        }

        this.printCauseList = function(array){
            return array.join(', ');
        }
    }

    angular.module('Varsom')
        .service('Utility', Utility);

})();
