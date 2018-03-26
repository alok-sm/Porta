function getContentWindow(frameId){
    // return window.top.document.getElementById(frameId).contentWindow;
    try {
        var contentWindow = window.top.document.getElementById(frameId).contentWindow;
        return contentWindow;
    }
    catch(err) {
        return null;
    }

}

function isInFrameWithId(id){
    var idIframeHref = getContentWindow(id).location.href;
    return window.location.href === idIframeHref;
}

function iframeIsLoaded(id) {
    try{
        var iframe = window.top.document.getElementById(id);
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        return iframeDoc.readyState  == 'complete'    
    }
    catch(e){
        return false;
    }
    
}

function inIframe () {
    try {
        var stat = window.self !== window.top;
        return stat;
    } catch (e) {
        return true;
    }
}

chrome.extension.sendMessage({ignore: true}, function(response) {
    if(!inIframe()){
        return;
    }
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === 'complete' &&
            iframeIsLoaded('porta-body') && 
            getContentWindow('porta-body').location.href !== 'about:blank'){
                if(isInFrameWithId('porta-body') && mainOnLoad){
                    mainOnLoad();
                }
                clearInterval(readyStateCheckInterval);
        }
    }, 1000);
});

