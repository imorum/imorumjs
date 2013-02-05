$ns1 = imorumjs.animation;
$t = $ns1.SineEase = function SineEase(mode)
{
	imorumjs.animation.Ease.call(this, mode);
}
$p = $c.inherit($t, $ns1.Ease);

$p.doEase = function(progress){
    var x = (1.0 - Math.sin((Math.PI/2) * (1.0 - progress)));
    return x;
}
