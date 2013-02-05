$ns1 = imorumjs.animation;
$t = $ns1.CircleEase = function CircleEase(mode)
{
	imorumjs.animation.Ease.call(this, mode);
}
$p = $c.inherit($t, $ns1.Ease);

$p.doEase = function(progress){
	progress = Math.max(0.0, Math.min(1.0, progress));
	var x = (1.0 - Math.sqrt(1.0 - Math.pow(progress, 2)))
    return x;
}
