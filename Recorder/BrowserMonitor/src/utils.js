function getSelectionText() {
    var text = null;
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if(text == ""){
        return null;
    }
    return text;
}

function getMyTab(callback){
    callBackgroundScript('getMyTab', null, callback);
}

function getScrollPercent(scroll){
    return 100 * scroll / ($(document).height() - $(window).height());
}

function callBackgroundScript(name, data, callback){
    chrome.runtime.sendMessage({name: name, data: data}, callback);
}