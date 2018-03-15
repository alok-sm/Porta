'use strict';

function api(path){
    return 'http://localhost:3000' + path;
}

function getContentWindow(frameId){
    return window.top.document.getElementById(frameId).contentWindow;
}

function sendMessageToMain(message){
    getContentWindow('porta-body').postMessage(
        {message: message, namespace: 'porta', to: 'main'}, 
        getContentWindow('porta-body').location.href
    );
}

angular.module('viewerApp')
.controller('MainCtrl', function ($scope, $window, $http, $sce, visualizationHelper){
    $scope.gaussianModel = window.gaussian(window.innerHeight/2, 20000);
    $scope.visualizationHelper = visualizationHelper;
    $scope.$sce = $sce;

    function initialize(){
        $window.addEventListener('message', messageHandler); 
        $http.get(api('/url')).then(onGetUrl);
    }

    function onGetUrl(response){
        $scope.iframeSrc = response.data.url;
    }

    $scope.onIframeLoad = function(){
        window.iFrameResize();
        $http.get(api('/log')).then(onGetLog);
    };

    function onGetLog(response){
        // subtract 50 for bottom bar height
        $scope.endPositionSlider = document.body.scrollHeight - 50;
        $scope.startPositionSlider = 0;

        $scope.endTimeSlider = document.body.scrollWidth;
        $scope.startTimeSlider = 0;

        $scope.rawEvents = response.data;
        getBounds();
    }

    function getBounds(){
        $scope.events = [];
        for(var i = 0; i < $scope.rawEvents.length; i++){
            sendMessageToMain({action: 'getBounds', data: $scope.rawEvents[i]});
        }
    }

    function messageHandler(event){
        if(event.data.namespace !== 'porta'){
            return;
        }
        $scope.events.push(event.data.message);

        if($scope.events.length === $scope.rawEvents.length){
            initializeVisualization();
        }
    }

    function initializeVisualization(){
        $scope.positionalPrimaryHeatmapBlocks = {};
        $scope.positionalSecondaryHeatmapBlocks = {};

        visualizationHelper.spatial.calculateBlockRawValues(
            $scope.events, 
            $scope.gaussianModel,
            $scope.positionalPrimaryHeatmapBlocks,
            $scope.positionalSecondaryHeatmapBlocks
        );

        $scope.rawEventTooltips = visualizationHelper.generateRawEventTooltips(
            $scope.events
        );

        console.log($scope.rawEventTooltips);

        renderVisualization();
    }

    function renderVisualization(){
        $scope.positionalHeatmapBlocks = visualizationHelper.spatial.calculateHeatmapBlocks(
            $scope.positionalPrimaryHeatmapBlocks,
            $scope.positionalSecondaryHeatmapBlocks,
            $scope.startPositionSlider,
            $scope.endPositionSlider
        );

        $scope.eventTooltips = visualizationHelper.filterTooltips(
            $scope.rawEventTooltips, 
            $scope.startPositionSlider, 
            $scope.endPositionSlider,
            $scope.startTimeSlider,
            $scope.endTimeSlider
        );

        $scope.$apply();
    }

    initialize();
});


