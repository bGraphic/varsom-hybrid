"use strict";

angular.module('Varsom', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ionic.service.deploy', 'ngResource'])

    .controller('AppCtrl', function(){

    })

    /**
     * State configuration
     */
    .config(function($stateProvider, $urlRouterProvider, $ionicAppProvider, $ionicConfigProvider, AppSettingsProvider, AppKeys) {

        $ionicAppProvider.identify({
            app_id: 'f11eace1',
            api_key: '2db186347847c5d1e3dacea7bd2d1cc5465980bf2cfff335'
        });

        AppSettingsProvider.setParseApiHeader({
            "X-Parse-Application-Id": AppKeys.debug.appId,
            "X-Parse-REST-API-Key": AppKeys.debug.restKey
        });

        if (ionic.Platform.isAndroid()) {
           $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        $urlRouterProvider.otherwise('/app/landslide');
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/app.html',
                controller: 'AppCtrl as AppModel'
            })
            .state('app.landslide', {
                url: '/landslide',
                views: {
                    'menuContent': {
                        templateUrl: 'app/home/home.html',
                        controller: 'HomeCtrl as HomeModel'
                    }
                }

            })
            .state('app.county', {
                url: '/county/:countyId',
                params : { county: null },
                views: {
                    'menuContent': {
                        templateUrl: 'app/county/county.html',
                        controller: 'CountyCtrl as CountyModel'
                    }
                }
            })
            .state('app.map', {
                url: '/map',
                views: {
                    'menuContent': {
                        templateUrl: 'app/map/map.html',
                        controller: 'MapCtrl as MapModel'
                    }
                }
            });

    })

    .run(function($ionicPlatform, $ionicAnalytics, $ionicUser, $ionicDeploy) {
        $ionicPlatform.ready(function() {

            var user = $ionicUser.get();
            if(!user.user_id) {
                // Set your user_id here, or generate a random one.
                user.user_id = $ionicUser.generateGUID();
            }
            $ionicUser.identify(user);

            $ionicDeploy.update().then(function(res) {
                console.log('Ionic Deploy: Update Success! ', res);
            }, function(err) {
                console.log('Ionic Deploy: Update error! ', err);
            }, function(prog) {
                console.log('Ionic Deploy: Progress... ', prog);
            });

            $ionicAnalytics.register();
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)*/
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
