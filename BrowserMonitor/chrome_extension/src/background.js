chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request === 'getAllTabs'){
            chrome.tabs.query({}, sendResponse);
        }else if(request === 'getMyTab'){
            sendResponse(sender.tab);   
        }else{
            sendResponse(null);
        }
    }
);

chrome.tabs.onUpdated.addListener(function() {
    chrome.tabs.query({}, function(tabs){
        for (var i = 0; i < tabs.length; i++) {
            if(tabs[i].status !== 'complete'){
                return;
            }
        }
        onTabsChange(tabs);
    });
});

chrome.tabs.onRemoved.addListener(function(){
    chrome.tabs.query({}, onTabsChange);
})

function onTabsChange(native_tabs){
    tabs = [];
    for (var i = 0; i < native_tabs.length; i++) {
        var ith_tab = native_tabs[i];
        tabs.push({
            id: ith_tab.id,
            url: ith_tab.url
        })
    }
    api.log({
        eventType: 'tabsChange',
        tabs: tabs
    })
}