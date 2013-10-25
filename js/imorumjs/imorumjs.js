(function() {
    // Basic Namespace Type support
    function Namespace(){};

    // Pre-register imorumjs namespace
    imorumjs = new Namespace();
    imorumjs.rootns = this;
    imorumjs.type = new Namespace();
    imorumjs.type.Namespace = Namespace;
    imorumjs.type.Namespace.prototype.apply = function(proto, override){
        override = override || true;
        for (var member in proto) {
            if(override == true){
                this[member] = proto[member];
            }else{
                if(this[member] == null){
                    this[member] = proto[member];
                }
            }
        }
    }

    imorumjs.namespace = function(ns) {
        var arrns = ns.split('.');
        var currns = imorumjs.rootns;
        for(var i in arrns) {
            if(currns[arrns[i]] == null) {
                currns[arrns[i]] = new Namespace();
            }
            currns = currns[arrns[i]];
        }
        return currns;
    }

    // Shortcut
    function Shortcut(){};
    imorumjs.x = new Shortcut();

    //Temporary
    function Temp(){};
    imorumjs.t = new Temp();

    // ajax request and js source handler
    imorumjs.namespace("imorumjs.sys").apply({
        selectHttpRequest : function() {
            if (window.XMLHttpRequest) // Gecko
                return new XMLHttpRequest();
            else if (window.ActiveXObject) // IE
                return new ActiveXObject("MsXml2.XmlHttp");
        },

        request : function(caller, type, url, callback) {
            var httpReq = this.selectHttpRequest();
            httpReq.open(type, url, false);
            httpReq.send(null);
            if (httpReq.status == 200 || httpReq.status == 304) {
                if (callback)
                    callback.call(caller, url, httpReq.responseText);
            } else {
                alert('Request error: ' + httpReq.statusText + ' (' + httpReq.status
                        + ')');
            }
        },

        requestGet : function(caller, url, callback) {
            this.request(caller, 'GET', url, callback);
        },

        // import
        _arrPath : {},
        _importing : [],
        isImported : function(ns){
            var arrns = ns.split('.');
            var currns = imorumjs.rootns;
            for(var i in arrns) {
                if(currns[arrns[i]] == null) return false;
                currns = currns[arrns[i]];
            }
            return true;
        },
        _appendJStoHead : function(fileUrl, callback) {
            var elHead = document.getElementsByTagName('HEAD').item(0);
            var elScript = document.createElement("script");
            elScript.language = "javascript";
            elScript.type = "text/javascript";
            elScript.src = fileUrl;
            if(callback!=null){
                if (elScript.readyState){  //IE
                    elScript.onreadystatechange = function(){
                        if (elScript.readyState === "loaded" ||
                            elScript.readyState === "complete"){
                            elScript.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {  //Others
                    elScript.onload = function(){
                        callback();
                    };
                }
            }
            elHead.appendChild(elScript);
        }
    });

    imorumjs.addPath = function(path){
        if (path.constructor == Object) {
            for (x in path)
            {
                imorumjs.sys._arrPath[x] = path[x];
            }
        }else{
            alert('invalid argument');
        }
    }

    imorumjs.include = function(ns, callback){
        if (ns instanceof Array) {
            imorumjs.include(ns.pop(), function(){
                if(ns.length>0){
                    imorumjs.include(ns, callback);
                }else{
                    callback();
                }
            });
        }else{
            if(imorumjs.sys.isImported(ns)){
                callback();
                return;
            }
            imorumjs.sys._importing.push({'ns':ns,'callback':callback});

            for (x in imorumjs.sys._arrPath)
            {
                if(ns.indexOf(x)==0){
                    var tail = ns.substr(x.length+1);
                    imorumjs.sys._appendJStoHead(imorumjs.sys._arrPath[x] + '/' + tail.replace(/\./g, '/') + '.js', checkImportCallback);
                }
            }
        }
    }

    function checkImportCallback(){
        var importing = imorumjs.sys._importing;
        for(var i=0; i<importing.length; i++) {
            if(imorumjs.sys.isImported(importing[i].ns)) {
                importing[i].callback();
                importing.splice(i,1);
                checkImportCallback();
                return;
            }
        }
    }

    // data
    imorumjs.namespace("imorumjs.data");

    imorumjs.data.merge = function (target) {
        target = target || {};
        foreach(arguments, function(o) {
            if (o) {
                forIn(o, function(v, n) {
                    target[n] = v;
                });
            }
        }, 1);
        return target;
    }
    imorumjs.data.forIn = function (obj, callback) {
        for (var x in obj) {
            //if (obj.hasOwnProperty(x)) callback(obj[x], x);
            callback(obj[x], x);
        }
    }
    imorumjs.data.foreach = function (arr, callback, start) {
        var cancelled = false;
        if (arr) {
            // javascript array
            arr = arr !== window && typeof(arr.nodeType) === "undefined" &&
                (arr instanceof Array ||
                // arguments array, or nodelist (has .item and is not a dom element or window)
                (typeof(arr.length) === 'number' && (typeof(arr.callee) === "function" || (arr.item && typeof(arr.nodeType) === "undefined") && !arr.addEventListener && !arr.attachEvent)))
                ? arr : [arr];
            for (var i = start||0, l = arr.length; i < l; i++) {
                if (callback(arr[i], i)) {
                    cancelled = true;
                    break;
                }
            }
        }
        return !cancelled;
    }
    imorumjs.data.callIf = function (obj, name, args) {
        // calls a function on an object if it exists, passing in the optional arguments
        var fn = obj[name],
            exists = typeof(fn) === "function";
        if (exists) fn.call(obj, args);
        return exists;
    }

    imorumjs.data.removeByValue = function(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    imorumjs.data.removeByReference = function(arr, ref) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] === ref) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    // types
    $c = imorumjs.Class = imorumjs.type.Class = {}
    imorumjs.x.inherit = imorumjs.type.Class.inherit = function(child, parent){
        var fn = child.toString().match(/function\s+([^\s\(]+)/)[1]; // Get function name
        eval(
            "function " + fn + "(){}; " +
                fn + ".prototype = parent.prototype; " +
                "child.prototype = new " + fn + "();"
        );
        child.prototype.constructor = child;
        return child.prototype;
    }
    imorumjs.type.Enum = function Enum(){};
})();