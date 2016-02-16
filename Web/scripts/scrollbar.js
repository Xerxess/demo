//**********************模拟滚动条*************************
//width:容器宽度(必需)
//height:窗口高度(必需)
//direction:horizontal(水平)||vertical(垂直) default:vertical
(function ($) {
    jQuery.fn.extend({
        Myscrollbar: function (opts) {
            opts = jQuery.extend({}, opts || {});
            var _this = $(this);
        }
    });

    ///模拟滚动条
    function scrcoll(a, b, f, g, c, d, e) {
        this.a = a;//包裹层;
        this.b = b;//内容层;
        this.f = f;//滚动条;
        this.g = g;//滚动条容器;
        this.c = c;//包裹高度;
        this.d = d;//内容高度;
        this.e = e;//滑动比例;
        this.s = 0;//滚动条位置;
        this.u = 0;//内容位置;
        this.p = 0;//光标在滚动条相对位置;
        this.clearselect = window.getSelection ? function () { window.getSelection().removeAllRanges(); } : function () { document.selection.empty(); };//清空用户文体选中
    }
    //注册滚动条滑轮事件
    scrcoll.prototype.regfn = function (e) {
        var ts = this, ratio = 0;
        if (ts.d > ts.c) ratio = ts.c / (ts.d / ts.c);//计算出滚动条高度
        ts.g.style.height = ratio + "px";//修改滚动打高度
        if (ts.a.addEventListener) {
            ts.a.addEventListener("DOMMouseScroll", BindAsEventListener(ts, ts.fn), false);//火狐
            ts.a.addEventListener("mousewheel", BindAsEventListener(ts, ts.fn), false);//ie9以上版本处理
            ts.g.addEventListener("mousedown", BindAsEventListener(ts, ts.scrcollmove), false);//ie9以上版本处理
        }
        else if (ts.a.attachEvent) {
            ts.a.attachEvent('onmousewheel', BindAsEventListener(ts, ts.fn));
            ts.g.attachEvent('onmousedown', BindAsEventListener(ts, ts.scrcollmove));
        }
        else {
            ts.a["onmousewheel"] = BindAsEventListener(ts, ts.fn);
            ts.g["onmousedown"] = BindAsEventListener(ts, ts.scrcollmove);
        }
    }

    //滑轮事件处理
    scrcoll.prototype.fn = function (e) {
        e = e || window.event;
        var ts = this;
        var act = e.wheelDelta ? e.wheelDelta / 120 : (0 - e.detail / 3);;//向上滚动为正数，向下滚动为负数;
        ts.fnscroll(act);
        //取消系统滚动条事件
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
    }
    ///计算条高度
    scrcoll.prototype.fnscroll = function (de) {
        var ts = this;
        var blh = this.g.offsetHeight / this.e;//获得每次滚动条的移动距离
        var alh = this.a.offsetHeight / this.e;//获得每次滚动条的移动距离
        if (de > 0) {//向上滚动
            ts.s -= blh;
            ts.u += alh;
        }
        else {//向下滚动
            ts.s += blh;
            ts.u -= alh;
        }
        if (ts.s <= 0) {//上边界
            ts.s = ts.s <= 0 ? 0 : ts.s;
            ts.u = ts.u >= 0 ? 0 : ts.u;
        }
        var a = this.a.offsetHeight - this.g.offsetHeight;
        var b = this.b.offsetHeight - this.a.offsetHeight;
        if (ts.s >= a) {//下边界
            ts.s = ts.s >= a ? a : ts.s;
            ts.u = ts.u <= -b ? -b : ts.u;
        }
        ts.g.style.top = ts.s + "px";
        ts.b.style.top = ts.u + "px";
    }
    //拖拽
    scrcoll.prototype.scrcollmove = function (e) {
        e = e || window.event;
        var ts = this;
        ts.g.style.backgroundColor = "#888";
        ts.p = e.clientY;//获得鼠标的相对位置
        var a = ts.g.offsetTop;//滚动条可向上移动的距离
        var b = ts.f.offsetHeight - ts.g.offsetTop - ts.g.offsetHeight;//滚动条可向下移动的距离
        var c = ts.s, d = ts.u;//临时变量滚动条位置
        document.onmousemove = function (ev) {
            var oEvent = ev || window.event;
            var o = oEvent.clientY - ts.p;//获得光标偏移量
            if (o < (0 - a)) o = 0 - a;//可移动上界限
            if (o > b) o = b;//可移动下界限
            ts.s = c + o;//存储滚动条位置
            ts.u = d - ts.d * (o / ts.c);//存储内容位置
            ts.g.style.top = ts.s + "px";
            ts.b.style.top = ts.u + "px";
            ts.clearselect();
        }
        document.onmouseup = function () {
            ts.g.style.backgroundColor = "#ddd";
            document.onmousemove = null;
            document.onmouseup = null;
        }
        return false;
    }
})(jQuery);