"use strict";

angular.module('Varsom', ['ionic','ionic.service.core', 'ionic.service.analytics'])

    /**
     * State configuration
     */
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, AppKeys) {

        Parse.initialize(AppKeys['debug'].appId, appKeys['debug'].javascriptKey);

        if (ionic.Platform.isAndroid()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl as HomeModel'
            })
            .state('county', {
                url: '/county',
                params : { county: null },
                templateUrl: 'app/county/county.html',
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
