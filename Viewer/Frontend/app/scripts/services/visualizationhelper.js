'use strict';

angular.module('viewerApp')
.factory('visualizationHelper', function () {
    var helper = {
        nonActionableEvents: ['mouseEnter', 'scrollEnd'],
        tooltipIconMapping: {
            toolchainEvent:  '/images/icons/error.png',
            selectionChange: '/images/icons/clipboard.png',
            devtoolsOpen: '/images/icons/clipboard.png',
            tabsChange: '/images/icons/clipboard.png'
        },
        spatial: {
            heatmapBlockHeight: 10,
            gaussianModel: window.gaussian(window.innerHeight/4, 20000)
        },
        temporal: {
            heatmapBlockWidth: 10,
            gaussianModel: window.gaussian(0, 20000)
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

    helper.spatial.calculateBlockRawValues = function(events, primaryHeatmapBlocks, secondaryHeatmapBlocks){
        for(var i = 0; i < events.length; i++){
            if(events[i]._eventType === 'mouseEnter'){
                helper.spatial.createPrimaryHeatmapElement(events[i], primaryHeatmapBlocks);
            }else if(events[i]._eventType === 'scrollEnd'){
                helper.spatial.createSecondaryHeatmapElement(events[i], secondaryHeatmapBlocks);
            }
        }
    };

    helper.getKeyWithMaxValue = function(obj, low, high){
        var maxVal = 0, maxKey;
        for(var key in obj){
            if(key < low || key > high){
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
      return `hsla(${(1.0 - value) * 240}, 100%, 50%, 0.7)`;
    };

    helper.spatial.calculateHeatmapBlocks = function(primaryHeatmapBlocks, secondaryHeatmapBlocks, low, high){
        primaryHeatmapBlocks = helper.spatial.normalizeHeatmapIntensities(primaryHeatmapBlocks, low, high);
        secondaryHeatmapBlocks = helper.spatial.normalizeHeatmapIntensities(secondaryHeatmapBlocks, low, high);
        var primaryScale = 0.6;
        var secondaryScale = 0.4;
        var totals = [];
        var finalBlocks = [];

        for(var y = low; y < high; y += helper.spatial.heatmapBlockHeight){
            var primaryIntensity = primaryHeatmapBlocks[y];
            primaryIntensity = (primaryIntensity === undefined)? 0: primaryIntensity;

            var secondaryIntensity = secondaryHeatmapBlocks[y];
            secondaryIntensity = (secondaryIntensity === undefined)? 0: secondaryIntensity;
            var total = primaryScale * primaryIntensity + secondaryScale * secondaryIntensity;
            totals.push(total);
        }    

        var maxTotal = Math.max.apply(null, totals);
        var i = 0;

        for(y = low; y < high; y += helper.spatial.heatmapBlockHeight){
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
                `background: ${color};`
    };

    helper.generateRawEventTooltips = function(events){
        var endTime = events[events.length - 1].timestamp;
        var startTime = events[0].timestamp;
        var toolTips = [];

        for(var i = 0; i < events.length; i++){
            if(helper.nonActionableEvents.includes(events[i]._eventType)){
                continue;
            }

            toolTips.push({
                event: window.encodeURI(JSON.stringify(events[i])),
                x: document.body.scrollWidth * (events[i].timestamp - startTime) / (endTime - startTime),
                y: events[i].bounds.y + (events[i].bounds.height - 20) / 2,
                icon: helper.tooltipIconMapping[events[i]._eventType]
            });
        }

        return toolTips;
    };

    helper.filterTooltips = function(toolTips, startPositionSlider, endPositionSlider, startTimeSlider, endTimeSlider){
        return toolTips;
    };

    helper.temporal.calculateBlockRawValues = function(events){
        var endTime = events[events.length - 1].timestamp;
        var startTime = events[0].timestamp;

        var positions = []

        for(var i = 0; i < events.length; i++){
            if(helper.nonActionableEvents.includes(events[i]._eventType)){
                continue;
            }
            positions.push(
                document.body.scrollWidth * (events[i].timestamp - startTime) / (endTime - startTime)
            );
        }

        var heatmapBlocks = {}

        for (var i = 0; i < positions.length; i++) {

            for(var x = 0; x < document.body.scrollWidth; x += helper.temporal.heatmapBlockWidth){
                var heatmapIncrement = helper.temporal.gaussianModel.pdf(x - positions[i]);

                if(heatmapBlocks[x] !== undefined){
                    heatmapBlocks[x] += heatmapIncrement;
                }else{
                    heatmapBlocks[x] =  heatmapIncrement;
                }
            }
        }

        return heatmapBlocks;
    }

    helper.temporal.calculateHeatmapBlocks = function(heatmapBlocks, startTime, endTime){
        var blocks = [];
        var maxKey = helper.getKeyWithMaxValue(heatmapBlocks);

        for(var key in heatmapBlocks){
            var value = heatmapBlocks[key] / heatmapBlocks[maxKey]
            blocks.push([key, helper.heatMapColorforValue(value)]);
        }

        return blocks;
    }

    return helper;
});
