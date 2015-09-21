/**
 * Created by storskel on 03.06.2015.
 */
angular
    .module('Varsom')
    .factory('Municipality', function Municipality($resource, AppSettings) {
        console.log('Creating municipality');

        var Municipality = $resource(AppSettings.getParseClassUrl('Municipality'), {}, {
            get: {
                headers: AppSettings.getParseHeader()
            },
            query: {
                headers:AppSettings.getParseHeader(),
                params: {
                    where: '@where',
                    order: 'name',
                    include:''
                }
            }
        });

        Municipality.listAllForCounty = function (countyId) {
            return Municipality.query({
                where: {'countyId': countyId}
            });
        };

        return Municipality;

    });