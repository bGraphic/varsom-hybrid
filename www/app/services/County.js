/**
 * County Parse model
 */

angular
    .module('Varsom')
    .factory('County', function County($resource, AppSettings, Utility) {

        var County = $resource(AppSettings.getParseClassUrl('County'), {}, {
            get: {
                headers: AppSettings.getParseHeader()
            },
            query: {
                headers:AppSettings.getParseHeader(),
                params: {
                    where: '@where',
                    order: '-countyId', //Ascending
                    include:'LandSlideWarningForecast,FloodWarningForecast'
                }
            }
        });

        County.refreshAllCounties = function(){
            County.allCounties = County.query(function() {
                console.log(County.allCounties.results);
                County.allCounties.results.forEach(function(county){

                    var floodForecast = Utility.chooseLanguage(county.floodWarningForecast),
                        landSlideForecast = Utility.chooseLanguage(county.landslideWarningForecast);

                    var tempBiggestLevel = -1;

                    for (var j = floodForecast.length; j--;) {
                        var curFloodLevel = floodForecast[j].ActivityLevel,
                            curLandSlideLevel = landSlideForecast[j].ActivityLevel;

                        if (curFloodLevel > tempBiggestLevel){
                            tempBiggestLevel = curFloodLevel;
                        }
                        if (curLandSlideLevel > tempBiggestLevel){
                            tempBiggestLevel = curLandSlideLevel;
                        }

                        //Get day
                        var floodDate = new Date(floodForecast[j].ValidFrom);
                        var landDate = new Date(landSlideForecast[j].ValidFrom);
                        floodForecast[j].validDay = floodDate.getDay();
                        landSlideForecast[j].validDay = landDate.getDay();
                    }
                    county.maxLevel = tempBiggestLevel;
                });
            });
            return County.allCounties.$promise;
        };

        County.getById = function (countyId){
            return County.query({
                where: {'countyId':countyId}
            });
        };

        County.refreshAllCounties();

        return County;

    });