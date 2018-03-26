function mainOnLoad(){}

function sendMessageToParent(action, message){
    window.top.postMessage(
        {message: message, action: action, namespace: 'porta'}, 
        window.top.location.href
    );
}

function getBounds(data){
    // debugger;
    var bounds = $(data.cssPath)
    bounds = bounds.get(0)
    bounds = bounds.getBoundingClientRect();
    data.bounds = {
        x: bounds.x,
        y: bounds.y,
        height: bounds.height,
        width: bounds.width
    }
    sendMessageToParent('setBounds', data);
}

function onMessageFromSidebar(message){
    if(message.action === 'getBounds'){
        getBounds(message.data);
    }else if(message.action === 'getHeight'){
        sendMessageToParent('setHeight', document.body.scrollHeight);
    }
}

window.addEventListener('message', function(event){
    var contentWindow = getContentWindow('porta-body');
    if(!contentWindow){
        return;
    }
    
    if(event.source.location.href !== getContentWindow('porta-body').location.href){
        if(event.data.namespace === 'porta'){
            onMessageFromSidebar(event.data.message);
        }
    }
}, false);