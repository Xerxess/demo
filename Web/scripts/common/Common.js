/*
作者：yc
修改日期：2015-2-27
内容：js常用的dom操作方法
*/
(function (win) {
    win.FC = win.FC || {};
    FC = function (id) {
        return new FC.fn.init(id);
    }
    FC.fn = FC.prototype = {
        init: function (id) {
            this.Selector = this.$(id);
        },
        //遍历执行
        each: function (fn) {
            var len = this.Selector.length;
            for (var i = 0; i < len; i++) {
                if (typeof fn == 'function') {
                    if (fn.call(this.Selector[i], i) == false) {
                        break;
                    }
                }
            }
        },
        //选择器
        $: function (id) {
            var arr = [];
            if (/^#[\w\W]*/.test(id) || typeof id != 'string') {//FC("#id")
                arr = [this.getid(id)];
            }
            else if (/^\.[\w\W]*/.test(id)) {//FC(".id")
                arr = this.getclass(id);
            }
            else if (/^[^#."'][\w\W]*\[[\w\W]*='[\w\W]*'\]$/.test(id)) {//FC("input[type='text']")
                arr = this.getname2(id);
            }
            else if (/^[^#."'][\w\W]*\:[\w\W]*$/.test(id)) {//FC("input:checked")
                arr = this.getname3(id);
            }
                //else if (/^[^#."'][\w\W]*\b[\w\W]*$/.test(id)) {//FC("div input")
                //    arr = this.getname4(id);
                //}
            else if (/^[^#."'][\w\W]*/.test(id)) {//FC("input")
                arr = this.getname(id);
            }
            return arr[0] ? arr : [];
        },
        getid: function (id) {
            return typeof id == 'string' ? document.getElementById(id.slice(1)) : id;
        },
        getclass: function (c) {
            var arr = [], find = [], exp = new RegExp('\\b' + c.slice(1) + '\\b'), i = 0;
            find = document.getElementsByClassName ? document.getElementsByClassName(c.slice(1)) : document.getElementsByTagName('body')[0].getElementsByTagName("*");
            if (document.getElementsByClassName) {
                return find[0] ? find : [];
            }
            for (var j = find.length; i < j; i++) {
                var _ts = find[i];
                if (_ts.nodeType == 1) {
                    exp.test(_ts.className) && arr.push(_ts);
                }
            }
            return arr[0] ? arr : [];
        },
        getname: function (name) {
            var arr = [];
            arr = document.getElementsByTagName(name);
            return arr[0] ? arr : [];
        },
        getname2: function (name) {
            var arr = [],
                narr = [],
                reg = /([\w\W]*)\[([\w\W]*)='([\w\W]*)'\]/,
                arrreg = reg.exec(name),
                Tagname = arrreg[1],
                type = arrreg[2],
                val = arrreg[3];
            narr = document.getElementsByTagName(Tagname);
            FC.each(narr, function () {
                if (this.nodeType == 1) {
                    var s = this.getAttribute(type);
                    s = type.toLowerCase() == 'class' ? (str = this.className) : s;
                    if (s == val) {
                        arr.push(this);
                    }
                }
            });
            return arr[0] ? arr : [];
        },
        getname3: function (name) {
            var arr = [],
                narr = [],
                reg = /([\w\W]*):([\w\W]*)/,
                arrreg = reg.exec(name),
                Tagname = arrreg[1],
                val = arrreg[2];
            narr = document.getElementsByTagName(Tagname);
            FC.each(narr, function () {
                if (this.nodeType == 1) {
                    if (this[val]) {
                        arr.push(this);
                    }
                }
            });
            return arr[0] ? arr : [];
        },
        length: function () {
            return this.Selector.length;
        },
        eq: function (i) {
            this.Selector = [this.Selector[i]];
            return this;
        },
        //绑定事件
        on: function (even, fn) {
            //事件监听器
            this.each(function (i) {
                var _ts = this;
                _ts.attachEvent ? _ts.attachEvent('on' + even, function (e) {
                    e = e || window.event;
                    fn.call(_ts, e, i);
                }) : _ts.addEventListener(even, function (e) {
                    e = e || window.event;
                    fn.call(_ts, e, i);
                }, false);
            });
            return this;
        },
        //删除节点
        remove: function () {
            this.each(function () {
                this.parentNode.removeChild(this)
            });
        },
        //设置css
        css: function (css, val) {
            var cssstr = '';
            if (typeof css == 'object') {
                for (var c in css) {
                    this.each(function () {
                        this.style[c] = css[c];
                    });
                }
            }
            else {
                if (val) {
                    this.each(function () {
                        this.style[css] = val;
                    });
                }
                else {
                    this.each(function () {
                        if (this.currentStyle) {
                            cssstr = this.currentStyle[css];
                        }
                        else {
                            cssstr = getComputedStyle(this, false)[css];
                        }
                    });
                    return cssstr;
                }
            }
            return this;
        },
        //获得属性
        attr: function (attr, val) {
            var str = '', s;
            if (val) {
                this.each(function () {
                    this.setAttribute(attr, val);
                    attr.toLowerCase() == 'class' && (this.className = val);
                    attr.toLowerCase() == 'style' && (this.style.cssText = val);
                });
            }
            else {
                this.each(function () {
                    s = this.getAttribute(attr);
                    str = s;
                    attr.toLowerCase() == 'class' && (str = this.className);
                    attr.toLowerCase() == 'style' && (str = this.style.cssText);
                });
                return str;
            }
            return this;
        },
        //删除属性
        removeattr: function (attr) {
            this.each(function () {
                this.removeAttribute(attr);
            });
            return this;
        },
        //判断是否存在class
        hasClass: function (str) {
            return new RegExp('\\b' + str + '\\b').test(this.Selector[0].className);
        },
        //添加class
        addClass: function (cls) {
            this.each(function () {
                FC(this).hasClass(cls) || (this.className += ' ' + cls);
                this.className = FC.trim(this.className);
            });
            return this;
        },
        //删除class
        removeClass: function (cls) {
            var c = FC.trim(cls), reg = new RegExp('\\b' + c + '\\b');
            this.each(function () {
                if (FC(this).hasClass(c)) {
                    this.className = FC.trim(this.className.replace(reg, ''));
                }
            });
            return this;
        }
    }
    FC.fn.init.prototype = FC.fn;
    FC.extend = FC.fn.extend = function (source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                this[p] = source[p];
            }
        }
        return this;
    };
    //给FC添加属性
    FC.extend({
        //设置css
        css: function (dom, css) {
            var cssstr = '';
            if (dom.currentStyle) {
                cssstr = dom.currentStyle[css];
            }
            else {
                cssstr = getComputedStyle(dom, false)[css];
            }
            return cssstr;
        },
        //遍历执行
        each: function (obj, fn) {
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                if (typeof fn == 'function') {
                    fn.call(obj[i], i);
                }
            }
        },
        //去空格
        trim: function (s) {//去除前后多于空格
            s = s || '';
            return s.replace(/^\s*|\s*$/g, '');
        },
        //json格式化
        jsonparse: function (str) {
            return window.JSON ? JSON.parse(str) : FC._fn.json().parse(str);
        },
        jsonstringify: function (data) {
            return window.JSON ? JSON.stringify(data) : FC._fn.json().stringify(data);
        },
        //简易ajax
        ajax: function (obj) {
            var xhr = FC._fn.createXHR();
            obj.url = obj.url + "?rand=" + Math.random();
            obj.data = FC._fn.params(obj.data);
            if (obj.type === "get") {
                obj.url += obj.url.indexOf("?") == "-1" ? "?" + obj.data : "&" + obj.data;
            }
            // 异步
            if (obj.async === true) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        callBack();
                    }
                }
            }
            xhr.open(obj.type, obj.url, obj.async);
            if (obj.type === "post") {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(obj.data);
            } else {
                xhr.send(null);
            }
            // 同步
            if (obj.async === false) {
                callBack();
            }
            function callBack() {
                if (xhr.status == 200) {
                    obj.success(xhr.responseText);
                } else {
                    obj.Error("获取数据失败，错误代号为：" + xhr.status + "错误信息为：" + xhr.statusText);
                }
            }
        },
        //可视内容尺寸
        client: function () {
            var _height = document.documentElement.clientHeight || document.body.clientHeight; //当前页面可视高度
            var _width = document.documentElement.clientWidth || document.body.clientWidth; //当前页面可视高度
            this.client.height = _height;
            this.client.width = _width;
            return this.client;
        },
        //实际内容尺寸
        scroll: function (obj) {
            if (obj) {
                var o = {
                    x: obj.x || 0,
                    y: obj.y || 0
                }
                window.scrollTo(o.x, o.y);
            }
            var _width = document.documentElement.scrollWidth || document.body.scrollWidth,//实际内容宽度
                _height = document.documentElement.scrollHeight || document.body.scrollHeight;//实际内容高度
            var _top = document.documentElement.scrollTop || document.body.scrollTop; //当前滚动条滚动高度
            var _left = document.documentElement.scrollLeft || document.body.scrollLeft; //当前滚动条滚动高度
            this.scroll.width = _width;
            this.scroll.height = _height;
            this.scroll.left = _left;
            this.scroll.top = _top;
            return this.scroll;
        },
        //滚动条事件
        scroll_fn: function (func) {
            var oldonscroll = window.onscroll;
            if (typeof window.onscroll != 'function') {
                window.onscroll = func;
            } else {
                window.onscroll = function () {
                    oldonscroll();
                    func();
                }
            }
            return this;
        },
        //窗口变化事件
        resize_fn: function (func) {
            var oldonresize = window.onresize;
            if (typeof window.onresize != 'function') {
                window.onresize = func;
            } else {
                window.onresize = function () {
                    oldonresize();
                    func();
                }
            }
            return this;
        },
        //cookie操作
        cookie: function () {
            this.cookie.get = function (n) {
                var re = new RegExp("(?:;)?" + n + "=([^;]*);?");
                if (re.test(document.cookie)) {
                    return decodeURIComponent(RegExp["$1"]);
                } else {
                    return null;
                }
            }
            this.cookie.set = function (n, v) {
                var eTime = new Date();
                eTime.setTime(eTime.getTime() + (7 * 8.64e7));
                var path = "/";
                var domain;
                var secure;
                var sCookie = n + "=" + encodeURIComponent(v) + ";expires=" + eTime.toGMTString() + "; path=" + path;
                document.cookie = sCookie;
            }
            this.cookie.del = function (n) {
                var path = "/";
                var domain;
                var secure;
                var sCookie = n + "=" + "" + ";expires=" + new Date(0).toGMTString() + "; path=" + path;
                document.cookie = sCookie;
            }
            return this.cookie;
        },
        //url字符串操作 
        urlparam: function () {
            this.urlparam.get = function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return r[2];
                return null;
            }
            this.urlparam.set = function (url, ref, value) {
                var str = "";
                var urlstr = "";
                urlstr = url.toString();
                if (urlstr.indexOf("?") != -1)
                    str = urlstr.substr(urlstr.indexOf('?') + 1);
                else
                    return url + "?" + ref + "=" + value;
                var returnurl = "";
                var setparam = "";
                var arr;
                var modify = "0";

                if (str.indexOf('&') != -1) {
                    arr = str.split('&');

                    for (i in arr) {
                        if (arr[i].split('=')[0] == ref) {
                            setparam = value;
                            modify = "1";
                        }
                        else {
                            setparam = arr[i].split('=')[1];
                        }
                        returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
                    }

                    returnurl = returnurl.substr(0, returnurl.length - 1);

                    if (modify == "0")
                        if (returnurl == str)
                            returnurl = returnurl + "&" + ref + "=" + value;
                }
                else {
                    if (str.indexOf('=') != -1) {
                        arr = str.split('=');

                        if (arr[0] == ref) {
                            setparam = value;
                            modify = "1";
                        }
                        else {
                            setparam = arr[1];
                        }
                        returnurl = arr[0] + "=" + setparam;
                        if (modify == "0")
                            if (returnurl == str)
                                returnurl = returnurl + "&" + ref + "=" + value;
                    }
                    else
                        returnurl = ref + "=" + value;
                }
                return urlstr.substr(0, urlstr.indexOf('?')) + "?" + returnurl;
            }
            this.urlparam.del = function (url, ref) {
                var str = "";
                if (url.indexOf('?') != -1) {
                    str = url.substr(url.indexOf('?') + 1);
                }
                else {
                    return url;
                }
                var arr = "";
                var returnurl = "";
                var setparam = "";
                if (str.indexOf('&') != -1) {
                    arr = str.split('&');
                    for (i in arr) {
                        if (arr[i].split('=')[0] != ref) {
                            returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                        }
                    }
                    return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
                }
                else {
                    arr = str.split('=');
                    if (arr[0] == ref) {
                        return url.substr(0, url.indexOf('?'));
                    }
                    else {
                        return url;
                    }
                }
            }
            return this.urlparam;
        },
        //浏览嗅探
        useragent: function () {
            var ua = navigator.userAgent.toLowerCase(),
                reg = {
                    ie: /msie ([\d.]+)/,
                    firefox: /firefox\/([\d.]+)/,
                    chrome: /chrome\/([\d.]+)/,
                    opera: /opera.([\d.]+)/,
                    safari: /version\/([\d.]+).*safari/
                };
            this.useragent.ie = '';
            this.useragent.firefox = '';
            this.useragent.chrome = '';
            this.useragent.opera = '';
            this.useragent.safari = '';
            this.useragent.other = '';
            for (var r in reg) {
                if (ua.match(reg[r])) {
                    this.useragent[r] = r;
                    break;
                }
            }
            return this.useragent;
        },
        //判断是否是ie
        getie: function () {
            if (window.attachEvent) {
                return true;
            }
            else {
                return false;
            }
        },
        //是否是ie678
        getoldie: function () {
            if (this.getie()) {
                if (window.addEventListener) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        },
        //动态添加外部css
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
        },
        //禁用鼠标右键
        contextmenu: function () {
            document.oncontextmenu = function (e) {
                e = e || window.event;
                e.returnValue = false;
                return false;
            }
        }
    });
    //给FC.fn添加属性
    FC.fn.extend({
        val: function (v) {
            var val = '';
            if (v) {
                this.each(function () {
                    this.value = v;
                });
            }
            else {
                this.each(function () {
                    val = this.value;
                });
                return val;
            }
            return this;
        },
        html: function (html) {
            var str = '';
            if (html) {
                this.each(function () {
                    this.innerHTML = html;
                });
            } else {
                this.each(function () {
                    str = this.innerHTML;
                });
                return str;
            }
        },
        text: function (text) {
            var str = '';
            if (text) {
                this.each(function () {
                    if (this.textContent || this.textContent == '') {
                        this.textContent = text;

                    } else {
                        this.innerText = text;
                    }
                });
            } else {
                this.each(function () {
                    if (this.textContent || this.textContent == '') {
                        str = this.textContent;

                    } else {
                        str = this.innerText;
                    }
                });
                return str;
            }
            return this;
        },
        width: function (w) {
            var returnw = 0, display = '', left = '', position = '';
            if (w) {
                this.each(function () {
                    this.style['width'] = w + "px";
                });
            }
            else {
                this.each(function () {
                    if (FC.css(this, 'display') == 'none') {
                        display = this.style["display"];
                        left = this.style["left"];
                        position = this.style["position"];
                        this.style["position"] = 'absolute';
                        this.style["left"] = '-10000px';
                        this.style["display"] = 'block';
                        returnw = this.style["width"] ? this.style["width"].slice(0, -2) : this.scrollWidth;
                        this.style["position"] = position;
                        this.style["left"] = left;
                        this.style["display"] = display;
                    }
                    else {
                        returnw = this.style["width"] ? this.style["width"].slice(0, -2) : this.scrollWidth;
                    }
                });
                return returnw;
            }
            return this;
        },
        height: function (h) {
            var returnh = 0;
            if (h) {
                this.each(function () {
                    this.style['height'] = h + "px";
                });
            }
            else {
                this.each(function () {
                    if (FC.css(this, 'display') == 'none') {
                        display = this.style["display"];
                        left = this.style["left"];
                        position = this.style["position"];
                        this.style["position"] = 'absolute';
                        this.style["left"] = '-10000px';
                        this.style["display"] = 'block';
                        returnw = this.style["height"] ? this.style["width"].slice(0, -2) : this.scrollHeight;
                        this.style["position"] = position;
                        this.style["left"] = left;
                        this.style["display"] = display;
                    }
                    else {
                        returnw = this.style["height"] ? this.style["width"].slice(0, -2) : this.scrollHeight;
                    }
                });
                return returnw;
            }
            return this;
        },
        outerWidth: function (w) {
            var returnw = 0;
            this.each(function () {
                if (FC.css(this, 'display') == 'none') {
                    display = this.style["display"];
                    left = this.style["left"];
                    position = this.style["position"];
                    this.style["position"] = 'absolute';
                    this.style["left"] = '-10000px';
                    this.style["display"] = 'block';
                    returnw = this.offsetWidth;
                    this.style["position"] = position;
                    this.style["left"] = left;
                    this.style["display"] = display;
                }
                else {
                    returnw = this.offsetWidth;
                }
            });
            return returnw;
        },
        outerHeight: function (h) {
            var returnh = 0;
            this.each(function () {
                if (FC.css(this, 'display') == 'none') {
                    display = this.style["display"];
                    left = this.style["left"];
                    position = this.style["position"];
                    this.style["position"] = 'absolute';
                    this.style["left"] = '-10000px';
                    this.style["display"] = 'block';
                    returnw = this.offsetHeight;
                    this.style["position"] = position;
                    this.style["left"] = left;
                    this.style["display"] = display;
                }
                else {
                    returnw = this.offsetHeight;
                }
            });
            return returnw;
        },
        //当前元素的相对位置
        offset: function () {
            var obj, el, box;
            this.each(function () {
                el = this;
                if (el.getBoundingClientRect)//支持getBoundingClientRect的浏览器操作
                {
                    box = el.getBoundingClientRect();
                    obj = {
                        left: box.left + FC.scroll().left,
                        top: box.top + FC.scroll().top
                    };
                }
                else {
                    alert('浏览器版本过低，请使用高级浏览浏览')
                }
            });
            return obj;
        },
        //hover事件
        hover: function (fn1, fn2) {
            this.mouseenter(fn1);
            this.mouseleave(fn2);
            return this;
        },
        mouseenter: function (fn) {
            var f = true;
            if (this.Selector.length > 0) {
                if (this.Selector[0].attachEvent) {
                    this.on("mouseenter", fn);
                }
                else {
                    this.on("mouseover", function (e) {
                        if (f) {
                            var mya = (e.srcElement ? e.srcElement : e.target);
                            var parent = e.relatedTarget || e.fromElement;
                            while (parent && parent != this) {
                                try { parent = parent.parentNode; }
                                catch (e) { break; }
                            }
                            if (parent != this) {
                                f = (function () { fn.call(this, e); return true; })();
                            }
                        }
                    });
                }
            }
            return this;
        },
        mouseleave: function (fn) {
            if (this.Selector.length > 0) {
                if (this.Selector[0].attachEvent) {
                    this.on("mouseleave", fn);
                }
                else {
                    this.on("mouseout", function (e) {
                        var mya = (e.srcElement ? e.srcElement : e.target);
                        var parent = e.relatedTarget || e.toElement;
                        while (parent && parent != this) {
                            try { parent = parent.parentNode; }
                            catch (e) { break; }
                        }
                        if (parent != this) { fn.call(this, e); }
                    });
                }
            }
            return this;
        },
        //鼠标滑轮事件
        mousewheel: function (fn) {
            var wheel = false, wheelitem = 0;
            this.each(function (i) {
                var _ts = this;
                if (_ts.attachEvent) {
                    _ts.attachEvent('onmousewheel', function (e) {
                        e = e || window.event;
                        var act = e.wheelDelta ? e.wheelDelta / 120 : (0 - e.detail / 3);
                        wheelitem += act;
                        if (wheel) clearTimeout(wheel);
                        wheel = setTimeout(function () {
                            fn.call(wheelitem, e, _ts, i);
                            wheelitem = 0;
                        }, 100);
                    });
                }
                else {
                    _ts.addEventListener('DOMMouseScroll', function (e) {
                        e = e || window.event;
                        var act = e.wheelDelta ? e.wheelDelta / 120 : (0 - e.detail / 3);
                        wheelitem += act;
                        if (wheel) clearTimeout(wheel);
                        wheel = setTimeout(function () {
                            fn.call(wheelitem, e, _ts, i);
                            wheelitem = 0;
                        }, 100);
                    }, false);
                    _ts.addEventListener('mousewheel', function (e) {
                        e = e || window.event;
                        var act = e.wheelDelta ? e.wheelDelta / 120 : (0 - e.detail / 3);
                        wheelitem += act;
                        if (wheel) clearTimeout(wheel);
                        wheel = setTimeout(function () {
                            fn.call(wheelitem, e, _ts, i);
                            wheelitem = 0;
                        }, 100);

                    }, false);
                }
            });
        },
        //禁止用户选中内容
        userselect: function () {
            this.on("mousedown", function (e) {
                var _ts = this;
                //设置捕获范围
                if (_ts.setCapture) {
                    _ts.setCapture();
                }
                else {
                    if (window.captureEvents) {
                        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
                    }
                }
                document.body.style.MozUserSelect = "none";
                document.onselectstart = function () { return false; };
                document.onmouseup = function (e) {
                    if (_ts.setCapture) {
                        _ts.releaseCapture();
                    }
                    else {
                        if (window.captureEvents) {
                            window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP)
                        }
                    }
                    document.onselectstart = function () { return true; };
                    document.body.style.MozUserSelect = "";
                    document.onmouseup = null;
                }
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                if (FC.useragent().firefox) {
                    return false;
                }
            });
            return this;
        },
        //动画队列
        movearr: {},
        //简易动画
        move: function (obj, t, easing, fn) {
            var exts = this,
                argarr = arguments,
                arglen = argarr.length,
                a1 = obj, a2 = 500, a3 = '', a4,
                class_move = function (dom, option, t, easing, fn, i) {
                    this.dom = dom;//运动元素
                    this.option = option;//运动参数
                    this.optioncopy = {};//运动参数比较
                    this.t = t;//速度
                    this.easing = easing;//加速算子
                    this.tstart;
                    this.tend;
                    this.callback = fn;
                    this.setout;
                    this.i = i;//动画队列标识
                };
            class_move.prototype = {
                //初始化
                init: function () {
                    var _ts = this;
                    _ts.tstart = _ts.gettimes();//等到开始时间
                    for (var o in _ts.option) {//将已有css信息修改
                        _ts.option[o] = _ts.option[o] - _ts.getstyle(o);
                        _ts.optioncopy[o] = +_ts.getstyle(o);
                    }
                    _ts.start();
                },
                //开始运动
                start: function () {
                    var _ts = this,
                        thisdom = _ts.dom,
                        option = _ts.option,
                        optioncopy = _ts.optioncopy,
                        setstyle = _ts.setstyle,
                        getstyle = _ts.getstyle,
                        callback = _ts.callback,
                        t = _ts.t;
                    _ts.setout = setTimeout(function () {
                        _ts.tend = _ts.gettimes();
                        var move_w_h = 0, times = (_ts.tend - _ts.tstart);
                        if (times >= t) times = t;
                        for (var o in option) {
                            if (_ts.easing) {
                                move_w_h = optioncopy[o] + FC.easing[_ts.easing]('', times, 0, option[o], t);//算子
                            }
                            else {
                                move_w_h = optioncopy[o] + times / t * option[o];//匀速
                            }
                            setstyle(_ts, o, move_w_h);
                        }
                        if (times >= t) {
                            if (callback && typeof callback == 'function') {
                                callback.call(thisdom, exts);//执行回调函数
                                _ts.end(_ts);
                            }
                            exts.movearr['move' + _ts.i] = null;
                        }
                        else {
                            _ts.setout = setTimeout(arguments.callee, 13);
                        }
                    }, 13);

                },
                //运动结束
                end: function () {
                    _ts = null;
                },
                uninit: function () {
                    clearTimeout(this.setout);
                },
                //运动时间
                gettimes: function () {
                    var dtime = new Date();
                    return dtime.getHours() * 3600 * 1000 + dtime.getMinutes() * 60 * 1000 + dtime.getSeconds() * 1000 + dtime.getMilliseconds();
                },
                //获得css值
                getstyle: function (attr) {
                    return this.dom.currentStyle ? this.dom.currentStyle[attr].slice(0, -2) : getComputedStyle(this.dom, false)[attr].slice(0, -2);
                },
                //设置css值
                setstyle: function (obj, attr, val) {
                    obj.dom.style[attr] = val + "px";
                }
            }
            if (t && typeof t == "number") a2 = t;
            if (t && typeof t == "function") a4 = t;
            if (t && typeof t == "string") a3 = t;
            if (easing && typeof easing == "function") a4 = easing;
            if (easing && typeof easing == "string") a3 = easing;
            if (fn) a4 = fn;
            this.each(function (i) {
                var move = exts.movearr['move' + i];//添加队列，但未实现
                if (!move) {
                    var move = exts.movearr['move' + i] = new class_move(this, a1, a2, a3, a4, i);
                    move.init();
                }
            });
            return this;
        },
        stop: function () {
            var movearr = this.movearr;
            this.each(function (i) {
                var move = movearr['move' + i];
                if (move) {
                    move.uninit();
                    movearr['move' + i] = null;
                }
            });
            return this;
        }
    });
    FC._fn = {
        //json
        json: function (data) {
            function f(n) {
                return n < 10 ? "0" + n : n
            }
            if (typeof Date.prototype.toJSON !== "function") {
                Date.prototype.toJSON = function (key) {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
                };
                String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
                    return this.valueOf()
                }
            }
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
            function quote(string) {
                escapable.lastIndex = 0;
                return escapable.test(string) ? '"' + string.replace(escapable,
                function (a) {
                    var c = meta[a];
                    return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + string + '"'
            }
            function str(key, holder) {
                var i, k, v, length, mind = gap,
                partial, value = holder[key];
                if (value && typeof value === "object" && typeof value.toJSON === "function") {
                    value = value.toJSON(key)
                }
                if (typeof rep === "function") {
                    value = rep.call(holder, key, value)
                }
                switch (typeof value) {
                    case "string":
                        return quote(value);
                    case "number":
                        return isFinite(value) ? String(value) : "null";
                    case "boolean":
                    case "null":
                        return String(value);
                    case "object":
                        if (!value) {
                            return "null"
                        }
                        gap += indent;
                        partial = [];
                        if (Object.prototype.toString.apply(value) === "[object Array]") {
                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || "null"
                            }
                            v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                            gap = mind;
                            return v
                        }
                        if (rep && typeof rep === "object") {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                k = rep[i];
                                if (typeof k === "string") {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ": " : ":") + v)
                                    }
                                }
                            }
                        } else {
                            for (k in value) {
                                if (Object.hasOwnProperty.call(value, k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ": " : ":") + v)
                                    }
                                }
                            }
                        }
                        v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                        gap = mind;
                        return v
                }
            }
            if (typeof this.json.stringify !== "function") {
                this.json.stringify = function (value, replacer, space) {
                    var i;
                    gap = "";
                    indent = "";
                    if (typeof space === "number") {
                        for (i = 0; i < space; i += 1) {
                            indent += " "
                        }
                    } else {
                        if (typeof space === "string") {
                            indent = space
                        }
                    }
                    rep = replacer;
                    if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                        throw new Error("JSON2.stringify")
                    }
                    return str("", {
                        "": value
                    })
                }
            }
            if (typeof this.json.parse !== "function") {
                this.json.parse = function (text, reviver) {
                    var j;
                    function walk(holder, key) {
                        var k, v, value = holder[key];
                        if (value && typeof value === "object") {
                            for (k in value) {
                                if (Object.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v
                                    } else {
                                        delete value[k]
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value)
                    }
                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx,
                        function (a) {
                            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                        })
                    }
                    if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                        j = eval("(" + text + ")");
                        return typeof reviver === "function" ? walk({
                            "": j
                        },
                        "") : j
                    }
                    throw new SyntaxError("JSON2.parse")
                }
            }
            return this.json;
        },
        createXHR: function () {
            if (typeof XMLHttpRequest != "undefined") {//非ie
                return new XMLHttpRequest();
            }
            else if (typeof ActiveXObject != "undefined") {//ie
                var version = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", ];
                for (var i = 0, j = version.length; i < j; i++) {
                    try {
                        return new ActiveXObject(version[i]);
                    }
                    catch (e) {
                    }
                }
            } else {
                // throw new Error("您的系统或浏览器不支持XHR对象！");
            }
        },
        params: function (data) {
            var arr = [];
            for (var i in data) {
                arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
            }
            return arr.join("&");
        }
    };
    FC.easing = {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) { return FC.easing[FC.easing.def](x, t, b, c, d); },
        easeInQuad: function (x, t, b, c, d) { return c * (t /= d) * t + b; },
        easeOutQuad: function (x, t, b, c, d) { return -c * (t /= d) * (t - 2) + b },
        easeInOutQuad: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * ((--t) * (t - 2) - 1) + b },
        easeInCubic: function (x, t, b, c, d) { return c * (t /= d) * t * t + b },
        easeOutCubic: function (x, t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b },
        easeInOutCubic: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b },
        easeInQuart: function (x, t, b, c, d) { return c * (t /= d) * t * t * t + b },
        easeOutQuart: function (x, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b },
        easeInOutQuart: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b; return -c / 2 * ((t -= 2) * t * t * t - 2) + b },
        easeInQuint: function (x, t, b, c, d) { return c * (t /= d) * t * t * t * t + b },
        easeOutQuint: function (x, t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b },
        easeInOutQuint: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b },
        easeInSine: function (x, t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b },
        easeOutSine: function (x, t, b, c, d) { return c * Math.sin(t / d * (Math.PI / 2)) + b },
        easeInOutSine: function (x, t, b, c, d) { return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b },
        easeInExpo: function (x, t, b, c, d) { return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b },
        easeOutExpo: function (x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b },
        easeInOutExpo: function (x, t, b, c, d) { if (t == 0) return b; if (t == d) return b + c; if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b; return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b },
        easeInCirc: function (x, t, b, c, d) { return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b },
        easeOutCirc: function (x, t, b, c, d) { return c * Math.sqrt(1 - (t = t / d - 1) * t) + b },
        easeInOutCirc: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b },
        easeInElastic: function (x, t, b, c, d) {
            var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3; if (a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a); return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3; if (a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a); return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5); if (a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
        },
        easeInBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; return c * (t /= d) * t * ((s + 1) * t - s) + b },
        easeOutBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
        },
        easeInBounce: function (x, t, b, c, d) { return c - FC.easing.easeOutBounce(x, d - t, 0, c, d) + b },
        easeOutBounce: function (x, t, b, c, d) { if ((t /= d) < (1 / 2.75)) { return c * (7.5625 * t * t) + b; } else if (t < (2 / 2.75)) { return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b; } else if (t < (2.5 / 2.75)) { return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b; } else { return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b; } },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d / 2) return FC.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b; return FC.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    };
})(window);