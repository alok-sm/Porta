var TIMEOUT_MILLISECONDS = 500;
var scrollTimeout, mouseTimeout;

// Set up onPageLoad function
chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            onPageLoad();
        }
    }, 10);
});


// Set up all the listeners here
function onPageLoad(){
    // Set up the onMouseEnter event
    $('*').mouseover(function(event){
        if(mouseTimeout){
            clearTimeout(mouseTimeout)
        }
        mouseTimeout = setTimeout(function(){
            getMyTab(function(tab){
                onMouseEnter(
                    tab,
                    $(event.target).getPath()
                );
            });
        }, TIMEOUT_MILLISECONDS);

    });

    // Set up the onSelectionChange event
    $(document).mouseup(function(event){
        text = getSelectionText();
        if(text != null){
            getMyTab(function(tab){
                onSelectionChange(tab, text)
            });
        }
    })

    // Set up the onScrollEnd event
    $(window).scroll(function(){
        if(scrollTimeout){
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function(){
            getMyTab(function(tab){
                onScrollEnd(
                    tab, 
                    $(window).scrollTop()
                );
            });
        }, TIMEOUT_MILLISECONDS);
    });
}

// Handlers go below
function onMouseEnter(tab, cssPath){
    // console.log(tab,id, cssPath);
    api.log({
        eventType: 'mouseEnter',
        tabId: tab.id,
        cssPath: cssPath
    });
}

function onSelectionChange(tab, text){
    // console.log(tab,id, text);
    api.log({
        eventType: 'selectionChange',
        tabId: tab.id,
        text: text
    });
}

function onScrollEnd(tab, scroll){
    // console.log(tab,id, getScrollPercent(scroll));
    api.log({
        eventType: 'scrollEnd',
        tabId: tab.id,
        scroll: scroll,
        scrollPercent: getScrollPercent(scroll)
    });
}
