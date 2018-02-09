function onLoad(){
    var href = window.location.href;
    if(href === 'http://localhost:3000/static/sidebar/index.html'){
        sidebarOnLoad();
    }else{
        mainOnLoad();
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
        }, 10);        
    }
});
