function getContentWindow(frameId){
    return window.top.document.getElementById(frameId).contentWindow;
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


function onIframeLoad(){
    if(isInFrameWithId('porta-sidebar') && sidebarOnLoad){
        sidebarOnLoad();
    }

    if(isInFrameWithId('porta-body') && mainOnLoad){
        mainOnLoad();
    }

    if(isInFrameWithId('porta-bottombar') && bottombarOnLoad){
        bottombarOnLoad();
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
            getContentWindow('porta-body').location.href !== 'about:blank' &&
            iframeIsLoaded('porta-sidebar')){
                onIframeLoad();
                clearInterval(readyStateCheckInterval);
        }
    }, 100);
});



