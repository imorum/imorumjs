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
