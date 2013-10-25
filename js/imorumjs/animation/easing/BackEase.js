imorumjs.namespace("imorumjs.animation");

imorumjs.animation.BackEase = function BackEase(mode, amplitude)
{
	imorumjs.animation.Ease.call(this, mode);
	this.amplitude = (amplitude? amplitude : 1);
}
var $p = imorumjs.x.inherit(imorumjs.animation.BackEase, imorumjs.animation.Ease);

$p.doEase = function(progress){
    var amp = Math.Max(0.0, this.Amplitude);
	var x = (Math.pow(progress, 3.0) - ((progress * amp) * Math.sin(Math.PI * progress)));
    return x;
}
