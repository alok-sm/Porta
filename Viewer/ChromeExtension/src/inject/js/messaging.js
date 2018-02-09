var sidebarMessageHandler = null;
var mainMessageHandler = null;

function sendMessageToSidebar(payload, callback){
    chrome.runtime.sendMessage({
        'to': 'sidebar', 
        'payload': payload
    }, function(response){
        debugger;
        console.log('function handler response', response)
        callback(response)
    });
}

function sendMessageToMain(payload, callback){
    chrome.runtime.sendMessage({
        'to': 'main', 
        'payload': payload
    }, function(response){
        // debugger;
        console.log('function handler response', response)
        callback(response)
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var response = null;
    if(message){
        if(mainMessageHandler && message.to === 'sidebar'){
            response = mainMessageHandler(message.payload);
        }
        if(sidebarMessageHandler && message.to === 'main'){
            response = sidebarMessageHandler(message.payload);
        }
    }
    sendResponse(response);
    return true;
});

function onMessageFromSidebar(handler){
    sidebarMessageHandler = handler;
}

function onMessageFromMain(handler){
    mainMessageHandler = handler;
}