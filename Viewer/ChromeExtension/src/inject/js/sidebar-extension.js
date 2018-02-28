var elementsWithBounds = [];
var elements = null;

var heatmapBlockHeight = 10;

var primaryHeatmapBlocks = {};
var secondaryHeatmapBlocks = {};

var TIMEOUT_MILLISECONDS = 500;
var sliderSteps = 100000;

function getSlideLow(){
    var rawLow = sliderSteps - $('#slider').slider("values", 1);
    return Math.floor(rawLow * window.innerHeight / sliderSteps / 10) * 10;
}

function getSlideHigh(){

    var rawHigh = sliderSteps - $('#slider').slider("values", 0);
    return Math.ceil(rawHigh * window.innerHeight / sliderSteps / 10) * 10;
}


function createHeatmapElement(top, height, r, g, b, a){
    var classStr = 'porta-element heatmap-block';
    var colorStr = 'rgba('+r+','+g+','+b+','+a+')'
    var styleStr = 'top:' + top + 'px;' + 'height:' + height + 'px;' + 'background:' + colorStr + ';';

    $('body').append(
        '<div class="' + classStr + '" style="' + styleStr + '"></div>'
    );
}

function getKeyWithMaxValue(obj){
    var maxVal = 0;
    var maxKey = undefined;
    for(key in obj){
        if(key < getSlideLow() || key > getSlideHigh()){
            continue;
        }
        if(obj[key] > maxVal){
            maxVal = obj[key];
            maxKey = key;
        }
    }

    return maxKey;
}

function normalizeHeatmapIntensities(blocks){
    var newBlocks = {}
    var maxKey = getKeyWithMaxValue(blocks);
    for (key in blocks) {

        

        newBlocks[key] = blocks[key] / blocks[maxKey];
    }
    return newBlocks
}

function renderHeatmap(){
    $('.heatmap-block').remove();
    primaryHeatmapBlocks = normalizeHeatmapIntensities(primaryHeatmapBlocks)
    secondaryHeatmapBlocks = normalizeHeatmapIntensities(secondaryHeatmapBlocks)
    var primaryIntensity, secondaryIntensity;
    var primaryScale = 0.5
    var secondaryScale = 0.7

    for (var y = getSlideLow(); y < getSlideHigh(); y += heatmapBlockHeight) {
        // console.log(y)
        primaryIntensity = primaryHeatmapBlocks[y];
        primaryIntensity = (primaryIntensity === undefined)? 0: primaryIntensity;

        secondaryIntensity = secondaryHeatmapBlocks[y];
        secondaryIntensity = (secondaryIntensity === undefined)? 0: secondaryIntensity;

        createHeatmapElement(y, heatmapBlockHeight, 255, 0, 0, primaryIntensity * primaryScale);
        createHeatmapElement(y, heatmapBlockHeight, 0, 255, 0, secondaryIntensity * secondaryScale);
    }
}

function createPrimaryHeatmapElement(element){
    for (var i = 0; i < element.bounds.height; i += heatmapBlockHeight) {
        var y = Math.ceil((element.bounds.y + i) / heatmapBlockHeight) * heatmapBlockHeight;

        if(primaryHeatmapBlocks[y] !== undefined){
            primaryHeatmapBlocks[y] += 1
        }else{
            primaryHeatmapBlocks[y] = 1
        }
    }
}

function createSecondaryHeatmapElement(element){
    var variance = 20000;
    var gaussModel = gaussian(parent.window.innerHeight/2, variance);

    for (var i = 0; i < parent.window.innerHeight; i += heatmapBlockHeight) {
        var y = Math.ceil((element.scroll + i) / heatmapBlockHeight) * heatmapBlockHeight;

        if(secondaryHeatmapBlocks[y] !== undefined){
            secondaryHeatmapBlocks[y] += gaussModel.pdf(i)
        }else{
            secondaryHeatmapBlocks[y] = gaussModel.pdf(i)
        }
    }
}

function createPopupElement(element, type){
    var top = element.bounds.y + (element.bounds.height - 20) / 2
    $('body').append(
        '<img element="' + 
        escape(JSON.stringify(element)) + 
        '" src="http://localhost:3000/static/icons/' +
        type + '.png" class="popup-anchor porta-element" style="top: ' + 
        top + 'px;"></div>'
    );
}

function createPopupWindow(url, title) {
    var w = 1000, h = 600;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}


function onAnchorElementClick(){
    createPopupWindow(
        'http://localhost:3000/static/popup/index.html?element=' + $(this).attr('element'),
        'Porta'
    );
}

function renderSidebar(){

    for (var i = 0; i < elementsWithBounds.length; i++) {
        var element = elementsWithBounds[i]
        if(element._eventType === 'mouseEnter'){
            createPrimaryHeatmapElement(element);
        }else if(element._eventType === 'scrollEnd'){
            createSecondaryHeatmapElement(element);
        }else if(element._eventType === 'toolchainEvent'){
            createPopupElement(element, 'error');
        }else if(element._eventType === 'selectionChange'){
            createPopupElement(element, 'clipboard');
        }
    }

    $("#slider").slider({
        orientation: 'vertical',
        range: true,
        min: 0,
        max: sliderSteps,
        values: [0, sliderSteps]
    });

    setInterval(function(){
        $('#slider').css({'margin-top':8 , 'height': window.innerHeight - 16})
        renderHeatmap()
    }, TIMEOUT_MILLISECONDS);

    $('.popup-anchor').click(onAnchorElementClick);
}

function sendMessageToMain(message){
    getContentWindow('porta-body').postMessage(
        {message: message, namespace: 'porta'}, 
        getContentWindow('porta-body').location.href
    );
}

function onMessageFromMain(message){
    elementsWithBounds.push(message);
    if(elementsWithBounds.length === elements.length){
        renderSidebar();
    }
}

window.addEventListener('message', function(event){
    if(event.source.location.href !== getContentWindow('porta-sidebar').location.href){
        if(event.data.namespace && event.data.namespace === 'porta'){
            onMessageFromMain(event.data.message);
        }
    }
}, false);

function onLogLoad(log){
    if(!log){
        return;
    }

    elements = log;

    for (var i = 0; i < elements.length; i++) {
        sendMessageToMain({action: 'getBounds', data: elements[i]});
    }
}

function sidebarOnLoad(){
    $.get('http://localhost:3000/log', onLogLoad);
}
