$t = imorumjs.animation.Ease = function Ease(mode)
{
	this.mode = mode;
}

$p = $t.prototype;
$p.ease = function(progress){
	var ns1 = imorumjs.animation;
    switch (this.mode)
    {
        case ns1.EaseMode.EaseIn:
            return this.doEase(progress);

        case ns1.EaseMode.EaseOut:
            return (1.0 - this.doEase(1.0 - progress));
    }
    if (progress >= 0.5)
    {
        return (((1.0 - this.doEase((1.0 - progress) * 2.0)) * 0.5) + 0.5);
    }
    return (this.doEase(progress * 2.0) * 0.5);
};

$p.doEase = function(progress){
	throw "not implemented";
};