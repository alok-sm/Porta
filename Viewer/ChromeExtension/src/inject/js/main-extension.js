function mainOnLoad(){}

function sendMessageToParent(message){
    window.top.postMessage(
        {message: message, namespace: 'porta'}, 
        window.top.location.href
    );
}

function getBounds(data){
    var bounds = $(data.cssPath)[0].getBoundingClientRect();
    data.bounds = {
        x: bounds.x,
        y: bounds.y,
        height: bounds.height,
        width: bounds.width
    }
    sendMessageToParent(data);
}

function onMessageFromSidebar(message){
    if(message.action === 'getBounds'){
        getBounds(message.data);
    }
}

window.addEventListener('message', function(event){
    if(event.source.location.href !== getContentWindow('porta-body').location.href){
        if(event.data.namespace === 'porta'){
            onMessageFromSidebar(event.data.message);
        }
    }
}, false);