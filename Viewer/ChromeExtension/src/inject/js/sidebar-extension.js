var elementsWithBounds = [];
var elements = null;

function createHeatmapElement(element){
    $('body').append(
        '<div class="heatmap-block" style="top: ' + 
        element.bounds.y + 
        'px; height: ' + 
        element.bounds.height + 
        'px"></div>'
    );
}

function createPopupElement(element, type){
    var top = element.bounds.y + (element.bounds.height - 20) / 2
    $('body').append(
        '<img element="' + 
        escape(JSON.stringify(element)) + 
        '" src="http://localhost:3000/static/icons/' +
        type + '.png" class="popup-anchor" style="top: ' + 
        top + 'px; height: 20px"></div>'
    );
}

// function createPopupWindow(url, title) {
    
//     var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
//     var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
//     width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
//     height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

//     var left = ((width / 2) - (w / 2)) + dualScreenLeft;
//     var top = ((height / 2) - (h / 2)) + dualScreenTop;
//     var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

//     if (window.focus) {
//         newWindow.focus();
//     }
// }

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
            createHeatmapElement(element);
        }else if(element._eventType === 'toolchainEvent'){
            createPopupElement(element, 'error');
        }else if(element._eventType === 'selectionChange'){
            createPopupElement(element, 'clipboard');
        }
    }

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
    // console.log(elements);
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
