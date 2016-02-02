/*日历控件
暂时只支持input
*/
!(function (win) {

    var options = {
        css: 'scripts/fcdates/css/date.css',
        inputdom: null,//操作input
        event: 'focus',//触发方式
        format: 'YYYY-MM-dd HH:mm:ss',//格式化格式
        min: '1900-1-1',
        max: '2099-12-31',
        fn: null
    };
    //扩展options
    options.extend = function (options) {
        for (var o in options) {
            //console.log(options.hasOwnProperty(o));
            if (options.hasOwnProperty(o)) {
                this[o] = options[o];
            }
        }
    }
    //公共方法
    var Common = {
        each: function (arrydom, fn) {
            var len = arrydom.length;
            for (var i = 0; i < len; i++) {
                if (typeof fn == 'function') {
                    fn.call(arrydom[i]);
                }
            }
        },
        //绑定事件
        on: function (dom, even, fn) {
            dom.attachEvent ? dom.attachEvent('on' + even, function (e) {
                e = e || window.event;
                e.cancelBubble = true;
                fn.call(dom, e);
            }) : dom.addEventListener(even, function (e) {
                e = e || window.event;
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
                fn.call(dom, e);
            }, false);
        },
        on2: function (dom, even, fn) {
            dom.attachEvent ? dom.attachEvent('on' + even, function (e) {
                e = e || window.event;
                fn.call(dom, e);
            }) : dom.addEventListener(even, function (e) {
                e = e || window.event;
                fn.call(dom, e);
            }, false);
        },
        //获得属性
        attr: function (dom, attr, val) {
            var str = '', s;
            if (val) {
                dom.setAttribute(this.trim(attr), val);
                attr.toLowerCase() == 'class' && (dom.className = val);
                attr.toLowerCase() == 'style' && (dom.style.cssText = val);
            }
            else {
                s = dom.getAttribute(attr);
                str = s;
                attr.toLowerCase() == 'class' && (str = dom.className);
                attr.toLowerCase() == 'style' && (str = dom.style.cssText);
                return this.trim(str);
            }
        },
        //删除属性
        removeattr: function (dom, attr) {
            dom.removeAttribute(attr);
        },
        //判断是否存在class
        hasClass: function (dom, str) {
            return new RegExp('\\b' + str + '\\b').test(dom.className);
        },
        //添加class
        addClass: function (dom, cls) {
            this.hasClass(dom, cls) || (dom.className += ' ' + cls);
            dom.className = this.trim(dom.className);
        },
        //删除class
        removeClass: function (dom, cls) {
            var c = this.trim(cls), reg = new RegExp('\\b' + c + '\\b');

            if (this.hasClass(dom, c)) {
                dom.className = this.trim(dom.className.replace(reg, ''));
            }
        },
        //去除前后空格
        trim: function (s) {//去除多于空格
            s = s.toString() || '';
            return s.replace(/^\s*|\s*$/g, '');
        },
        mouseenter: function (dom, fn) {
            var f = true;
            if (dom.attachEvent) {
                this.on(dom, "mouseenter", fn);
            }
            else {
                this.on(dom, "mouseover", function (e) {
                    if (f) {
                        var mya = (e.srcElement ? e.srcElement : e.target);
                        var parent = e.relatedTarget || e.fromElement;
                        while (parent && parent != dom) {
                            try { parent = parent.parentNode; }
                            catch (e) { break; }
                        }
                        if (parent != dom) {
                            f = (function () { fn.call(dom, e); return true; })();
                        }
                    }
                });
            }

        },
        mouseleave: function (dom, fn) {
            if (dom.attachEvent) {
                this.on(dom, "mouseleave", fn);
            }
            else {
                this.on(dom, "mouseout", function (e) {
                    var mya = (e.srcElement ? e.srcElement : e.target);
                    var parent = e.relatedTarget || e.toElement;
                    while (parent && parent != dom) {
                        try { parent = parent.parentNode; }
                        catch (e) { break; }
                    }
                    if (parent != this) { fn.call(dom, e); }
                });
            }
        },
        loadcss: function (url) {
            var s = document.createElement("link");
            s.href = url;
            s.rel = "stylesheet";
            s.type = "text/css";
            document.getElementsByTagName("head")[0].appendChild(s);
        },
        //动态添加外部js
        loadscript: function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) {//IE浏览专属
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        if (typeof callback === "function") { callback(); }
                    }
                }
            } else {//其他浏览器
                script.onload = function () {
                    if (typeof callback === "function") { callback(); }
                }
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    };

    var Dates = {
        //补位
        digit: function (m) {
            return +m < 10 ? '0' + m : m;
        },
        //日期格式化可date可是数组也可以是字符串
        parse: function (date, format) {
            var _index = 0;
            if (typeof date == 'string') date = this.toarry(date);
            if (date == null) return '';
            //console.log(date);
            format = format || 'YYYY-MM-dd HH:mm:ss';
            return format.replace(/YYYY|MM|dd|HH|mm|ss/g, function (str, index, s) {
                return Dates.digit(date[_index++]);
            });
        },
        //获指定日期
        now: function (timestamp, format) {
            var _parsestr, _date = new Date((timestamp | 0) ? function () {
                var _datenow = new Date();
                if (timestamp >= 86400000) {
                    return timestamp + _datenow.getHours() * 3600000 + _datenow.getMinutes() * 60000 + _datenow.getSeconds() * 1000;
                }
                return 86400000 * timestamp + _datenow.getTime();
            }(timestamp) : new Date);
            _parsestr = [_date.getFullYear(), (_date.getMonth() + 1), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()];
            return {
                //返回字符串
                Totime: this.parse(_parsestr, format),
                //返回数组
                Toarry: _parsestr
            };
        },
        //日期序列化
        toarry: function (timestr) {
            var aryy = this.Isdate(timestr, true);//日期正确返回日期数组[YYYY,MM,dd,HH,mm,ss]
            if (!aryy) return null;
            return aryy;
        },
        //验证日期,设置第二个参数可以返回现在日期数组[YYYY,MM,dd,HH,mm,ss]
        Isdate: function (datestr, isreturn) {
            var _DateReg = /^((\d{4})(-|\/)(\d{1,2})\3(\d{1,2}))( (\d{1,2}):(\d{1,2}):(\d{1,2}))?$/,//2015-1-43 3:3:44||2015-1-43 99:99:99
                _Date,
                _result,
                _YYYY, _MM, _dd, _HH = 0, _mm = 0, _ss = 0, _istrue = false;
            if (_DateReg.test(datestr)) {//验证格式正确
                _result = _DateReg.exec(datestr);//datestr.match(reg);
                //console.log(_result);
                if (_result == null) return false;
                _YYYY = _result[2];
                _MM = +_result[4] - 1;
                _dd = _result[5];
                if (_result[6] != undefined && _result[6] != '') {
                    _HH = _result[7];
                    _mm = _result[8];
                    _ss = _result[9];
                }
                _Date = new Date(_YYYY, _MM, _dd, _HH, _mm, _ss);
                _istrue = (_Date.getFullYear() == _YYYY && _Date.getMonth() == _MM && _Date.getDate() == _dd && _Date.getHours() == _HH && _Date.getMinutes() == _mm && _Date.getSeconds() == _ss);
                return (_istrue && (isreturn && [_YYYY, (_MM + 1), _dd, _HH, _mm, _ss])) || _istrue;
            }
            else {
                return false;
            }
        },
        //润年判断
        LeapYear: function (year) {
            if ((year % 100 == 0 && year % 400 == 0) || year % 4 == 0) return true;
            return false;
        }
    };

    //框架加载
    function creatidstr() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(8).substring(1);
        };
        return 'date' + new Date().valueOf() + S4().toString() + '' + S4().toString();
    }
    var idarry = [creatidstr(), creatidstr(), creatidstr(), creatidstr(), creatidstr(), creatidstr(), creatidstr(), creatidstr(), creatidstr(), creatidstr(), creatidstr()];
    var strVar = "";
    strVar += "";
    strVar += "<div class=\"fc-box\" id=\"" + idarry[1] + "\">";
    strVar += "<a class=\"fc-ico fc-ico-l\" id=\"" + idarry[2] + "\"><i><\/i><\/a>";
    strVar += "<input class=\"fc-input input-YY\" id=\"" + idarry[3] + "\" value=\"\" readonly=\"readonly\" />";
    strVar += "<span>年<\/span>";
    strVar += "<input class=\"fc-input input-MM\" id=\"" + idarry[4] + "\" value=\"\" readonly=\"readonly\" />";
    strVar += "<span>月<\/span>";
    strVar += "<a class=\"fc-ico fc-ico-r\" id=\"" + idarry[5] + "\"><i><\/i><\/a>";
    strVar += "<div class=\"fc-YY-list-box\"><\/div>";
    strVar += "<div class=\"fc-MM-list-box\"><\/div>";
    strVar += "<\/div>";
    strVar += "<div class=\"f-d-list-box\">";
    strVar += "<table id=\"" + idarry[6] + "\">";
    strVar += "<thead><tr><th>日<\/th><th>一<\/th><th>二<\/th><th>三<\/th><th>四<\/th><th>五<\/th><th>六<\/th><\/tr><\/thead><tbody id=\"" + idarry[10] + "\"><\/tbody>";
    strVar += "<\/table>";
    strVar += "<\/div>";
    strVar += "<div class=\"f-d-week-keepout\" id=\"" + idarry[7] + "\"><\/div>";
    strVar += "<div class=\"f-d-week-error\" id=\"" + idarry[8] + "\">";
    strVar += "<p class=\"f-d-w-e-tit\">信息<\/p>";
    strVar += "<div class=\"f-d-w-e-content\">";
    strVar += "<p><span class=\"span1\"><\/span><span id=\"" + idarry[9] + "\"><\/span><\/p>";
    strVar += "<a href=\"#\" class=\"btn-error-ok\">确 定<\/a>";
    strVar += "<\/div>";
    strVar += "<\/div>";
    strVar += "";
    var newdom = document.createElement('div');
    newdom.id = idarry[0];
    newdom.className = 'fc-date-box';
    newdom.style.display = 'none';
    newdom.innerHTML = strVar;
    document.body.appendChild(newdom);
    newdom = null;
    strVar = null;
    Common.loadcss(options.css);


    var domtrtarget = document.getElementById(idarry[0]),
        domfc = document.getElementById(idarry[6]),//容器
        domYYYY = document.getElementById(idarry[3]),
        domMM = document.getElementById(idarry[4]),
        domfc_l = document.getElementById(idarry[2]),//前一月
        domfc_r = document.getElementById(idarry[5]),//后一月
        domerror = [document.getElementById(idarry[7]), document.getElementById(idarry[8]), document.getElementById(idarry[9])],//错误信息
        domtbody = document.getElementById(idarry[10]),
        td_this_class = 'fc-foucs-this',//当前td样式
        td_no_class = 'no-fc';//notd样式
    var timeout1 = false;//延迟input blur发生
    var _arrym_d = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var _nowarry, _nowarry2, _nowday, _nowday2;
    _nowarry = _nowarry2 = Dates.now().Toarry;//日期数组
    _nowday = _nowday2 = new Date(_nowarry[0] + '/' + _nowarry[1] + '/1').getDay();//星期数
    var _arrydom = [];//td-dom 页面数组
    var alltt = true;
    var Fcdate = {
        //数据写入内存防止用户篡改
        Options: {
            thisYYYY: null,//当前年份
            thisMM: null,//当前月份
            thisDD: null,//当前日期
            thisHH: null,
            thismm: null,
            thisss: null,
            maxYYYY: null,
            minYYYY: null,
            tofn: false,
            opt: null
        },
        //为目标dom创建focus事件
        ondom: function (opt) {
            var _cur = this, _focusdom = opt.dom;
            if (!_focusdom) { return false; }
            Common.addClass(_focusdom, 'Fcdates-input');
            Common.on(_focusdom, 'focus', function () {
                if (!alltt) { return; }
                else if (domtrtarget.style.display == 'block') {//判断上一个input内容
                    var valuedate = options.inputdom.value;
                    if (!_cur.Error(options.inputdom.value)) {
                        return;
                    }
                }
                options.inputdom = this;
                _cur.Init(opt);
                timeout1 = true;
                domtrtarget.style.top = this.offsetHeight + this.offsetTop + 'px';
                domtrtarget.style.left = this.offsetLeft + 'px';
                domtrtarget.style.display = 'block';
            });
            return this;
        },
        //主函数
        Init: function (opt) {
            var _thisnewarry;
            this.Options.opt = opt;
            if (Common.trim(options.inputdom.value) != '') {
                _thisnewarry = Dates.toarry(options.inputdom.value);
                _nowarry = _thisnewarry
                _nowday = this.GetFirstDay(_nowarry[0], _nowarry[1]);
            }
            else {
                _nowarry = _nowarry2;
                _nowday = _nowday2;
            }
            this.Options.thisDD = _nowarry[2];
            this.LeapYear(_nowarry[0]);
            this.SetyyyyMM(3, _nowarry);
            this.CeartTbody(opt);
            if (!this.Options.tofn) {
                this.BindFn();
                this.Options.tofn = true;
            }
            _thisnewarry = null;
        },
        //创建table
        CeartTbody: function (opt) {
            var _cur = this;
            var _tbody = document.createElement('tbody'), _tr = null;
            for (var i = 0; i < 42; i++) {
                if (i == 0 || i == 7 || i == 14 || i == 21 || i == 28 || i == 35) {
                    _tr = document.createElement('tr');
                    _tbody.appendChild(_tr);
                }
                var _td = document.createElement('td');
                if (i >= _nowday && i < (_arrym_d[_nowarry[1] - 1] + _nowday)) {
                    var _day = i - _nowday + 1;
                    _td.innerHTML = _day;
                    Common.attr(_td, 'data-y', _nowarry[0]);
                    Common.attr(_td, 'data-m', _nowarry[1]);
                    Common.attr(_td, 'data-d', _day);
                    this.Isday(_td, _day);
                    _arrydom.push(_td);
                }
                else {
                    Common.addClass(_td, td_no_class);
                }
                _tr.appendChild(_td);
                _tbody.appendChild(_tr);
            }
            _tr = null;
            try {
                domtbody.innerHTML = _tbody.innerHTML;//ie6-9果断报错，居然不支持;
                _tbody = null;
            }
            catch (error) {
                domfc.replaceChild(_tbody, domtbody);
                domtbody = _tbody;
            }
        },
        //判断当前选中日期
        Isday: function (td, day) {
            if (this.Options.thisDD == day) {
                Common.addClass(td, td_this_class);
            }
        },
        //写入input
        SetInput: function () { },
        //绑定事件
        BindFn: function (opt) {
            var _cur = this;
            //前一月事件
            Common.on(domfc_l, 'click', function (e) {
                _cur.SetyyyyMM(1);
                _cur.Change(_cur.Options.opt);
            });

            //下一月事件
            Common.on(domfc_r, 'click', function (e) {
                _cur.SetyyyyMM(2);
                _cur.Change(_cur.Options.opt);
            });

            //点document处理事件
            Common.on2(document, 'click', function (e) {
                var _target = e.target || e.srcElement;
                if (Common.hasClass(_target, 'Fcdates-input')) {
                    return;
                }
                if (_target.className === 'btn-error-ok') {
                    _cur.Error('');
                    alltt = true;
                    return;
                }
                if (timeout1) {
                    if (!_cur.Error(options.inputdom.value)) {
                        return;
                    }
                    domtrtarget.style.display = 'none';
                    timeout1 = false;
                }
            });

            //td点选事件
            Common.on(domfc, 'click', function (e) {
                var _target = e.target || e.srcElement, _nowtime = new Date(), _newtime;
                if (_target.tagName.toLowerCase() === 'td' && _target.nodeType == 1 && !Common.hasClass(_target, td_no_class)) {
                    _newtime = Dates.parse(Common.attr(_target, 'data-y') + '/' + Common.attr(_target, 'data-m') + '/' + Common.attr(_target, 'data-d') + ' ' + _nowtime.getHours() + ':' + _nowtime.getMinutes() + ':' + _nowtime.getSeconds(), _cur.Options.opt ? _cur.Options.opt.format : options.format);
                    if (!_newtime) {
                        alltt = false;
                        domerror[2].innerHTML = '注意,内里被篡改!';
                        domerror[0].style.display = 'block';
                        domerror[1].style.display = 'block';
                        return;
                    }
                    Common.each(_arrydom, function () {
                        Common.removeClass(this, td_this_class);
                    });
                    Common.addClass(_target, td_this_class);
                    _cur.Options.thisDD = Common.attr(_target, 'data-d');
                    options.inputdom.value = _newtime;
                    domtrtarget.style.display = 'none';
                }
            });
        },
        //日期改变
        Change: function (opt) {
            _nowday = this.GetFirstDay(domYYYY.value, domMM.value);
            _nowarry = [domYYYY.value.toString(), domMM.value.toString()];
            this.LeapYear(_nowarry[0]);
            this.CeartTbody(opt);
        },
        //润年判断
        LeapYear: function (year) {
            if (Dates.LeapYear(year)) _arrym_d[1] = 29;
            _arrym_d[1] = 28;
        },
        //设置当前年月
        SetyyyyMM: function (type, arry) {
            var yyyy = +domYYYY.value, MM = +domMM.value;
            switch (type) {
                case 1:
                    if (MM == 1) {
                        domYYYY.value = yyyy - 1;
                        domMM.value = 12;
                    }
                    else {
                        domMM.value = Dates.digit(MM - 1);
                    }
                    break;
                case 2:
                    if (MM == 12) {
                        domYYYY.value = yyyy + 1;
                        domMM.value = Dates.digit(1);
                    }
                    else {
                        domMM.value = Dates.digit(MM + 1);
                    }
                    break;
                case 3:
                    domYYYY.value = arry[0];
                    domMM.value = Dates.digit(+arry[1]);
                    break;
            }
        },
        //每月1日的星期数
        GetFirstDay: function (year, MM) {
            return new Date(year + '/' + MM + '/1').getDay();
        },
        //格式错误
        Error: function (val) {
            var valuedate = val;
            if (!Dates.Isdate(valuedate) && Common.trim(valuedate) != '') {
                alltt = false;
                domerror[2].innerHTML = '格式不正确';
                domerror[0].style.display = 'block';
                domerror[1].style.display = 'block';
                return;
            }
            else {
                domerror[2].innerHTML = '';
                domerror[0].style.display = 'none';
                domerror[1].style.display = 'none';
            }
            return true;
        }
    };

    win.Fcdates = function (opt) { Fcdate.ondom.call(Fcdate, opt); };
})(window);