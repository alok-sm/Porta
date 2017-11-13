messageFunctions = {
    'getAllTabs': function(message, sender, sendResponse){
        chrome.tabs.query({}, sendResponse);
    },
    'getMyTab': function(message, sender, sendResponse){
        sendResponse(sender.tab);
    },
    'log': function(message, sender, sendResponse){
        data = message.data;
        data.tab = {
            id: sender.tab.id,
            url: sender.tab.url
        }
        api.logFromBackgroundScript(data);
    }
}

chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (!message.name || !messageFunctions[message.name]){
            sendResponse(null);
        }else{
            messageFunctions[message.name](message, sender, sendResponse);
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
    api.logFromBackgroundScript({
        _eventType: 'tabsChange',
        tabs: tabs
    })
}