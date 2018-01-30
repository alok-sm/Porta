function executeScript(script){
    chrome.tabs.query({active: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {code: script});
    });
}

function setBounds(low, high){
    $("#amount").val( low + "s" + " - " + high + "s");
    $.get('https://localhost:8000/set_bounds', {
        start: window.portaStartTime + low,
        end: window.portaStartTime + high
    });
}

function getBoundsCallback(range){
    window.portaStartTime = range[0]
    var diff = Math.round(range[1] - range[0]);
    setBounds(0, diff);

    $("#slider-range").slider({
        range: true,
        min: 0,
        max: diff,
        values: [0, diff],
        slide: function( event, ui ) {
            setBounds(ui.values[0], ui.values[1]);
        }
    });
}

$(function(){
    chrome.tabs.query({active: true}, function(tabs) {
        var url = new URL(tabs[0].url)
        var portaTutorial = url.searchParams.get('portaTutorial');
        if(portaTutorial){
            $("#placeholder").hide();
            $.get('https://localhost:8000/get_bounds', getBoundsCallback);
        }else{
            $("#slider").hide();
        }
    });

    // setInterval(function(){
    //     console.log('sending messages');
    //     for (var key in window.heatmapData) {
    //         chrome.extension.sendMessage({
    //             type: 'createHeatmap',
    //             cssSelector: key,
    //             alpha : window.heatmapData[key]
    //         });
    //     }
    // }, 1000)
});
