var elementsWithBounds = []
var elements = [
    {
        action: 'heatmap',
        cssSelector: 'h1'
    }, 
    {
        action: 'heatmap',
        cssSelector: 'div'
    },
    {
        action: 'heatmap',
        cssSelector: 'p:nth-of-type(2)'
    }, 
    {
        action: 'error',
        cssSelector: 'p:nth-of-type(2)'
    }
];

function createHeatmapElement(element){
    $('body').append('<div class="heatmap-block" style="top: ' + element.bounds.y + 'px; height: ' + element.bounds.height + 'px"></div>');
}

function createErrorElement(element){

}

function renderSidebar(){
    for (var i = 0; i < elementsWithBounds.length; i++) {
        var element = elementsWithBounds[i]
        if(element.action === 'heatmap'){
            createHeatmapElement(element);
        }else if(element.action === 'error'){
            createErrorElement(element);
        }
    }
}

function sidebarOnLoad(){
    for (var i = 0; i < elements.length; i++) {
        sendMessageToMain(elements[i]);
    }
}

function sendMessageToMain(message){
    window.top.document.getElementById('porta-body').contentWindow.postMessage(
        message, 
        window.top.document.getElementById('porta-body').contentWindow.location.href
    );
}

function onMessageFromMain(data){
    elementsWithBounds.push(data);
    if(elementsWithBounds.length === elements.length){
        renderSidebar();
    }
}

window.addEventListener('message', function(event){
    if(event.source.location.href !== window.top.document.getElementById('porta-sidebar').contentWindow.location.href){
        onMessageFromMain(event.data);    
    }
}, false);