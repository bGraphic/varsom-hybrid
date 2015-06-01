// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
Parse.initialize(appKeys.appId, appKeys.javascriptKey);

angular.module('starter', ['ionic'])
    .controller('StartCtrl', function($scope,County){
        County.names.then(function(counties){
            $scope.counties = counties;
        });
    })

    .factory('County', function($q){
        var service = {};
        var County = Parse.Object.extend('County');
        var query = new Parse.Query(County);

        var names = $q.defer();
        service.names = names.promise;

        query.find({
            success: function (results) {
                console.log(results);
                var temp = [];

                for (var i = 0; i < results.length; i++) {
                    // Iteratoration for class object.
                    temp.push(results[i].get('name'));
                }
                names.resolve(temp);
            },
            error: function (error) {
                names.reject();
                alert("Error: " + error.code + " " + error.message);
            }
        });

        return service;
    })

    .run(function($ionicPlatform, $http) {
        $ionicPlatform.ready(function() {
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
