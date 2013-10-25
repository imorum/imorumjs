(function() {
    imorumjs.namespace("imorumjs.component");

    var $t = imorumjs.component.Box = function(id, name) {
        this.id = id;
        this.name = name;
    }

    $t.prototype = {
        width : 0,
        height : 0,
        getWidth : function() {

        },
        renderTo : function(parentElement){
            // i don't use imorumjs element yet
            var input = document.createElement("input");
            input.setAttribute("id", this.id);
            input.setAttribute("name", this.name);
            parentElement.appendChild(input);
        }
    }
})();