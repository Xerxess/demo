/*
*倒记时
*/
!function (w, $) {
    //补位
    function digit(m) {
        return +m < 10 ? '0' + m : m;
    }
    w.countdown = function (obj) {
        this.countdowntnowt;
        this.coder = true;
        this.jqdom = obj.jqdom;
        this.funRun = obj.funRun;
        this.funEnd = obj.funEnd;
    };
    countdown.prototype.tcountdown = function () {
        var _ts = this;
        var nowts = new Date().valueOf();
        var ts = (_ts.countdowntnowt - nowts);
        if (ts <= 0) {
            coder = true; //可以再次获得验证码
            if (_ts.funEnd) {
                _ts.funEnd.call(_ts);
                _ts = null;
            }
        }
        else {
            if (_ts.funRun) {
                _ts.funRun.call(_ts, digit(Math.round(ts / 1000)));
            }
            var fn = arguments.callee;
            setTimeout(function () {
                fn.call(_ts);
            }, 1000);
        }
    };
}(window, $);