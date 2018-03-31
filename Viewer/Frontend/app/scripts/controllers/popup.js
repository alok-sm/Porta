'use strict';

angular.module('viewerApp')
.controller('PopupCtrl', function ($scope, $routeParams, $http) {
    var index = parseInt($routeParams.index);
    $scope.logName = $routeParams.logName;

    $http.get(`http://localhost:3000/${$scope.logName}/event/${index}`)
    .then(function(response){
        var event = response.data.event;
        var startTime = response.data.first.timestamp;
        $scope.event = event;

        if(event._eventType === 'videoPlay' || event._eventType === 'videoPause'){
            $scope.eventVideoOnPlay = function(){
                $('#eventVideo').get(0).currentTime = event.videoTime;
            }
        }

        $scope.screencastOnPlay = function(){
            var seekTime = event.timestamp - startTime - 20;
            seekTime = seekTime > 0? seekTime : 0;
            $('#screencast').get(0).currentTime = seekTime;
        }
    });
});
