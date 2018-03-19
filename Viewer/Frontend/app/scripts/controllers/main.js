'use strict';

function api(path){
    return 'http://localhost:3000/' + path;
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
    $scope.visualizationHelper = visualizationHelper;
    $scope.$sce = $sce;

    function initialize(){
        $window.addEventListener('message', messageHandler); 
        $http.get(api('url')).then(onGetUrl);
    }

    function onGetUrl(response){
        $scope.iframeSrc = response.data.url;
    }

    $scope.onIframeLoad = function(){
        window.iFrameResize();
        $http.get(api('log')).then(onGetLog);
    };

    function onGetLog(response){
        // subtract 50 for bottom bar height
        var maxSpatialSlider = document.body.scrollHeight - 50;
        var maxTemporalSlider = document.body.scrollWidth;

        $scope.spatialSliderValues = [0, maxSpatialSlider];
        $scope.temporalSliderValues = [0, maxTemporalSlider];

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

        window.jQuery('#temporal-slider').slider({
            range: true,
            min: 0,
            max: maxSlider,
            values: [0, maxSlider],
            slide: function( event, ui ) {
                $scope.temporalSliderValues = [
                    Math.floor(maxTemporalSlider * (ui.values[0]) / maxSlider),
                    Math.ceil(maxTemporalSlider * (ui.values[1]) / maxSlider)
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
        $scope.rawEventTooltips = visualizationHelper.generateRawEventTooltips(
            $scope.events
        );

        $scope.eventCategories = [];

        $scope.eventNames = visualizationHelper.eventNames;

        for(var category in visualizationHelper.tooltipIconMapping){
            $scope.eventCategories.push([category, true]);
        }

        renderVisualization();
    }

    function renderVisualization(async){
        $scope.spatialPrimaryHeatmapBlocks = {};
        $scope.spatialSecondaryHeatmapBlocks = {};

        visualizationHelper.spatial.calculateBlockRawValues(
            $scope.events, 
            $scope.temporalSliderValues,
            $scope.spatialPrimaryHeatmapBlocks,
            $scope.spatialSecondaryHeatmapBlocks
        );

        $scope.spatialHeatmapBlocks = visualizationHelper.spatial.calculateHeatmapBlocks(
            $scope.spatialPrimaryHeatmapBlocks,
            $scope.spatialSecondaryHeatmapBlocks,
            $scope.spatialSliderValues
        );

        $scope.eventTooltips = visualizationHelper.filterTooltips(
            $scope.rawEventTooltips, 
            $scope.spatialSliderValues,
            $scope.temporalSliderValues,
            $scope.eventCategories
        );

        $scope.temporalHeatmapBlocks = visualizationHelper.temporal.calculateHeatmapBlocks(
            $scope.events,
            $scope.eventTooltips,
            $scope.temporalSliderValues
        );

        if(async){
            $scope.$evalAsync();    
        }else{
            $scope.$apply();
        }
    }

    $scope.categoryChange = function(){
        renderVisualization(true);
    };

    $scope.tooltipClick = function($event){
        var serializedEvent = $event.currentTarget.attributes.event.value;
        var message = '' + 
            '<center>' + 
                '<iframe ' + 
                    'id="popup-iframe" ' + 
                    `src="#!/popup?event=${serializedEvent}" ` + 
                    'frameborder="no"></iframe>' + 
            '</center>';

        window.bootbox.dialog({
            onEscape: true,
            size: "large",
            message: message
        });
    };

    initialize();
});


