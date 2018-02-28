jQuery.fn.extend({
    getPath: function () {
        var path = "",
            node = this;
        while (node.length) {
            var realNode = node[0],
                name = realNode.localName,
                id, classNameStr, currentNodeSelector;
            if (!name) {
                break;
            }
            currentNodeSelector = name.toLowerCase();
            id = realNode.id;
            if ( !! id) {
                currentNodeSelector = currentNodeSelector + "#" + id;
            }
            classNameStr = realNode.className;
            if ( !! classNameStr) {
                currentNodeSelector = currentNodeSelector + "." + classNameStr.split(/[\s\n]+/).join('.');
            }
            node = node.parent();
            path = ">" + currentNodeSelector + path;
        }
        return path.substr(1);
    }
});