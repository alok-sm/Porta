'use strict';

angular.module('viewerApp')
.controller('PopupCtrl', function ($scope, $routeParams, $http) {
    var logName = $routeParams.logName;
    var index = parseInt($routeParams.index);

    $http.get(`http://localhost:3000/${logName}/event/${index}`)
    .then(function(response){
        $scope.event = response.data;
    });
});
