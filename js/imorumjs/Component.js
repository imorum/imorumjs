infrajs.Component = function()
{
	infrajs.Component.initializeBase(this);
}

infrajs.Component.prototype = {
    _parent: null,
    get_id: function get_id() {
        return this._id || null;
    },
    set_id: function set_id(value) {
        this._id = value;
    },
    get_parent: function get_parent() {
        if (this._parent) return this._parent;
        return null;
    },
    set_parent: function set_parent(value) {
        this._parent = value;
    },
    get_isInitialized: function get_isInitialized() {
        return !!this._initialized;
    },
    get_isUpdating: function get_isUpdating() {
        return !!this._updating;
    },
    dispose: function dispose() {
        this.dispatchEvent(new infrajs.events.Event(infrajs.events.EventTypes.disposing, false, false));
        this.clearEventListener();
    },
    beginUpdate: function beginUpdate() {
        this._updating = true;
    },
    endUpdate: function endUpdate() {
        this._updating = false;
        if (!this._initialized) this.initialize();
        this.updated();
    },
    initialize: function initialize() {
        this._initialized = true;
    },
    updated: function updated() {
    }
}

infrajs.Component.registerClass('infrajs.Component', infrajs.events.EventDispatcher, infrajs.IDisposable);

infrajs.Component.create = function create(type, properties, events, element) {
    var component = (element ? new type(element): new type());
    callIf(component, "beginUpdate");
    if (properties) {
        infrajs.Component._setProperties(component, properties);
    }
    if (events) {
        for (var name in events) {
            component.addEventListener(events[name]);
        }
    }
    infrajs.Component._register(component);
    return component;
}

$create = infrajs.Component.create;


infrajs.Component._register = function _register(component, dontUpdate) {
    var ret = false;
    if (infrajs.Component.isInstanceOfType(component)) {
        ret = true;
        var doc = infrajs.Document;
        if (component.get_id()) {
        	doc.addComponent(component);
        }
        if (!dontUpdate) {
            component.endUpdate();
        }
    }
    return ret;
}
infrajs.Component._setProperties = function _setProperties(target, properties) {
    var current;
    var isComponent = infrajs.Component.isInstanceOfType(target) && !target.get_isUpdating();
    if (isComponent) target.beginUpdate();
    for (var name in properties) {
        var val = properties[name];

        var setter = target["set_" + name];
        if (typeof(setter) === 'function') {
            // We have setter, always use it
            setter.apply(target, [val]);
        } else {
        	// no setter, check getter
            var getter = target["get_" + name];
            if (typeof(getter) === 'function') {
            	// no setter, but getter function exist
                if (val instanceof Array) {
                    // val is array, we adding the array to the member
                    current = getter.apply(target);
                    for (var i = 0, j = current.length, l= val.length; i < l; i++, j++) {
                        current[j] = val[i];
                    }
                }
                else if ((typeof(val) === 'object') && (Object.getType(val) === Object)) {
                    // val is object, try to set its properties
                    current = getter.apply(target);
                    this._setProperties(current, val);
                }
            }
            else {
            	// no setter no getter , directly set the property as member variable 
            	target[name] = val;
            }
        }
    }
    if (isComponent) target.endUpdate();
}
