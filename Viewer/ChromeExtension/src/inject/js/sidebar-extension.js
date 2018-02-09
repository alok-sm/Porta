function onLoad(){
    console.log('from sidebar extension');
}

chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            onLoad()
        }
    }, 10);
});
