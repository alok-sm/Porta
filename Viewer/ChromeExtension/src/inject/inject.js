function destroyOldArtifacts(){
    for(var key in originalBgs){
        var element = document.querySelector(key);
        element.style["background-color"] = originalBgs[key]
    }
    for(var i in window.qTips){
        $(window.qTips[i]).qtip('destroy', true);
    }
    window.qTips = []
}

function createHeatmap (cssSelector, alpha){
    var element = document.querySelector(cssSelector);
    window.originalBgs[cssSelector] = element.style["background-color"];
    element.style["background-color"] = 'rgba(255, 0, 0, ' + alpha + ')';
}

function createErrorQtip(event) {
    window.qTips.push(event.cssPath);
    //hacks remove these
    var parts = event.command[0].split('/');
    event.command[0] = parts[parts.length - 1];
    $(event.cssPath).qtip({
        content: {
            title: 'Error',
            text: '<p><b>command: </b>' + event.command.join(" ") + '</p><p><b>return code: </b>'+ event.returnCode +'</p><p><b>stderr: </b>no such file or directory: "test.c"</p>'
        },
        style: {
        classes: 'qtip-red qtip-shadow'
    }
    });
}

function createWarningQtip(event) {

}

function onLoad(){
    window.originalBgs = {};
    window.qTips = [];
    setInterval(function () {
       for(var i in window.qTips){
           // $(window.qTips[i]).qtip('destroy', true);
           $(window.qTips[i]).qtip('toggle', true);
       }
    });
    setInterval(function(){
        $.get('https://localhost:8000/get_overlay_params', function(data){
            if(! data.changed){
                return
            }

            destroyOldArtifacts();
            console.log(data.heatmap);
            for (var key in data.heatmap) {
                if(!data.heatmap.hasOwnProperty(key)) continue;

                createHeatmap(key, data.heatmap[key])
            }

            for (var error in data.errors){
                if(!data.errors.hasOwnProperty(error)) continue;
                createErrorQtip(data.errors[error])
            }

            for (var warning in data.warnings){
                if(!data.warnings.hasOwnProperty(warning)) continue;
                createWarningQtip(data.warnings[warning])
            }
        });
    }, 1000);
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
    	if (document.readyState === "complete") {
    		clearInterval(readyStateCheckInterval);
            onLoad()
    	}
	}, 10);
});