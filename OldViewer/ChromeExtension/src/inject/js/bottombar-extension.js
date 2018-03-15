function bottombarOnLoad(){}

function sendMessageToSidebar(message){
    getContentWindow('porta-sidebar').postMessage(
        {message: message, namespace: 'porta', to:'sidebar'}, 
        getContentWindow('porta-sidebar').location.href
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
    sendMessageToSidebar(data);
}

function onMessageFromSidebar(message){
    if(message.action === 'getBounds'){
        getBounds(message.data);
    }
}

window.addEventListener('message', function(event){
    if(event.source.location.href !== getContentWindow('porta-body').location.href){
        if(event.data.namespace === 'porta' && event.data.to === 'main'){
            onMessageFromSidebar(event.data.message);
        }
    }
}, false);