$ns1 = imorumjs.animation;
$t = $ns1.QuadraticEase = function QuadraticEase(mode)
{
	imorumjs.animation.Ease.call(this, mode);
}
$p = $c.inherit($t, $ns1.Ease);

$p.doEase = function(progress){
	var x = Math.pow(progress, 2);
	return x;
}
