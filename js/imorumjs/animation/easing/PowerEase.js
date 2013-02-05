$ns1 = imorumjs.animation;
$t = $ns1.PowerEase = function PowerEase(mode, power)
{
	imorumjs.animation.Ease.call(this, mode);
	this.power = (power? power : 2);
}
$p = $c.inherit($t, $ns1.Ease);

$p.doEase = function(progress){
    var y = Math.max(0.0, this.power);
    var x = Math.pow(progress, y);
    return x;
}
