angular
    .module('Varsom')
    .controller('AreasListCtrl', function ($scope, $ionicLoading, areas) {
        this.areas = areas;
    });