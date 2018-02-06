function onJQueryLoad(){
    alert('from script');
    console.log($);
}

if(window.jQuery){
    onJQueryLoad();
}else{   
    var script = document.createElement('script'); 
    document.head.appendChild(script);  
    script.type = 'text/javascript';
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";

    script.onload = onJQueryLoad;
}

