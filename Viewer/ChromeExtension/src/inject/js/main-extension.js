function mainOnLoad(){

}

function sendMessageToSidebar(message){
    window.top.document.getElementById('porta-sidebar').contentWindow.postMessage(
        message, 
        window.top.document.getElementById('porta-sidebar').contentWindow.location.href
    );
}

function onMessageFromSidebar(data){
    var bounds = $(data.cssSelector)[0].getBoundingClientRect();
    data.bounds = {
        x: bounds.x,
        y: bounds.y,
        height: bounds.height,
        width: bounds.width
    }
    sendMessageToSidebar(data);
    // console.log(bounds);
}


window.addEventListener('message', function(event){
    if(event.source.location.href !== window.top.document.getElementById('porta-body').contentWindow.location.href){
        onMessageFromSidebar(event.data);
    }
}, false);