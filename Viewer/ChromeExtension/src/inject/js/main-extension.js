function onLoad(){
    console.log('from main extension');
}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

chrome.extension.sendMessage({}, function(response) {
    if(inIframe()){
        var readyStateCheckInterval = setInterval(function() {
            if (document.readyState === "complete") {
                clearInterval(readyStateCheckInterval);
                onLoad()
            }
        }, 10);        
    }
});
