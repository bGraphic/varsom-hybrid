/**
 * Created by storskel on 11.06.2015.
 */
var appKeys = {
    debug: {
        "appId": "gLFbkh8oDB900BUnL8VNoxscpIoKCcfVCvS3iDff",
        "javascriptKey": "T4DNE3ptpMqt5xzZwYwXynqMxBfr8jSn2qciPQRZ"
    }
};
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var env = "debug";
Parse.initialize(appKeys[env].appId, appKeys[env].javascriptKey);

angular.module('Varsom', ['ionic','ionic.service.core', 'ionic.service.analytics'])

    /**
     * State configuration
     */
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        if (ionic.Platform.isAndroid()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl as HomeModel'
            })
            .state('county', {
                url: '/county',
                params : { county: null },
                templateUrl: 'county/county.html',
                controller: 'CountyCtrl as CountyModel'
            });

    })

    .run(function($ionicPlatform, $ionicAnalytics) {
        $ionicPlatform.ready(function() {
            //$ionicAnalytics.register();
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .controller('CountyCtrl', CountyCtrl);

    function CountyCtrl($stateParams){
        var model = this;

        model.county = $stateParams.county;
        //$scope.county = $stateParams.county;
        console.log(model.county);
    }
})();
/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .directive('leafletMap', LeafletMap);

    function LeafletMap(County, $http, $state, $timeout){
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elem, attrs){
            elem.css('height', '480px');

            var map = L.map(elem[0], {
                center: [64.871, 16.949],
                zoom: 4
            });

            var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png');

            var styles = {
                '0': {
                    weight: 3,
                    color: '#C8C8C8',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '1': {
                    weight: 3,
                    color: '#75B100',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '2': {
                    weight: 3,
                    color: '#FFCC33',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '3': {
                    weight: 3,
                    color: '#E46900',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '4': {
                    weight: 3,
                    color: '#D21523',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                '5': {
                    weight: 3,
                    color: '#3E060B',
                    dashArray: '',
                    fillOpacity: 0.7
                },
                clicked: {
                    weight: 3,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                }
            };

            map.addLayer(layer);

            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            if (map.tap) map.tap.disable();

            County.countiesLoaded.then(function(counties){
                counties.forEach(function(county){
                    $http.get(county.geojson, {cache: true})
                        .success(function(data){
                            L.geoJson(data, {
                                onEachFeature: function (feature, layer) {
                                    layer.setStyle(styles[county.forecasts.maxLevel]);
                                    layer.on('click', function(event){
                                        $state.go('county', {countyName: county.name});
                                        layer.setStyle(styles.clicked);

                                        $timeout(function(){
                                            layer.setStyle(styles[county.forecasts.maxLevel]);
                                        }, 500);
                                    });
                                }
                            }).addTo(map);
                        });
                });
            });
        }
    }
})();
/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl(County){
        var HomeModel = this;

        County.countiesLoaded.then(function(counties){
            console.log(counties);
            HomeModel.counties = counties;
        });
    }
})();
/**
 * Created by storskel on 03.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .factory('County', County);

    function County($q) {
        var service = {};
        var County = Parse.Object.extend('County');
        var query = new Parse.Query(County);
        query.include('FloodWarningForecast');
        query.include('LandSlideWarningForecast');

        var countiesDeferred = $q.defer();
        service.countiesLoaded = countiesDeferred.promise;

        query.find({
            success: function (results) {
                var countyArray = [];

                for (var i = 0; i < results.length; i++) {
                    // Iteratoration for class object.
                    var obj = {
                        name: results[i].get('name'),
                        geojson: results[i].get('geoJSONmin').url(),
                        forecasts: {
                            flood: results[i].get('FloodWarningForecast'),
                            landslide: results[i].get('LandSlideWarningForecast')
                        }
                    };
                    var tempBiggestLevel = -1;

                    for(var j = obj.forecasts.flood.length; j--;){
                        if(obj.forecasts.flood[j].attributes.activityLevel > tempBiggestLevel)
                            tempBiggestLevel = obj.forecasts.flood[j].attributes.activityLevel;
                        if(obj.forecasts.landslide[j].attributes.activityLevel > tempBiggestLevel)
                            tempBiggestLevel = obj.forecasts.landslide[j].attributes.activityLevel;
                    }

                    obj.forecasts.maxLevel = tempBiggestLevel;

                    countyArray.push(obj);
                }
                countiesDeferred.resolve(countyArray);
            },
            error: function (error) {
                countiesDeferred.reject();
                alert("Error: " + error.code + " " + error.message);
            }
        });

        return service;
    }
})();
/**
 * Created by storskel on 11.06.2015.
 */
(function() {
    'use strict';

    angular
        .module('Varsom')
        .factory('LocalStorage', LocalStorage);

    function LocalStorage($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }
})();
angular.module("Varsom").run(["$templateCache", function($templateCache) {$templateCache.put("county/county.html","<ion-view title=\"{{CountyModel.county.name}}\"><ion-content>{{CountyModel.county.name}}</ion-content></ion-view>");
$templateCache.put("home/home.html","<ion-view title=\"Varsom\"><ion-content><div leaflet-map=\"\"></div><ion-list><ion-item ng-repeat=\"county in ::HomeModel.counties\" ui-sref=\"county({county:county})\">{{::county.name}}</ion-item></ion-list></ion-content></ion-view>");}]);