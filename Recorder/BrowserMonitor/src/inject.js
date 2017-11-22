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
            onMouseEnter($(event.target).getPath());
        }, TIMEOUT_MILLISECONDS);

    });

    // Set up the onSelectionChange event
    $(document).mouseup(function(event){
        text = getSelectionText();
        if(text != null){
            onSelectionChange(text)
        }
    })

    // Set up the onScrollEnd event
    $(window).scroll(function(){
        if(scrollTimeout){
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function(){
            onScrollEnd($(window).scrollTop());
        }, TIMEOUT_MILLISECONDS);
    });

    // Set up the onDevtoolsOpen event
    window.addEventListener('devtoolschange', function (event) {
        if(event.detail.open){
            onDevtoolsOpen();
        }
    });
}

// Handlers go below
function onMouseEnter(cssPath){
    api.logFromInjectionScript({
        _eventType: 'mouseEnter',
        cssPath: cssPath
    });
}

function onSelectionChange(text){
    api.logFromInjectionScript({
        _eventType: 'selectionChange',
        text: text
    });
}

function onScrollEnd(scroll){
    api.logFromInjectionScript({
        _eventType: 'scrollEnd',
        scroll: scroll,
        scrollPercent: getScrollPercent(scroll)
    });
}

function onDevtoolsOpen(){
    api.logFromInjectionScript({
        _eventType: 'devtoolsOpen'
    })
}

console.log('hello');