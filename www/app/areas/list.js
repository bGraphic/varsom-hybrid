angular
    .module('Varsom.Areas')
    .controller('AreasListCtrl', function ($scope, $ionicLoading, areas) {
        this.areas = areas;
    });