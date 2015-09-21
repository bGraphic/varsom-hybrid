/**
 * County Parse model
 */

angular
    .module('Varsom')
    .factory('County', function County($resource, AppSettings) {

        var County = $resource(AppSettings.getParseClassUrl('County'), {}, {
            get: {
                headers: AppSettings.getParseHeader()
            },
            query: {
                headers:AppSettings.getParseHeader(),
                params: {
                    where: '@where',
                    order: '-countyId',
                    include:'LandSlideWarningForecast,FloodWarningForecast'
                }
            }
        });

        County.allCounties = County.query(function() {
            County.allCounties.results.forEach(function(county){

                var floodForecast = county.FloodWarningForecast,
                    landSlideForecast = county.LandSlideWarningForecast;

                var tempBiggestLevel = -1;

                for (var j = floodForecast.length; j--;) {
                    var curFloodLevel = floodForecast[j].activityLevel,
                        curLandSlideLevel = landSlideForecast[j].activityLevel;

                    if (curFloodLevel > tempBiggestLevel)
                        tempBiggestLevel = curFloodLevel;
                    if (curLandSlideLevel > tempBiggestLevel)
                        tempBiggestLevel = curLandSlideLevel;
                }
                county.maxLevel = tempBiggestLevel;
            });
        });

        County.getById = function (countyId){
            return County.query({
                where: {'countyId':countyId}
            });
        };


        return County;

    });