var api = {endpoint: 'http://localhost:8000/log'};

api.logFromBackgroundScript = function(data) {
    data.timestamp = (new Date()).getTime() / 1000;
    $.ajax(api.endpoint, {
        data : JSON.stringify(data),
        contentType : 'application/json',
        type : 'POST'
    })
};

api.logFromInjectionScript = function(data){
    callBackgroundScript('log', data, null);
};

