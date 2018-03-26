'use strict';

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
.controller('AggregateCtrl', function ($scope, $window, $http, $sce, $routeParams, visualizationHelper) {
    $scope.visualizationHelper = visualizationHelper;
    $scope.$sce = $sce;

    $scope.logNames = $routeParams.logNames.split(',');

    // debugger;
    
    var logColorsRaw = window.randomColor({
        format: 'rgb',
        count: $scope.logNames.length
    })

    $scope.logColors = {}

    for (var i = 0; i < logColorsRaw.length; i++) {
        $scope.logColors[$scope.logNames[i]] = logColorsRaw[i];
    }

    console.log($scope.logColors);

    function api(name, path){
        return `http://localhost:3000/${name}/${path}`;
    }

    function initialize(){
        $window.addEventListener('message', messageHandler); 
        $http.get(api($scope.logNames[0], 'url')).then(onGetUrl);
    }

    function onGetUrl(response){
        $scope.iframeSrc = response.data.url;
    }

    $scope.onIframeLoad = function(){
        sendMessageToMain({action: 'getHeight'});
    };

    function getLogs(){
        $scope.rawEvents = {};
        for (var i = 0; i < $scope.logNames.length; i++) {
            console.log(i)
            $http.get(api($scope.logNames[i], 'dump')).then(function(response){
                $scope.rawEvents[response.data.recording_name] = response.data.events;
                if(Object.keys($scope.rawEvents).length === $scope.logNames.length){
                    setupSlider()
                }
            });
        }
    }

    function setupSlider(){

        var maxSpatialSlider = document.body.scrollHeight - 50;
        $scope.spatialSliderValues = [0, maxSpatialSlider];
        var maxSlider = 10000;
        window.jQuery('#spatial-slider').slider({
            orientation: 'vertical',
            range: true,
            min: 0,
            max: maxSlider,
            values: [0, maxSlider],
            slide: function( event, ui ) {
                $scope.spatialSliderValues = [
                    Math.floor(maxSpatialSlider * (maxSlider - ui.values[1]) / maxSlider),
                    Math.ceil(maxSpatialSlider * (maxSlider - ui.values[0]) / maxSlider)
                ];

                waitAndRerender();
            }
        });
        var timer;

        function waitAndRerender(){
            if(timer){
                clearTimeout(timer);
            }
            timer = setTimeout(function(){
                renderVisualization();
            }, 200);
        }

        getBounds();
    }

    function getBounds(){
        $scope.eventDict = {};

        $scope.totalRawEvents = 0;
        $scope.totalBoundedEvents = 0;

        for(var logName in $scope.rawEvents){
            $scope.totalRawEvents += $scope.rawEvents[logName].length;
        }

        for(var logName in $scope.rawEvents){
            for (var i = 0; i < $scope.rawEvents[logName].length; i++) {
                var event = $scope.rawEvents[logName][i];
                event.logName = logName;
                sendMessageToMain({action: 'getBounds', data: event});
            }
        }
    }


    function messageHandler(event){
        if(event.data.namespace !== 'porta'){
            return;
        }

        if(event.data.action === 'setBounds'){
            var logEvent = event.data.message;
            $scope.totalBoundedEvents ++;
            if(!$scope.eventDict[logEvent.logName]){
                $scope.eventDict[logEvent.logName] = [];
            }
            $scope.eventDict[logEvent.logName].push(logEvent);

            if($scope.totalBoundedEvents === $scope.totalRawEvents){
                initializeVisualization();
            }
        }else if(event.data.action === 'setHeight'){
            $('iframe').css({height: event.data.message});
            getLogs();
        }   
    }

    function initializeVisualization(){
        $scope.events = [];
        for(var logName in $scope.eventDict){
            for (var i = 0; i < $scope.eventDict[logName].length; i++) {
                var tempEvent = $scope.eventDict[logName][i];
                tempEvent.logName = logName;
                $scope.events.push(tempEvent);
            }
        }

        $scope.rawEventTooltips = visualizationHelper.generateRawEventTooltips(
            $scope.events
        );

        $scope.eventCategories = [];
        $scope.eventNames = visualizationHelper.eventNames;
        for(var category in visualizationHelper.tooltipIconMapping){
            $scope.eventCategories.push([category, true]);
        }

        $scope.logNameStatuses = [];
        for(var i in $scope.logNames){
            $scope.logNameStatuses.push([$scope.logNames[i], true]);
        }
        renderVisualization();
    }

    function renderVisualization(async) {
        $scope.spatialPrimaryHeatmapBlocks = {};
        $scope.spatialSecondaryHeatmapBlocks = {};

        visualizationHelper.aggregate.spatial.calculateBlockRawValues(
            $scope.events, 
            $scope.logNameStatuses,
            $scope.spatialPrimaryHeatmapBlocks,
            $scope.spatialSecondaryHeatmapBlocks
        );

        $scope.spatialHeatmapBlocks = visualizationHelper.spatial.calculateHeatmapBlocks(
            $scope.spatialPrimaryHeatmapBlocks,
            $scope.spatialSecondaryHeatmapBlocks,
            $scope.spatialSliderValues
        );
        
        console.log($scope.rawEventTooltips);
        $scope.eventTooltips = visualizationHelper.aggregate.filterTooltips(
            $scope.rawEventTooltips, 
            $scope.spatialSliderValues,
            $scope.eventCategories,
            $scope.logNameStatuses
        );
        $scope.eventTooltips = visualizationHelper.spatial.aggregateTooltips(
            $scope.eventTooltips
        );

        console.log($scope.eventTooltips);

        if(async){
            $scope.$evalAsync();    
        }else{
            $scope.$apply();
        }
    }

    $scope.filterChange = function(){
        renderVisualization(true);
    };

    $scope.tooltipClick = function($event){
        var key = $event.currentTarget.attributes.key.value;
        // console.log(key);
        // console.log($scope.eventTooltips["" + key]);
        var events;

        for (var i = 0; i < $scope.eventTooltips.length; i++) {
            if($scope.eventTooltips[i][0] === key){
                events = $scope.eventTooltips[i][1];
            }
        }

        $scope.logEvents = events;
        console.log(events);
        $('#popupModal').modal()
    };

    $scope.eventClick = function($event){
        // var serializedEvent = $event.currentTarget.attributes.event.value;
        var logName = $event.currentTarget.attributes.logName.value;
        var index = $event.currentTarget.attributes.index.value;
        var message = '' + 
            '<center>' + 
                '<iframe ' + 
                    'id="popup-iframe" ' + 
                    `src="#!/popup?logName=${logName}&index=${index}" ` + 
                    'frameborder="no"></iframe>' + 
            '</center>';

        window.bootbox.dialog({
            onEscape: true,
            size: "large",
            message: message
        });
    }

    initialize();
});
