function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)){
        return decodeURIComponent(name[1]);
    }
}

function toolchainEvent(element){
    $('.navbar-brand').text('Compilation Error');
    $('.content').append('<h3>Command:</h3>');
    $('.content').append('<pre><code class="language-c">' + element.command.join(' ').replace('/Users/alok/.portaTemp/stubs', '') + '</code></pre>');
    $('.content').append('<h3>Files:</h3>')

    for (var key in element.files) {
        if (element.files.hasOwnProperty(key)) {           
            $('.content').append('<h4>' + key + '</h4>');
            $('.content').append('<pre><code class="language-c">' + element.files[key] + '</code></pre>');
        }
    }

}

function selectionChange(element){
    $('.navbar-brand').text('Copy to clipboard');
    $('.content').append('<h3>Copied Text:</h3>');
    $('.content').append('<pre><code class="language-c">' + element.text + '</code></pre>');
}

$(function(){
    var element = JSON.parse(get('element'));
    console.log(element);
    if(element._eventType === 'toolchainEvent'){
        toolchainEvent(element)
    }

    if(element._eventType === 'selectionChange'){
        selectionChange(element)
    }
});