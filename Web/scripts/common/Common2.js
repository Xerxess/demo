(function (w, d) {
    if (!window.common) {
        window.common = {};
    }
    var commonjs = {
        //offset兼容//element：dom元素//elementId:指定id可不要
        getElementPos: function (element, elementId) {
            var ua = navigator.userAgent.toLowerCase();
            var isOpera = (ua.indexOf('opera') != -1);
            var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
            var numargs = arguments.length; //获数个数
            var el;
            if (numargs === 1) {//利于循环时获得offset
                el = element;
            }
            else if (numargs === 2) {//利于指定id获得offset
                el = document.getElementById(elementId);
            }
            if (el.parentNode === null || el.style.display == 'none') {
                return false;
            }
            var parent = null;
            var pos = [];
            var box;
            if (el.getBoundingClientRect) //IE
            {
                box = el.getBoundingClientRect();
                var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                return {
                    left: box.left + scrollLeft,
                    top: box.top + scrollTop
                };
            } else if (document.getBoxObjectFor) //gecko
            {
                box = document.getBoxObjectFor(el);
                var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
                var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
                pos = [box.x - borderLeft, box.y - borderTop];
            } else // safari & opera
            {
                pos = [el.offsetLeft, el.offsetTop];
                parent = el.offsetParent;
                if (parent != el) {
                    while (parent) {
                        pos[0] += parent.offsetLeft;
                        pos[1] += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                }
                if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
                    pos[0] -= document.body.offsetLeft;
                    pos[1] -= document.body.offsetTop;
                }
            }
            if (el.parentNode) {
                parent = el.parentNode;
            } else {
                parent = null;
            }
            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
                pos[0] -= parent.scrollLeft;
                pos[1] -= parent.scrollTop;
                if (parent.parentNode) {
                    parent = parent.parentNode;
                } else {
                    parent = null;
                }
            }
            return {
                left: pos[0],
                top: pos[1]
            };
        },

        //自定义事件
        EventUtil: {
            addHandler: function (element, type, handler) {
                if (element.addEventListener) {
                    element.addEventListener(type, handler, false);
                }
                else if (element.attachEvent) {
                    element.attachEvent(type);
                }
                else {
                    element["on" + type] = handler;
                }
            },
            removeHandler: function (element, type, handler) {
                if (element.addEventListener) {
                    element.removeEventListener(type, handler, false)
                }
                else if (element.attachEvent) {
                    element.detachEvent(type)
                }
                else {
                    element["on" + type] = null;
                }
            }
        },
        //添加替换onload事件
        addLoadEvent: {
            load: function (func) {
                var oldonload = window.onload;
                if (typeof window.onload != 'function') {
                    window.onload = func;
                } else {
                    window.onload = function () {
                        oldonload();
                        func();
                    }
                }
            },
            scroll: function (func) {
                var oldonscroll = window.onscroll;
                if (typeof window.onscroll != 'function') {
                    window.onscroll = func;
                } else {
                    window.onscroll = function () {
                        oldonscroll();
                        func();
                    }
                }
            },
            resize: function (func) {
                var oldonresize = window.onresize;
                if (typeof window.onresize != 'function') {
                    window.onresize = func;
                } else {
                    window.onresize = function () {
                        oldonresize();
                        func();
                    }
                }
            }
        },
        //异步加载css
        loadCss: function (url) {
            var s = document.createElement("link");
            s.href = url;
            s.rel = "stylesheet";
            s.type = "text/css";
            document.getElementsByTagName("head")[0].appendChild(s);
        },
        ///异步加载js//url:文件地址//callback：回调函数
        loadScript: function (url, callback) {
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
        ///检测是否是ie
        getie: function () {
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                return true;
            }
            else {
                return false;
            }
        },
        ///检测浏览
        getOs: function () {
            var OsObject = "";
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                if (navigator.userAgent.indexOf("MSIE 4.0") > 0) {
                    return "ie4";
                }
                if (navigator.userAgent.indexOf("MSIE 5.0") > 0) {
                    return "ie5";
                }
                if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                    return "ie6";
                }
                if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
                    return "ie7";
                }
                if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
                    return "ie8";
                }
                if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
                    return "ie9";
                }
            }
            if (navigator.userAgent.indexOf("Chrome") > 0) {
                return "Chrome";
            }
            if (navigator.userAgent.indexOf("Firefox") > 0) {
                return "Firefox";
            }
            if (navigator.userAgent.indexOf("Safari") > 0) {
                return "Safari";
            }
            if (navigator.userAgent.indexOf("Camino") > 0) {
                return "Camino";
            }
            if (navigator.userAgent.indexOf("Gecko/") > 0) {
                return "Gecko";
            }
        },
        /////获取url 参数//name:key值
        UrlParam: {
            //获得url参数
            get: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null)
                    return r[2];
                return null;
            },
            //修改url参数值，ref参数名,value新的参数值
            set: function (url, ref, value) {
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
            },
            //删除指定url键值//url:地址//ref所要删除的key
            del: function (url, ref) {
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
        },
        //正则验证
        Reg: function (str, i, reg_str) {
            var regstr = "";
            switch (i) {
                case 0: //手机验证
                    regstr = "/^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/";
                    break;
                case 1: //邮箱验证
                    regstr = "/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/";
                    break;
                case 2: //用户名验证
                    regstr = "/^[a-zA-Z0-9_]{5,16}$/";
                    break;
                case 3: //密码验证
                    regstr = "/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{5,22}$/";
                    break;
                case 4: //数字验证
                    regstr = "/^[0-9]*$/";
                    break;
                case 5: //英文验证
                    regstr = "/^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/";
                    break;
                case 6: //两位小数价格验证
                    regstr = "/^[0-9]+\.{0,1}[0-9]{0,2}$/";
                    break;
                case 7:
                    regstr = reg_str;
                    break;
            }
            var b = true;
            if (!regstr.test(str, str)) {
                b = false;
            }
            return b;
        },
        cookie: {
            //------------------------------------------Get start------------------------------------------// 
            //读取cookie,n为cookie名 
            Get: function (n) {
                //根据cookie名建立一个正则表达式
                var re = new RegExp("(?:;)?" + n + "=([^;]*);?");
                //判断是否有返回值
                if (re.test(document.cookie)) {
                    //从cookie中取出值,并返回
                    return decodeURIComponent(RegExp["$1"]);
                } else {
                    //返回null
                    return null;
                }
            }, //读取cookie结束
            //写入cookie,n为cookie名，v为value 
            Set: function (n, v) {
                //创建一个时间对象t
                var eTime = new Date();
                //Cookie失效时间为默认7天,8.64e7 一天, 3.6e6 一小时 
                eTime.setTime(eTime.getTime() + (7 * 8.64e7));
                //Cookie路径
                var path = "/";
                //Cookie域
                var domain;
                //Cookie安全标志
                var secure;
                //定义一个字符串变量,用来存放Cookie的属性值
                var sCookie = n + "=" + encodeURIComponent(v) + ";expires=" + eTime.toGMTString() + "; path=" + path;
                //将信息写入cookie
                document.cookie = sCookie;
            }, //写入cookie结束
            //删除cookie
            Del: function (n) {
                //Cookie路径
                var path = "/";
                //Cookie域
                var domain;
                //Cookie安全标志
                var secure;
                //定义一个字符串变量,用来存放Cookie的属性值
                var sCookie = n + "=" + "" + ";expires=" + new Date(0).toGMTString() + "; path=" + path;
                //将信息写入cookie
                document.cookie = sCookie;
            }
        },
        //滚动条高度
        scroll: function (dom) {
            var numargs = arguments.length; //获数个数
            if (numargs == 1) {//获得窗口高度宽度
                var _width = document.documentElement.scrollWidth, _height = 0;
                if (this.getie()) {
                    _height = document.documentElement.scrollHeight;
                }
                else if (this.getOs() == "Chrome") {
                    _height = document.documentElement.scrollHeight;
                }
                else if (this.getOs() == "Firefox") {
                    _height = document.documentElement.scrollHeight;
                }
                else if (this.getOs() == "Chrome") {
                    _height = document.documentElement.scrollHeight;
                }
                else if (this.getOs() == "Safari") {
                    _height = document.body.scrollHeight;
                }
                else {
                    _height = document.documentElement.offsetHeight;
                }
                return {
                    width: _width,
                    height: _height
                };
            }
            else {
                var _top = document.documentElement.scrollTop || document.body.scrollTop; //当前滚动条滚动高度
                var _left = document.documentElement.scrollLeft || document.body.scrollLeft; //当前滚动条滚动高度
                return {
                    left: _left,
                    top: _top
                };
            }
        },
        //可视高度
        client_w_h: function () {
            var _Height = document.documentElement.clientHeight || document.body.clientHeight; //当前页面可视高度
            var _Width = document.documentElement.clientWidth || document.body.clientWidth; //当前页面可视高度
            return {
                height: _Height,
                width: _Width
            };
        },
        //返回检索ClassName集合
        getElementsByClassName: function (className) {
            var all = document.all ? document.all : document.getElementsByTagName(' *');
            var elements = new Array();
            for (var e = 0; e < all.length; e++) {
                if (all[e].className == className) {
                    elements[elements.length] = all[e];
                }
            }
            return elements;
        },
        //获得第一个元素节点
        get_firstchild: function (n) {
            var x = n.firstChild;
            while (x.nodeType != 1) {
                x = x.nextSibling;
            }
            return x;
        }
    }; //结束
    //设置对象
    common = commonjs;
})(window, document);