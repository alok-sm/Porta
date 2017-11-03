var api = {endpoint: 'http://localhost:8000/browser_log'};

api.log = function(data) {
    data.timestamp = (new Date()).getTime() / 1000;
    // $.post(api.endpoint, JSON.stringify(data));
    $.ajax(api.endpoint, {
        data : JSON.stringify(data),
        contentType : 'application/json',
        type : 'POST',
    })
}