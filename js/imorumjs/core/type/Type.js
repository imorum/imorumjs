/**
 * Type
 * Core Type Definition Static Class
 * 2012/09/27
 */
$s = infrajs.Type = {};

$s.registerNamespace = function registerNamespace(namespacePath) {
    var rootObject = window;
    var namespaceParts = namespacePath.split('.');

    for (var i = 0, l = namespaceParts.length; i < l; i++) {
        var currentPart = namespaceParts[i];
        var ns = rootObject[currentPart];
        if (!ns) {
            ns = rootObject[currentPart] = {};
        }
        rootObject = ns;
    }
}

$s.registerClass = function registerClass(theClass, typeName, baseType, interfaceTypes) {
    var prototype = theClass.prototype;
    prototype.constructor = theClass;
    theClass.ooinf.typeName = typeName;
    theClass.ooinf.isClass = true;
    if (baseType) {
    	theClass.ooinf.baseType = baseType;
    	theClass.resolveInheritance();
    }
    if (interfaceTypes) {
        var interfaces = theClass.ooinf.interfaces = [];
        for (var i = 2, l = arguments.length; i < l; i++) {
            var interfaceType = arguments[i];
             interfaces.push(interfaceType);
        }
    }
    return theClass;
}

$s.inheritsFrom = function inheritsFrom(theClass, parentType) {
	theClass.resolveInheritance();
    return infrajs.Type._inheritsFrom(theClass, parentType);
}

$s._inheritsFrom = function _inheritsFrom(type, parentType) {
    var ret=false;
    if (parentType) {
        var baseType = type.__baseType;
        while (baseType) {
            if (baseType === parentType) {
                ret = true;
                break;
            }
            baseType = baseType.__baseType;
        }
    }
    return !!ret;
}

$s.resolveInheritance = function resolveInheritance(theClass) {
    if (theClass.ooinf.basePrototypePending) {
        var baseType = theClass.ooinf.baseType;

        baseType.resolveInheritance();
        var basePrototype = baseType.prototype,
            thisPrototype = theClass.prototype;
        for (var memberName in basePrototype) {
            thisPrototype[memberName] = thisPrototype[memberName] || basePrototype[memberName];
        }
        delete theClass.ooinf.basePrototypePending;
    }
}

$s.registerInterface = function registerInterface(theInterface, typeName) {
    // Saving a case-insensitive index of the registered types on each namespace
    infrajs.ooinf.upperCaseTypes[typeName.toUpperCase()] = theInterface;

    theInterface.prototype.constructor = theInterface;
    theInterface.ooinf.typeName = typeName;
    theInterface.ooinf.isInterface = true;

    return theInterface;
}

$s.initializeBase = function initializeBase(theClass, instance, baseArguments) {
    var baseType = theClass.ooinf.baseType;
    if (baseType) {
        baseArguments ? baseType.apply(instance, baseArguments) : baseType.apply(instance);
    }
    return instance;
}

$s.callBaseMethod = function callBaseMethod(theClass, instance, name, baseArguments) {
    var baseMethod = infrajs.Type._getBaseMethod(theClass, instance, name);
    return baseArguments ? baseMethod.apply(instance, baseArguments) : baseMethod.apply(instance);
}

$s._getBaseMethod = function _getBaseMethod(type, instance, name) {
	 var baseType = type.getBaseType();
	 if (baseType) {
	     var baseMethod = baseType.prototype[name];
	     return (baseMethod instanceof Function) ? baseMethod : null;
	 }
	 return null;
}

Type.prototype.getBaseType = function getBaseType() {
    return (typeof(this.ooinf.baseType) === "undefined") ? null : this.ooinf.baseType;
}

Type.prototype.isInstanceOfType = function isInstanceOfType(instance) {
    return infrajs.isInstanceOfType(this, instance);
}

infrajs.isInstanceOfType = function isInstanceOfType(type, instance) {
    if (typeof(instance) === "undefined" || instance === null) return false;
    if (instance instanceof type) return true;
    var instanceType = Object.getType(instance);
    return !!(instanceType === type) ||
           (instanceType.inheritsFrom && instanceType.inheritsFrom(type)) ||
           (instanceType.implementsInterface && instanceType.implementsInterface(type));
}

Type.registerNamespace("infrajs");
infrajs.__upperCaseTypes = {};
infrajs.__rootNamespaces = [infrajs];

