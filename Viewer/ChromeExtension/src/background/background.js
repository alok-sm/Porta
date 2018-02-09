chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(!message.ignore){
        console.log('background recieved', message);
        chrome.tabs.query({}, function(tabs){
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, message, function(response){
                    if(response){
                        console.log(response);
                        sendResponse(response);
                        return true;
                    }
                }); 
            }
        });
    }
    sendResponse(null);
    return true;
});
