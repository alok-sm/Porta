function sidebarOnLoad(){
    // console.log('sidebar extension onLoad. sending to main', window.location.href);
    // sendMessageToMain('hello main!', function(response){
    //     console.log('main replied', response)
    // });

    onMessageFromMain(function(payload){
        console.log('message from main -', payload);
        return 'hello to you too main!';
    });
}
