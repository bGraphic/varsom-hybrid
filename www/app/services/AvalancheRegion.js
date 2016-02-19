angular
    .module('Varsom')
    .factory('AvalancheRegion', function ($resource, Utility, AppSettings) {

        var AvalancheRegion = $resource(AppSettings.getParseClassUrl('AvalancheRegion'), {}, {
            get: {
                headers: AppSettings.getParseHeader()
            },
            query: {
                headers:AppSettings.getParseHeader(),
                params: {
                    where: '@where',
                    order: 'sortOrder', //Ascending
                    include:'AvalancheWarningForecast'
                }
            }
        });

        AvalancheRegion.refreshAllRegions = function(){
            AvalancheRegion.allRegions = AvalancheRegion.query(function() {
                AvalancheRegion.allRegions.results.forEach(function(region){
                    console.log(region);

                    var warningForecast = Utility.chooseLanguage(region.avalancheWarningForecast);

                    var tempBiggestLevel = -1;

                    for (var j = warningForecast.length; j--;) {
                        var curWarnLevel = warningForecast[j].DangerLevel;

                        if (curWarnLevel > tempBiggestLevel)
                            tempBiggestLevel = curWarnLevel;

                        //Get day
                        var date = new Date(warningForecast[j].ValidFrom);
                        warningForecast[j].validDay = date.getDay();
                    }
                    region.maxLevel = tempBiggestLevel;
                });
            });
            return AvalancheRegion.allRegions.$promise;
        };

        AvalancheRegion.getById = function (regionId){
            return AvalancheRegion.query({
                where: {'regionId':regionId}
            });
        };

        AvalancheRegion.refreshAllRegions();

        return AvalancheRegion;

    });


