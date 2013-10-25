$t = imorumjs.sys.Renderer = function Renderer()
{
}

// Old browser refresh interval
this._PERIOD = 15;

// obj is {caller:xxx, func:xxx}
$t.render = function(obj){
	if(!this._toRender){
		this._toRender = [];
	}
	this._toRender.push(obj);
	this._requestRender(this._renderPhase);
}

$t._requestRender = function(func){
	if (window.requestAnimationFrame) window.requestAnimationFrame(func);
    else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(func);
    else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(func);
    else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(func);
    else setTimeout(func, this._PERIOD);
}

$t._renderPhase = function(){
	var context = imorumjs.sys.Renderer;
	if(context._toRender.length > 0){
		for(var i=0; i<context._toRender.length; i++){
			var continueRender = context._toRender[i].func.call(context._toRender[i].caller);
			if(!continueRender){
				context._toRender.splice(i--, 1);
			}
		}
		if(context._toRender.length > 0){
			context._requestRender(context._renderPhase);
		}
	}
}