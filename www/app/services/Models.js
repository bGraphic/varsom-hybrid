angular
    .module('Varsom')

    .service("FirebaseRef", function () {

        function areaRefString(areaType, areaId) {
            if (parseInt(areaId) < 10) {
                areaId = "0" + parseInt(areaId);
            }

            if ("municipalities" == areaType) {
                var countyId = areaId.substring(0, 2);
                return "municipalities/id" + countyId + "/id" + areaId;
            } else {
                return areaType + "/id" + areaId;
            }
        }

        var rootRef = firebase.database().ref();

        this.forecastRef = function (warningType, areaType, areaId) {
            var ref = rootRef.child("forecast/" + warningType);
            ref = ref.child(areaRefString(areaType, areaId));
            ref = ref.child("Forecast");
            return ref;
        }

        this.areaRef = function (areaType, areaId) {
            var ref = rootRef.child("areas");
            ref = ref.child(areaRefString(areaType, areaId));
            return ref;
        }

        this.areasRef = function (areaType, parentId) {
            var ref = rootRef.child("areas");

            if ("regions" == areaType) {
                ref = ref.child("/regions/");
            } else if (parentId) {
                ref = ref.child("/municipalities/id" + parentId);
            } else {
                ref = ref.child("/counties/");
            }

            return ref;
        }

        this.areaType = function (areaRef) {
            if (areaRef.parent.key.indexOf("id") < 0) {
                return areaRef.parent.key
            } else {
                return areaRef.parent.parent.key
            }
        }
    })

    .factory("Forecast", function ($firebaseObject, FirebaseRef, $firebaseArray) {

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
            var forecastRef = FirebaseRef.forecastRef(warningType, areaType, areaId);
            return new Forecast(forecastRef);
        }

    })

    .factory("Area", function ($firebaseObject, FirebaseRef, Forecast) {

        var Area = $firebaseObject.$extend({
            $$updated: function (snap, prevChildKey) {
                this.Id = snap.val().Id;
                this.Name = snap.val().Name;
                this.AreaType = FirebaseRef.areaType(snap.ref);

                if ("regions" == this.AreaType) {
                    this.Forecast = Forecast("avalanche", this.AreaType, this.Id);
                } else {
                    this.Forecast = Forecast("landslide", this.AreaType, this.Id);
                    this.LandslideForecast = Forecast("landslide", this.AreaType, this.Id);
                    this.FloodForecast = Forecast("flood", this.AreaType, this.Id);
                }
            }
        });

        return function (areaType, areaId) {
            var ref = FirebaseRef.areaRef(areaType, areaId);
            return new Area(ref);
        }

    })

    .factory("Areas", function ($firebaseArray, FirebaseRef, Area) {

        var Areas = $firebaseArray.$extend({
            $$added: function (snap, prevChildKey) {
                return Area(FirebaseRef.areaType(snap.ref), snap.val().Id);
            }
        });

        return function (areaType, parentId) {
            var ref = FirebaseRef.areasRef(areaType, parentId);
            return Areas(ref);
        }
    });