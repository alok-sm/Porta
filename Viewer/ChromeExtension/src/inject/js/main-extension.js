function mainOnLoad(){
    // console.log('main extension onLoad sending to sidebar', window.location.href);
    sendMessageToSidebar('hello sidebar!', function(response){
        console.log('sidebar replied', response)
    });

    // onMessageFromSidebar(function(payload){
    //     console.log('message from sidebar -', payload);
    //     return 'hello to you too, sidebar';
    // });
}

