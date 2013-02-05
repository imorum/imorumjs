$ns1 = imorumjs.animation;
$t = $ns1.ExponentialEase = function ExponentialEase(mode, exponent)
{
	imorumjs.animation.Ease.call(this, mode);
	this.exponent = (exponent? exponent : 2);
}
$p = $c.inherit($t, $ns1.Ease);

$p.doEase = function(progress){
    var exponent = this.exponent;
    if ( exponent == 0 )
    {
        return progress;
    }
    var x = ((Math.exp(exponent * progress) - 1.0) / (Math.exp(exponent) - 1.0));
    return x;
}
