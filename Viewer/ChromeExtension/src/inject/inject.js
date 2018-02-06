function onLoad(){
    alert('hello');
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
    	if (document.readyState === "complete") {
    		clearInterval(readyStateCheckInterval);
            onLoad()
    	}
	}, 10);
});



// Old code

// function destroyOldArtifacts(){
//     for(var key in originalBgs){
//         var element = document.querySelector(key);
//         element.style["background-color"] = originalBgs[key]
//     }
//     for(var i in window.qTips){
//         $(window.qTips[i]).qtip('destroy', true);
//     }
//     window.qTips = []
// }

// function createHeatmap (cssSelector, alpha){
//     var element = document.querySelector(cssSelector);
//     window.originalBgs[cssSelector] = element.style["background-color"];
//     element.style["background-color"] = 'rgba(255, 0, 0, ' + alpha + ')';
// }

// function createErrorQtip(event) {
//     window.qTips.push(event.cssPath);
//     //hacks remove these
//     var parts = event.command[0].split('/');
//     event.command[0] = parts[parts.length - 1];
//     $(event.cssPath).qtip({
//         content: {
//             title: 'Error',
//             text: '<p><b>command: </b>' + event.command.join(" ") + '</p><p><b>return code: </b>'+ event.returnCode +'</p><p><b>stderr: </b>no such file or directory: "test.c"</p><p><b>Code</b><br/>Test.c: <pre>struct LinkedList{\n    int data;\n    struct LinkedList *next;\n };\n\ntypedef struct LinkedList *node; //Define node as pointer of data type struct LinkedList\n\nnode createNode(){\n    node temp; // declare a node\n    temp = (node)malloc(sizeof(struct LinkedList)); // allocate memory using malloc()\n    temp->next = NULL;// make next point to NULL\n    return temp;//return the new node\n}\n\nnode addNode(node head, int value){\n    node temp,p;// declare two nodes temp and p\n    temp = createNode();//createNode will return a new node with data = value and next pointing to NULL.\n    temp->data = value; // add element\'s value to data part of node\n    if(head == NULL){\n        head = temp;     //when linked list is empty\n    }\n    else{\n        p  = head;//assign head to p\n        while(p->next != NULL){\n            p = p->next;//traverse the list until p is the last node.The last node always points to NULL.\n        }\n        p->next = temp;//Point the previous last node to the new node created.\n    }\n    return head;\n}\n\nnode p;\np = head;\nwhile(p != NULL){\n    p = p->next;\n}</p>'
//         },
//         style: {
//         classes: 'qtip-orange qtip-shadow'
//     }
//     });
// }

// function createWarningQtip(event) {

// }

// function onLoad(){
//     window.originalBgs = {};
//     window.qTips = [];
//     setInterval(function () {
//        for(var i in window.qTips){
//            // $(window.qTips[i]).qtip('destroy', true);
//            $(window.qTips[i]).qtip('toggle', true);
//        }
//     });
//     setInterval(function(){
//         $.get('https://localhost:8000/get_overlay_params', function(data){
//             if(! data.changed){
//                 return
//             }

//             destroyOldArtifacts();
//             console.log(data.heatmap);
//             for (var key in data.heatmap) {
//                 if(!data.heatmap.hasOwnProperty(key)) continue;

//                 createHeatmap(key, data.heatmap[key])
//             }

//             for (var error in data.errors){
//                 if(!data.errors.hasOwnProperty(error)) continue;
//                 createErrorQtip(data.errors[error])
//             }

//             for (var warning in data.warnings){
//                 if(!data.warnings.hasOwnProperty(warning)) continue;
//                 createWarningQtip(data.warnings[warning])
//             }
//         });
//     }, 1000);
// }