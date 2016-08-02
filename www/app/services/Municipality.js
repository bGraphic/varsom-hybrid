/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .factory('Municipality', function Municipality($resource, Utility, AppSettings) {
        console.log('Creating municipality');

        var Municipality = $resource(AppSettings.getParseClassUrl('Municipality'), {}, {
            get: {
                headers: AppSettings.getParseHeader()
            },
            query: {
                headers: AppSettings.getParseHeader(),
                params: {
                    where: '@where',
                    order: 'name',
                    include: 'LandSlideWarningForecast,FloodWarningForecast'
                },
                transformResponse: function (data, headersGetter) {
                    var json = angular.fromJson(data);

                    if (angular.isArray(json.results)) {
                        var arr = json.results;
                        for (var i = 0; i < arr.length; i++) {
                            var floodWarnings = Utility.chooseLanguage(arr[i].floodWarningForecast);
                            var landslideWarnings = Utility.chooseLanguage(arr[i].landslideWarningForecast);
                            if (!floodWarnings) {
                                floodWarnings = [{ActivityLevel: 0}, {ActivityLevel: 0}, {ActivityLevel: 0}];
                            }
                            if (!landslideWarnings) {
                                landslideWarnings = [{ActivityLevel: 0}, {ActivityLevel: 0}, {ActivityLevel: 0}];
                            }
                            arr[i].maxLevel = Math.max(
                                floodWarnings[0].ActivityLevel,
                                floodWarnings[1].ActivityLevel,
                                floodWarnings[2].ActivityLevel,
                                landslideWarnings[0].ActivityLevel,
                                landslideWarnings[1].ActivityLevel,
                                landslideWarnings[2].ActivityLevel
                            );

                            arr[i].maxLevels = [
                                Math.max(floodWarnings[0].ActivityLevel, landslideWarnings[0].ActivityLevel),
                                Math.max(floodWarnings[1].ActivityLevel, landslideWarnings[1].ActivityLevel),
                                Math.max(floodWarnings[2].ActivityLevel, landslideWarnings[2].ActivityLevel)
                            ];

                        }
                    }

                    console.log(json);
                    return json;
                }
            }
        });

        Municipality.listAllForCounty = function (countyId) {
            return Municipality.query({
                where: {'countyId': countyId}
            });
        };

        Municipality.getById = function (municipalityId) {
            return Municipality.get({
                where: {'municipalityId': municipalityId}
            });
        };

        return Municipality;

    });