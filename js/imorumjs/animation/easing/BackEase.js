$ns1 = imorumjs.animation;
$t = $ns1.BackEase = function BackEase(mode, amplitude)
{
	imorumjs.animation.Ease.call(this, mode);
	this.amplitude = (amplitude? amplitude : 1);
}
$p = $c.inherit($t, $ns1.Ease);

$p.doEase = function(progress){
    var amp = Math.Max(0.0, this.Amplitude);
	var x = (Math.pow(progress, 3.0) - ((progress * amp) * Math.sin(Math.PI * progress)));
    return x;
}
