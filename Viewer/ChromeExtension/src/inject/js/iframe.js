function onLoad(){
    if(window.location.href === window.top.document.getElementById('porta-sidebar').contentWindow.location.href){
        if(sidebarOnLoad){
            sidebarOnLoad();    
        }
    }

    if(window.location.href === window.top.document.getElementById('porta-body').contentWindow.location.href){
        if(mainOnLoad){
            mainOnLoad();
        }
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
    if(inIframe()){
        var readyStateCheckInterval = setInterval(function() {
            if (document.readyState === 'complete') {
                clearInterval(readyStateCheckInterval);
                onLoad()
            }
        }, 100);
    }
});
