"use strict";
angular.module('Varsom', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'ionic.service.deploy', 'ngResource', 'ngCordova', 'ui-leaflet'])

    .controller('AppCtrl', function ($scope, $ionicHistory, $ionicSideMenuDelegate, Localization, Utility) {
        var appVm = this;

        appVm.util = Utility;

        $scope.$on('$ionicView.loaded', function () {
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
    .config(function ($stateProvider, $urlRouterProvider, $ionicAppProvider, $ionicConfigProvider, AppSettingsProvider, AppKeys, AreaProvider) {


        $ionicAppProvider.identify({
            app_id: AppKeys.ionic.appId,
            api_key: AppKeys.ionic.appKey
        });

        AppSettingsProvider.setParseApiHeader({
            "X-Parse-Application-Id": AppKeys.parse.appId,
            "X-Parse-REST-API-Key": AppKeys.parse.restKey
        });

        AreaProvider.setAppKey(AppKeys.appstax.appKey);

        if (ionic.Platform.isAndroid()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        $urlRouterProvider.otherwise('/areas/counties');

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'app/app.html',
                controller: 'AppCtrl as appVm'
            })
            .state('app.areas', {
                url: '/areas/:areaType?parentId',
                params: {
                    areaType: null,
                    parentId: null,
                    selectedId: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'app/areas/main.html',
                        controller: 'AreasMainCtrl as mainVm'
                    }

                },
                resolve: {
                    areas: function ($stateParams, $ionicLoading, Area) {
                        $ionicLoading.show();
                        return Area.getAreas($stateParams.areaType, $stateParams.parentId).then(function (areas) {
                            $ionicLoading.hide();
                            return areas;
                        });
                    }
                }
            })
            .state('app.municipality', {
                url: '/municipality/:municipalityId',
                params: {municipality: null},
                views: {
                    'menuContent': {
                        templateUrl: 'app/municipality/municipality.html',
                        controller: 'MunicipalityCtrl as vm'
                    }
                }
            })
            .state('app.municipalitydetail', {
                url: '/municipality/detail/:municipalityId?/:type?/:forecastNumber?',
                params: {forecast: null},
                views: {
                    'menuContent': {
                        templateUrl: 'app/municipality/detail/municipalitydetail.html',
                        controller: 'MunicipalityDetailCtrl as vm'
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
                url: '/avalancheregion/:regionId',
                params: {region: null},
                views: {
                    'menuContent': {
                        templateUrl: 'app/avalancheregion/avalancheregion.html',
                        controller: 'AvalancheRegionCtrl as vm'
                    }
                }
            })
            .state('app.avalancheregiondetail', {
                url: '/avalancheregion/detail/:regionId',
                params: {forecast: null},
                views: {
                    'menuContent': {
                        templateUrl: 'app/avalancheregion/detail/avalancheregiondetail.html',
                        controller: 'AvalancheRegionDetailCtrl as vm'
                    }
                }
            })
            .state('app.avalancheregionproblem', {
                url: '/avalancheregion/problem/:regionId',
                params: {problem: null},
                views: {
                    'menuContent': {
                        templateUrl: 'app/avalancheregion/problem/avalancheregionproblem.html',
                        controller: 'AvalancheRegionProblemCtrl as vm'
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

    .run(function ($ionicPlatform, $ionicAnalytics, $ionicUser, $ionicDeploy) {
        $ionicPlatform.ready(function () {

            var user = $ionicUser.get();
            if (!user.user_id) {
                // Set your user_id here, or generate a random one.
                user.user_id = $ionicUser.generateGUID();
            }
            $ionicUser.identify(user);

            $ionicDeploy.update().then(function (res) {
                console.log('Ionic Deploy: Update Success! ', res);
            }, function (err) {
                console.log('Ionic Deploy: Update error! ', err);
            }, function (prog) {
                console.log('Ionic Deploy: Progress... ', prog);
            });

            $ionicAnalytics.register();
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)*/
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
