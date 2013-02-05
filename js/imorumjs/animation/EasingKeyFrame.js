$ns1 = imorumjs.animation;
$t = $ns1.EasingKeyFrame = function EasingKeyFrame(key, value, easing)
{
	imorumjs.animation.KeyFrame.call(this, key, value);
	this.easing = easing;
}
$p = $c.inherit($t, $ns1.KeyFrame);

$p.doInterpolation = function(from, to, progress){
	var easeProgress = progress;
    if (this.easing != null)
    {
    	easeProgress = this.easing.ease(easeProgress);
    }
    if (easeProgress == 0.0)
    {
        return from;
    }
    if (easeProgress == 1.0)
    {
        return to;
    }
    return (from + ((to - from) * easeProgress));
}
