'use strict';

angular.module('viewerApp')
.factory('visualizationHelper', function () {
    var helper = {
        nonActionableEvents: ['mouseEnter', 'scrollEnd'],
        tooltipIconMapping: {
            toolchainEvent:  'ok',
            selectionChange: 'copy',
            devtoolsOpen: 'wrench',
            newTab: 'new-window',
            commandExec: 'modal-window',
            toolchainError: 'remove',
            browserError: 'globe',
            videoPlay: 'play',
            videoPause: 'pause'
        },
        eventNames: {
            toolchainEvent:  'Tool chain',
            selectionChange: 'Clipboard',
            devtoolsOpen: 'Open Developer Tools',
            newTab: 'Open a new tab',
            commandExec: 'Terminal command',
            toolchainError: 'Tool chain error',
            browserError: 'Browser error',
            videoPlay: 'Video Play',
            videoPause: 'Video Pause'
        },
        spatial: {
            heatmapBlockHeight: 5,
            gaussianModel: window.gaussian(window.innerHeight/4, 20000)
        },
        temporal: {
            heatmapBlockWidth: 5,
            gaussianModel: window.gaussian(0, 400)
        },
        aggregate:{
            spatial:{}
        }
    };

    helper.spatial.createPrimaryHeatmapElement = function(event, primaryHeatmapBlocks){
        for(var i = 0; i < event.bounds.height; i += helper.spatial.heatmapBlockHeight){
            var y = Math.ceil((event.bounds.y + i) / helper.spatial.heatmapBlockHeight) * helper.spatial.heatmapBlockHeight;

            if(primaryHeatmapBlocks[y] !== undefined){
                primaryHeatmapBlocks[y] += 1;
            }else{
                primaryHeatmapBlocks[y] = 1;
            }
        }
    };

    helper.spatial.createSecondaryHeatmapElement = function(event, secondaryHeatmapBlocks){
        for(var i = 0; i < window.innerHeight; i += helper.spatial.heatmapBlockHeight){
            var y = Math.ceil((event.scroll + i) / helper.spatial.heatmapBlockHeight) * helper.spatial.heatmapBlockHeight;

            if(secondaryHeatmapBlocks[y] !== undefined){
                secondaryHeatmapBlocks[y] += helper.spatial.gaussianModel.pdf(i);
            }else{
                secondaryHeatmapBlocks[y] = helper.spatial.gaussianModel.pdf(i);
            }
        }
    };

    helper.spatial.calculateBlockRawValues = function(events, temporalRange, primaryHeatmapBlocks, secondaryHeatmapBlocks){
        var endTime = events[events.length - 1].timestamp;
        var startTime = events[0].timestamp;

        for(var i = 0; i < events.length; i++){
            var event = events[i];
            var timePx = document.body.scrollWidth * (event.timestamp - startTime) / (endTime - startTime);

            if(timePx < temporalRange[0] || temporalRange[1] < timePx){
                continue;
            }

            if(event._eventType === 'mouseEnter'){
                helper.spatial.createPrimaryHeatmapElement(event, primaryHeatmapBlocks);
            }else if(event._eventType === 'scrollEnd'){
                helper.spatial.createSecondaryHeatmapElement(event, secondaryHeatmapBlocks);
            }
        }
    };

    helper.getKeyWithMaxValue = function(obj, low, high){
        var maxVal = 0, maxKey;
        for(var key in obj){
            if(parseInt(key) < low || parseInt(key) > high){
                continue;
            }
            if(obj[key] > maxVal){
                maxVal = obj[key];
                maxKey = key;
            }
        }

        return maxKey;
    };

    helper.spatial.normalizeHeatmapIntensities = function(blocks, low, high){
        var newBlocks = {};
        var maxKey = helper.getKeyWithMaxValue(blocks, low, high);
        for(var key in blocks){
            newBlocks[key] = blocks[key] / blocks[maxKey];
        }
        return newBlocks;
    };

    helper.heatMapColorforValue = function(value){
      return `rgba(255, 0, 0, ${value})`
    };

    helper.spatial.calculateHeatmapBlocks = function(primaryHeatmapBlocks, secondaryHeatmapBlocks, spatialRange){
        var low = spatialRange[0];
        var high = spatialRange[1];
        primaryHeatmapBlocks = helper.spatial.normalizeHeatmapIntensities(primaryHeatmapBlocks, low, high);
        secondaryHeatmapBlocks = helper.spatial.normalizeHeatmapIntensities(secondaryHeatmapBlocks, low, high);
        var primaryScale = 0.6;
        var secondaryScale = 0.4;
        var totals = [];
        var finalBlocks = [];
        var blankPosition = Math.ceil(low / 10) * 10;

        for(var y = blankPosition; y < high; y += helper.spatial.heatmapBlockHeight){
            var primaryIntensity = primaryHeatmapBlocks[y];
            primaryIntensity = (!!primaryIntensity)? primaryIntensity: 0.0000000000000001;

            var secondaryIntensity = secondaryHeatmapBlocks[y];
            secondaryIntensity = (!!secondaryIntensity)? secondaryIntensity: 0.0000000000000001;

            var total = primaryScale * primaryIntensity + secondaryScale * secondaryIntensity;
            totals.push(total);
        }    

        var maxTotal = Math.max.apply(null, totals);
        var i = 0;

        for(y = 0; y < blankPosition; y += helper.spatial.heatmapBlockHeight){
            finalBlocks.push([y, 'rgb(255, 255, 255)']);
        }

        for(y = blankPosition; y < high; y += helper.spatial.heatmapBlockHeight){
            var color = helper.heatMapColorforValue(totals[i] / maxTotal);
            finalBlocks.push([y, color]);
            i++;
        }

        return finalBlocks;
    };

    helper.spatial.generateHeatmapStyleString = function(y, color){
        return  `top: ${y}px; ` + 
                `height: ${helper.spatial.heatmapBlockHeight}px; ` + 
                `background: ${color};`;
    };

    helper.temporal.generateHeatmapStyleString = function(y, color){
        return  `margin-left: ${y}px; ` + 
                `width: ${helper.temporal.heatmapBlockWidth}px; ` + 
                `background: ${color};`;
    };

    helper.generateRawEventTooltips = function(events){
        var endTime = events[events.length - 1].timestamp;
        var startTime = events[0].timestamp;
        var toolTips = [];

        for(var i = 0; i < events.length; i++){
            if(helper.nonActionableEvents.includes(events[i]._eventType)){
                continue;
            }

            // debugger;

            toolTips.push({
                text: helper.eventNames[events[i]._eventType],
                event: events[i],
                x: document.body.scrollWidth * (events[i].timestamp - startTime) / (endTime - startTime),
                y: events[i].bounds.y + (events[i].bounds.height - 20) / 2,
                icon: helper.tooltipIconMapping[events[i]._eventType]
            });
        }



        return toolTips;
    };

    helper.filterTooltips = function(toolTips, spatialRange, temporalRange, eventCategoriesArray){
        var eventCategories = {};

        for (var i = 0; i < eventCategoriesArray.length; i++) {
            var category = eventCategoriesArray[i];
            eventCategories[category[0]] = category[1];
        }
        // debugger;
        var filtered = [];

        for (i = 0; i < toolTips.length; i++) {
            var toolTip = toolTips[i];

            if(toolTip.event._eventType === 'commandExec'){
                if(toolTip.event.command.startsWith('gcc') || toolTip.event.command.startsWith('javac') || toolTip.event.command.startsWith('python')){
                    continue
                }
            }

            if(toolTip.event._eventType === 'newTab'){
                if(toolTip.event.url.startsWith('chrome')){
                    continue;
                }
            }

            if(! eventCategories[toolTip.event._eventType]){
                continue;
            }

            if(toolTip.x < temporalRange[0] || temporalRange[1] < toolTip.x){
                continue;
            }

            if(toolTip.y < spatialRange[0] || spatialRange[1] < toolTip.y){
                continue;
            }

            filtered.push(toolTip);
        }

        return filtered;
    };

    helper.temporal.calculateHeatmapBlocks = function(events, eventTooltips, range){
        var lastEventTime = events[events.length - 1].timestamp;
        var firstEventTime = events[0].timestamp;

        var positions = [];

        for(var i = 0; i < eventTooltips.length; i++){

            var tooltipPosition = document.body.scrollWidth * (eventTooltips[i].event.timestamp - firstEventTime) / (lastEventTime - firstEventTime);

            if(range[0] <= tooltipPosition && tooltipPosition <= range[1]){
                positions.push(tooltipPosition);    
            }
        }

        var heatmapBlocks = {};

        for(var x = 0; x < document.body.scrollWidth; x += helper.temporal.heatmapBlockWidth){
            heatmapBlocks[x] = 0;
        }

        for (i = 0; i < positions.length; i++) {
            for(x = 0; x < document.body.scrollWidth; x += helper.temporal.heatmapBlockWidth){
                heatmapBlocks[x] += helper.temporal.gaussianModel.pdf(x - positions[i]);
            }
        }
 
        var blocks = [];
        var maxKey = helper.getKeyWithMaxValue(heatmapBlocks);

        for(var key in heatmapBlocks){
            if(range[0] <= key && key <= range[1]){
                var value = heatmapBlocks[key] / heatmapBlocks[maxKey];
                blocks.push([key, helper.heatMapColorforValue(value)]);
            }else{
                blocks.push([key, 'rgb(255, 255, 255)']);
            }
        }

        return blocks;
    };

    helper.aggregate.spatial.calculateBlockRawValues = function (events, logNameStatuses, primaryHeatmapBlocks, secondaryHeatmapBlocks) {
        var logNameViz = {};
        for (var i = 0; i < logNameStatuses.length; i++) {
            logNameViz[logNameStatuses[i][0]] = logNameStatuses[i][1];
        }
        for(var i = 0; i < events.length; i++){
            
            if(!logNameViz[events[i].logName]){
                continue;
            }
            var event = events[i];
            if(event._eventType === 'mouseEnter'){
                helper.spatial.createPrimaryHeatmapElement(event, primaryHeatmapBlocks);
            }else if(event._eventType === 'scrollEnd'){
                helper.spatial.createSecondaryHeatmapElement(event, secondaryHeatmapBlocks);
            }
        }
    }

    helper.aggregate.filterTooltips = function(toolTips, spatialRange, eventCategoriesArray, logNameStatuses){
        // debugger;
        var eventCategories = {};
        for (var i = 0; i < eventCategoriesArray.length; i++) {
            var category = eventCategoriesArray[i];
            eventCategories[category[0]] = category[1];
        }
        // lol

        var logNameViz = {};

        for (var i = 0; i < logNameStatuses.length; i++) {
            logNameViz[logNameStatuses[i][0]] = logNameStatuses[i][1];
        }

        var filtered = [];

        for (i = 0; i < toolTips.length; i++) {
            var toolTip = toolTips[i];

            if(toolTip.event._eventType === 'newTab'){
                if(toolTip.event.url.startsWith('chrome')){
                    continue;
                }
            }

            if(toolTip.event._eventType === 'commandExec'){
                if(toolTip.event.command.startsWith('gcc') || toolTip.event.command.startsWith('javac') || toolTip.event.command.startsWith('python')){
                    continue
                }
            }

            if(! eventCategories[toolTip.event._eventType]){
                continue;
            }

             if(! logNameViz[toolTip.event.logName]){
                continue;
            }

            if(toolTip.y < spatialRange[0] || spatialRange[1] < toolTip.y){
                continue;
            }

            filtered.push(toolTip);
        }

        return filtered;
    }

    helper.spatial.aggregateTooltips = function(tooltips){
        // console.log(tooltips)
        // debugger;
        var aggregationsDict = {}
        var aggregations = []

        for (var i = 0; i < tooltips.length; i++) {
            var tip = tooltips[i]
            if(!aggregationsDict[tip.y]){
                aggregationsDict[tip.y] = [];
            }
            aggregationsDict[tip.y].push(tip);
        }

        for(var y in aggregationsDict){
            aggregations.push([y, aggregationsDict[y]]);
        }
        return aggregations;
    }

    return helper;
});
