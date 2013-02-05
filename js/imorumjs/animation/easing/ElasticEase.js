$ns1 = imorumjs.animation;
$t = $ns1.ElasticEase = function ElasticEase(mode, oscillations, springiness)
{
	imorumjs.animation.Ease.call(this, mode);
	this.oscillations = (oscillations? oscillations : 3);
	this.springiness = (springiness? springiness : 3);
}
$p = $c.inherit($t, $ns1.Ease);

$p.doEase = function(progress){
    var a;
    var b = Math.max(0.0, this.oscillations);
    var c = Math.max(0.0, this.springiness);
    if ( c == 0 )
    {
        a = progress;
    }
    else
    {
        a = (Math.exp(c * progress) - 1.0) / (Math.exp(c) - 1.0);
    }
    var x = (a * Math.sin(((Math.PI * 2 * b) + (Math.PI/2)) * progress));
    return x;
}
