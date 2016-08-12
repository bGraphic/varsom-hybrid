angular
    .module('Varsom')

    .factory("Forecast", function ($firebaseObject, $firebaseArray) {

        var Forecast = $firebaseObject.$extend({
            $$defaults: {
                'day0': {
                    ActivityLevel: 0
                },
                'day1': {
                    ActivityLevel: 0
                },
                'day2': {
                    ActivityLevel: 0
                }
            }
        });

        return function (warningType, areaType, areaId) {
            var forecastRef = firebase.database().ref("forecast/" + warningType + "/" + areaType + "/id" + areaId + "/Forecast")
            return new Forecast(forecastRef);
        }

    })

    /*    .factory("Area", function ($firebaseObject, $firebaseArray, Forecast) {

        var Area = function (areaType, areaId, areaName) {
            this.Id = areaId;
            this.Name = areaName;

            var forecastRef = firebase.database().ref("forecast");
            this.LandslideForcast = Forecast("landslide", areaType, areaId);
            this.FloodForcast = Forecast("flood", areaType, areaId);
        };

        return function (areaType, areaId, name) {
            return new Area(areaType, areaId, name);
        }

     })*/

    .factory("Areas", function ($firebaseObject, $firebaseArray, Forecast) {

        var Area = $firebaseObject.$extend({
            $$updated: function (snap, prevChildKey) {
                this.Id = snap.val().Id;
                this.Name = snap.val().Name;
                this.LandslideForcast = Forecast("landslide", snap.ref.parent.key, snap.val().Id);
                this.FloodForcast = Forecast("flood", snap.ref.parent.key, snap.val().Id);
            }
        });

        var Areas = $firebaseArray.$extend({
            $$added: function (snapshot, prevChildKey) {
                var values = snapshot.val();
                return Area(snapshot.ref);
            }
        });

        return function (areaType, parentId) {

            var ref = firebase.database().ref("areas");

            if ("region" == areaType) {
                ref = ref.child("/counties/");
            } else if (parentId) {
                ref = ref.child("/municipalities/id" + parentId);
            } else {
                ref = ref.child("/counties/");
            }

            return Areas(ref);
        }
    });