// Use this or not? hmmmmmm,
// i may maintain this for compatibility purposes

(function() {
    imorumjs.namespace("imorumjs.dom");

    var $t = imorumjs.dom.Element = function(tagName) {
        this.tagName = tagName;
    }

    $t.fromElement = function(element){
        // TODO: iterate element and build the mirror Element
    }

    $t.prototype = {
        domElement : null,
        // prerendered variables only, not used if dom element have been created
        children : [],
        attributes : [],
        classes : [],
        styles : [],

        // will generate a DOM structure for this and its descendants and insert it to the actual DOM Element
        insertTo : function(domElement){
        },

        addChild : function(element){
            this.children.push(element);
        },

        removeChild : function(element){
            imorumjs.data.removeByReference(this.children, element);
        },

        getAttribute : function(attributeName){
            var atts = this.attributes;
            for(var i=0; i<atts.length; i++) {
                if(atts[i].name == attributeName) {
                    return atts[i].value;
                }
            }
        },

        setAttribute : function(attributeName, value){
            if(attributeName == 'class'){
                throw 'use class setter instead';
            }
            if(attributeName == 'style'){
                throw 'use style setter instead';
            }
            this.attributes.push({'name':attributeName,'value':value});
        },

        removeAttribute : function(attributeName){
            var atts = this.attributes;
            for(var i=0; i<atts.length; i++) {
                if(atts[i].name == attributeName) {
                    atts.splice(i, 1);
                    return true;
                }
            }
            return false;
        },

        addClass : function(className){
            this.classes.push(className);
        },

        removeClass : function(className){
            imorumjs.data.removeByValue(this.classes, className);
        }
    }
})();