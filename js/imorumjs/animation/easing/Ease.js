imorumjs.include("imorumjs.animation.EaseMode", function(){
    imorumjs.namespace("imorumjs.animation.easing");

    var $t = imorumjs.animation.easing.Ease = function Ease(mode)
    {
        this.mode = mode;
    }

    $t.prototype = {
        ease : function(progress){
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
        },

        doEase : function(progress){
            throw "not implemented";
        }
    }
});