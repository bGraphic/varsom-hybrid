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
