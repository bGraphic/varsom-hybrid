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

                    if(!floodForecast){
                        floodForecast = [{ActivityLevel: 0},{ActivityLevel: 0},{ActivityLevel: 0}];
                    }

                    var totalBiggestLevel = -1;

                    county.maxLevels = [];

                    for (var j = 0; j < floodForecast.length; j++) {
                        var curFloodLevel = floodForecast[j].ActivityLevel,
                            curLandSlideLevel = landSlideForecast[j].ActivityLevel;

                        if (curFloodLevel > totalBiggestLevel){
                            totalBiggestLevel = curFloodLevel;
                        }
                        if (curLandSlideLevel > totalBiggestLevel){
                            totalBiggestLevel = curLandSlideLevel;
                        }

                        county.maxLevels.push(Math.max(curFloodLevel,curLandSlideLevel));

                    }
                    county.maxLevel = totalBiggestLevel;
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