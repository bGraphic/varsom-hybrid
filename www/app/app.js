"use strict";
angular.module('Varsom', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ionic.service.deploy', 'ngResource'])

    .controller('AppCtrl', function($scope, $ionicHistory, $ionicSideMenuDelegate, Localization){
        var appVm = this;

        $scope.$on('$ionicView.loaded', function() {
            appVm.text = Localization.getTranslations();

            appVm.gotoSettings = function () {
                $ionicSideMenuDelegate.toggleRight();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

            };
        });

        $scope.$on('varsom.translations.changed', function () {
            appVm.text = Localization.getTranslations();
            $ionicHistory.clearCache();
        });

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

        $urlRouterProvider.otherwise('/app/counties');
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/app.html',
                controller: 'AppCtrl as appVm'
            })
            .state('app.counties', {
                url: '/counties',
                views: {
                    'menuContent': {
                        templateUrl: 'app/counties/counties.html',
                        controller: 'CountiesCtrl as vm'
                    }
                }

            })
            .state('app.county', {
                url: '/county/:countyId',
                params : { county: null },
                views: {
                    'menuContent': {
                        templateUrl: 'app/county/county.html',
                        controller: 'CountyCtrl as vm'
                    }
                }
            })
            .state('app.municipality', {
                url: '/municipality/:municipalityId',
                params : { municipality: null },
                views: {
                    'menuContent': {
                        templateUrl: 'app/municipality/municipality.html',
                        controller: 'MunicipalityCtrl as vm'
                    }
                }
            })
            .state('app.countymap', {
                url: '/countymap',
                views: {
                    'menuContent': {
                        templateUrl: 'app/countymap/countymap.html',
                        controller: 'CountyMapCtrl as vm'
                    }
                }
            })
            .state('app.avalancheregions', {
                url: '/avalancheregions',
                views: {
                    'menuContent': {
                        templateUrl: 'app/avalancheregions/avalancheregions.html',
                        controller: 'AvalancheRegionsCtrl as vm'
                    }
                }
            })
            .state('app.avalancheregion', {
                url: '/avalancheregion',
                params : { region: null },
                views: {
                    'menuContent': {
                        templateUrl: 'app/avalancheregion/avalancheregion.html',
                        controller: 'AvalancheRegionCtrl as vm'
                    }
                }
            })
            .state('app.avalanchemap', {
                url: '/avalanchemap',
                views: {
                    'menuContent': {
                        templateUrl: 'app/avalanchemap/avalanchemap.html',
                        controller: 'AvalancheMapCtrl as vm'
                    }
                }
            })
            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'app/settings/settings.html',
                        controller: 'SettingsCtrl as vm'
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
