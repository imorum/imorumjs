imorumjs.include("imorumjs.animation.easing.Ease", function(){
    imorumjs.namespace("imorumjs.animation.easing");

    var $t = imorumjs.animation.easing.BounceEase = function BounceEase(mode, bounces, bounciness)
    {
        imorumjs.animation.easing.Ease.call(this, mode);
        this.bounces = (bounces? bounces : 3);
        this.bounciness = (bounciness? bounciness : 2);
        this.precalculate();
    }

    var $p = imorumjs.x.inherit($t, imorumjs.animation.easing.Ease);

    $p.precalculate = function(){
        this._y = Math.max(0.0, this.bounces);
        this._a = 1.0 - this.bounciness;
        this._b = Math.pow(this.bounciness, this._y);
        this._c = ((1.0 - this._b) / this._a) + (this._b * 0.5);
        this._l = (this._a * this._c);
        this._m = Math.log(this.bounciness);
    }

    $p.doEase = function(progress){
        if ((this.bounciness < 1.0) || this.bounciness == 1.0 )
        {
            this.bounciness = 1.001;
        }
        // TODO: find the source formula for this equations
        // 2, 3: at 0.38 bail out
        var d = progress * this._c;
        var logbounce = Math.log((-d * this._a) + 1.0) / this._m;
        var e = Math.floor(logbounce);
        var f = e + 1.0;
        var g = (1.0 - Math.pow(this.bounciness, e)) / this._l;
        var h = (1.0 - Math.pow(this.bounciness, f)) / this._l;
        var i = (g + h) * 0.5;
        var j = progress - i;
        var k = i - g;
        var x = (((-Math.pow(1.0 / this.bounciness, this._y - e) / Math.pow(k, 2)) * (j - k)) * (j + k));
        return x;
    }
});