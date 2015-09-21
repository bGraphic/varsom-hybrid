"use strict";

angular.module('Varsom', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ionic.service.deploy', 'ngResource'])

    /**
     * State configuration
     */
    .config(function($stateProvider, $urlRouterProvider, $ionicAppProvider, $ionicConfigProvider, AppSettingsProvider, AppKeys) {

        //Parse.initialize(AppKeys['debug'].appId, AppKeys['debug'].javascriptKey);

       /* $ionicAppProvider.identify({
            app_id: 'f11eace1',
            api_key: '2db186347847c5d1e3dacea7bd2d1cc5465980bf2cfff335'
        });*/

        AppSettingsProvider.setParseApiHeader({
            "X-Parse-Application-Id": AppKeys.debug.appId,
            "X-Parse-REST-API-Key": AppKeys.debug.restKey
        });

        if (ionic.Platform.isAndroid()) {
           // $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl as HomeModel'
            })
            .state('county', {
                url: '/county/:countyId',
                params : { county: null },
                templateUrl: 'app/county/county.html',
                controller: 'CountyCtrl as CountyModel'
            })
            .state('map', {
                url: '/map',
                templateUrl: 'app/map/map.html',
                controller: 'MapCtrl as MapModel'
            });

    })

    .run(function($ionicPlatform, $ionicAnalytics, $ionicUser, $ionicDeploy) {
        $ionicPlatform.ready(function() {

           /* var user = $ionicUser.get();
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
