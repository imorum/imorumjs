$t = imorumjs.animation.KeyFrame = function KeyFrame(key, value)
{
	this.key = key;
	this.value = value;
}

$p = $t.prototype;
$p.interpolate = function(from, to, progress){
	if ((progress < 0.0) || (progress > 1.0))
	{
		throw "progress out of range";
	}
	return this.doInterpolation(from, to, progress);
};
$p.doInterpolation = function(from, to, progress){
	throw "not implemented";
};