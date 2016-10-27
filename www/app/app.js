/*global angular, ionic, console, cordova, StatusBar */

angular.module('Varsom', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'ionic.service.deploy', 'ngResource', 'ngCordova', 'ui-leaflet', 'firebase']);

angular.module('Varsom')
  .controller('AppCtrl', function ($scope, $ionicHistory, $ionicSideMenuDelegate, Localization, Utility) {
    "use strict";

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

  });

angular.module('Varsom')
  .config(function ($stateProvider, $urlRouterProvider, $ionicAppProvider, $ionicConfigProvider, AppKeys) {
    "use strict";

    $ionicAppProvider.identify({
      app_id: AppKeys.ionic.appId,
      api_key: AppKeys.ionic.appKey
    });

    $ionicConfigProvider.backButton.previousTitleText(false);

    $urlRouterProvider.otherwise('/areas/counties');

    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'app/app.html',
        controller: 'AppCtrl as appVm'
      })
      .state('app.areas', {
        /* Url: /areas/counties for flood and landslide
         * Url: /areas/municipalities for flood and landslide for a specified county (use parentId)
         * Url: /areas/regions for avalanche
         */
        url: '/areas/:areaType',
        params: {
          parentId: null
        },
        views: {
          'menuContent@app': {
            templateUrl: 'app/areas/main.html',
            controller: 'AreasMainCtrl as vm'
          }
        },
        resolve: {
          areas: function ($stateParams, $ionicLoading, Areas) {
            $ionicLoading.show();
            console.log("Get areas ", $stateParams.areaType, $stateParams.parentId);
            return Areas($stateParams.areaType, $stateParams.parentId).$loaded().then(function (areas) {
              $ionicLoading.hide();
              return areas;
            });
          },
          parentArea: function ($stateParams, Area) {
            if ($stateParams.parentId) {
              return Area("counties", $stateParams.parentId).$loaded();
            }
          }
        }
      })
      .state('app.municipality', {
        url: '/areas/municipality/:areaId',
        views: {
          'menuContent': {
            templateUrl: 'app/municipality/municipality.html',
            controller: 'MunicipalityCtrl as vm'
          }
        },
        resolve: {
          municipality: function ($stateParams, $ionicLoading, Area) {
            $ionicLoading.show();
            return Area("municipalities", $stateParams.areaId).$loaded().then(function (area) {
              $ionicLoading.hide();
              return area;
            });
          }
        }
      })
      .state('app.municipality.detail', {
        url: '/:forecastType/:day',
        params: {
          forecast: null
        },
        views: {
          'menuContent@app': {
            templateUrl: 'app/municipality/detail/municipality-detail.html',
            controller: 'MunicipalityDetailCtrl as vm'
          }
        }
      })
      .state('app.region', {
        url: '/areas/region/:areaId',
        views: {
          'menuContent': {
            templateUrl: 'app/avalancheregion/avalancheregion.html',
            controller: 'AvalancheRegionCtrl as vm'
          }
        },
        resolve: {
          region: function ($stateParams, $ionicLoading, Area) {
            $ionicLoading.show();
            return Area("regions", $stateParams.areaId).$loaded().then(function (area) {
              $ionicLoading.hide();
              return area;
            });
          }
        }
      })
      .state('app.region.detail', {
        url: '/:day',
        views: {
          'menuContent@app': {
            templateUrl: 'app/avalancheregion/detail/avalancheregion-detail.html',
            controller: 'AvalancheRegionDetailCtrl as vm'
          }
        }
      })
      .state('app.region.problem', {
        url: '/:day',
        views: {
          'menuContent@app': {
            templateUrl: 'app/avalancheregion/problem/avalancheregion-problem.html',
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

  });

angular.module('Varsom')
  .run(function ($ionicPlatform, $ionicAnalytics, $ionicUser, $ionicDeploy) {
    "use strict";

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
