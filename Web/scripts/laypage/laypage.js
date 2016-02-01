/*!
 
 @Name : layPage v1.3- 分页插件
 @Author: 贤心
 @Site：http://sentsin.com/layui/laypage
 @License：MIT
 
 */

;
!function () {
    "use strict";

    function laypage(options) {

        var skin = 'laypagecss';
        laypage.dir = 'dir' in laypage ? laypage.dir : Page.getpath + '/skin/laypage.css';
        if (laypage.dir && !doc[id](skin)) {
           // Page.use(laypage.dir, skin);
        }
        return new Page(options);
    }

    laypage.v = '1.3';
    var doc = document, id = 'getElementById', tag = 'getElementsByTagName';
    var index = 0, Page = function (options) {
        var that = this;
        var conf = that.config = options || {};
        conf.item = index++;
        if (options['pageitems']) {
            conf.listitem = options['pageitems'][0];
        }
        else {
            conf.listitem = 15;
        }
        that.render(true);
    };

    Page.on = function (elem, even, fn) {
        elem.attachEvent ? elem.attachEvent('on' + even, function () {
            fn.call(elem, window.even); //for ie, this指向为当前dom元素
        }) : elem.addEventListener(even, fn, false);
        return Page;
    };
    Page.hasClass = function (dom, str) {
        return new RegExp('\\b' + str + '\\b').test(dom.className);
    };
    Page.css = function (dom, css, v) {
        if (typeof css == 'object') {
            for (var c in css) {
                dom.style[c] = css[c];
            }
        }
        else {
            dom.style[c] = css;
        }
        if (v) {
            if (this.currentStyle) {
                return dom.currentStyle[v];
            }
            else {
                return window.getComputedStyle(dom, false)[v];
            }
        }
    };
    Page.client = function () {
        var _height = document.documentElement.clientHeight || document.body.clientHeight; //当前页面可视高度
        var _width = document.documentElement.clientWidth || document.body.clientWidth; //当前页面可视高度
        return {
            width: _width,
            height: _height
        };
    };
    Page.scroll = function (obj) {
        if (obj) {
            var o = {
                x: obj.x || 0,
                y: obj.y || 0
            };
            window.scrollTo(o.x, o.y);
        }
        var _width = document.documentElement.scrollWidth || document.body.scrollWidth, //实际内容宽度
                _height = document.documentElement.scrollHeight || document.body.scrollHeight;//实际内容高度
        var _top = document.documentElement.scrollTop || document.body.scrollTop; //当前滚动条滚动高度
        var _left = document.documentElement.scrollLeft || document.body.scrollLeft; //当前滚动条滚动高度
        return {
            'width': _width,
            'height': _height,
            'left': _left,
            'top': _top
        };
    };
    Page.offset = function (dom) {
        var el = dom;
        if (el.getBoundingClientRect)//支持getBoundingClientRect的浏览器操作
        {
            var box = el.getBoundingClientRect();
            var scroll = Page.scroll();
            return {
                left: box.left + scroll.left,
                top: box.top + scroll.top
            };
        }
        else {
            alert('浏览器版本过低，请使用高级浏览浏览');
            return;
        }

    };
    Page.height = function (dom, h) {
        var returnh = 0;
        if (h) {
            this.each(function () {
                dom.style['height'] = h + "px";
            });
        }
        else {
            if (Page.css(dom, {}, 'display') === 'none') {
                var display = dom.style["display"];
                var left = dom.style["left"];
                var position = dom.style["position"];
                dom.style["position"] = 'absolute';
                dom.style["left"] = '-10000px';
                dom.style["display"] = 'block';
                returnh = dom.style["height"] ? dom.style["height"].slice(0, -2) : dom.scrollHeight;
                dom.style["position"] = position;
                dom.style["left"] = left;
                dom.style["display"] = display;
            }
            else {
                returnh = dom.style["height"] ? dom.style["height"].slice(0, -2) : dom.scrollHeight;
            }
            return returnh;
        }
    };
    Page.getpath = (function () {
        var js = document.scripts, jsPath = js[js.length - 1].src;
        return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
    }());
    Page.use = function (lib, id) {
        var link = doc.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = laypage.dir;
        id && (link.id = id);
        doc[tag]('head')[0].appendChild(link);
        link = null;
    };
    Page.digit = function (m) {
        return +m < 10 ? '0' + m : m;
    };
//判断传入的容器类型
    Page.prototype.type = function () {
        var conf = this.config;
        if (typeof conf.cont === 'object') {
            return conf.cont.length === undefined ? 2 : 3;
        }
    };

//分页视图
    Page.prototype.view = function () {
        var that = this, conf = that.config, view = [], dict = {};

        conf.pages = conf.pages | 0;
        conf.curr = (conf.curr | 0) || 1;
        conf.groups = 'groups' in conf ? (conf.groups | 0) : 5;
        conf.first = 'first' in conf ? conf.first : '&#x9996;&#x9875;';
        conf.last = 'last' in conf ? conf.last : '&#x5C3E;&#x9875;';
        conf.prev = 'prev' in conf ? conf.prev : '&#x4E0A;&#x4E00;&#x9875;';
        conf.next = 'next' in conf ? conf.next : '&#x4E0B;&#x4E00;&#x9875;';
        conf.listitem = conf.listitem || 15;
        if (!conf.total) {
            return '<div id="laypage_' + that.config.item + '"><span class="red">暂无信息</span></div>';
        }

        var _pages = parseInt((conf.total / conf.listitem));
        if ((conf.total % conf.listitem)) {
            _pages += 1;
        }
        conf.pages = _pages;


//        if (conf.pages <= 1) {
//            return '';
//        }

//        if (conf.groups > conf.pages) {//分组功能不要
//            conf.groups = conf.pages;
//        }

        //计算当前组
        view.push('<div class="page-info"><span>共' + conf.total + '条</span> 第<span class="pageindex">' + Page.digit(conf.curr) + '</span>/<span>' + Page.digit(conf.pages) + '</span>页</div> ');
        view.push('<div class="pagenumber">');
        if (conf.curr <= 1) {
            view.push(' <span class="page-f-e disable">首页</span> ');
            view.push(' <span class="disable">上一页</span> ');
        }
        else {
            view.push(' <a class="page-f-e" data-page="1">首页</a> ');
            view.push(' <a class="pagetop" data-page="' + (conf.curr - 1) + '">上一页</a> ');
        }

        if (conf.pages <= conf.curr) {
            view.push(' <span class="disable">下一页</span> ');
            view.push(' <span class="page-f-e disable">尾页</span> ');
        }
        else {
            view.push(' <a class="pagetop" data-page="' + (conf.curr + 1) + '">下一页</a> ');
            view.push(' <a class="page-f-e"  data-page="' + conf.pages + '">尾页</a> ');
        }
        view.push('<div class="page-number" data-val="15"><div class="page-n-input">每页' + conf.listitem + '条<i></i></div><div class="page-n-list"><ul>');
        if (conf.pageitems) {
            for (var i = 0, j = conf.pageitems.length; i < j; i++) {
                view.push('<li>' + conf.pageitems[i] + '</li>');
            }
        }
        view.push('</ul></div></div> ');
        view.push('<input type="text"/><a class="pagetz" style="margin:0px 0px 0px 5px;">跳转</a>');
        //view.push('<a class="pagetop" data-page="' + (conf.curr - 1) + '" style="margin:0px 5px;">上一页</a><a class="pagenext" data-page="' + (conf.curr + 1) + '" style="margin:0px 5px;">下一页</a><input type="text" style="margin:0px 5px;"/><a class="pagetz" style="margin:0px 5px;">跳转</a>');
        view.push('</div>');
        return '<div class="pagination "><div id="laypage_' + that.config.item + '">' + view.join('') + '</div></div>';
    };

    //跳页
    Page.prototype.jump = function (elem) {
        if (!elem)
            return;
        var that = this, conf = that.config, childs = elem.children[1].children;
        var btn = elem[tag]('a')[2];
        var select = null;
        var selectoption = null;
        var input = elem[tag]('input')[0];
        for (var i = 0, len = childs.length; i < len; i++) {
            if (childs[i].nodeName.toLowerCase() === 'a' && childs[i].className !== 'pagetz') {
                Page.on(childs[i], 'click', function () {
                    var curr = this.getAttribute('data-page') | 0;
                    if (Page.hasClass(this, 'pagetop')) {
                        if (curr <= 0) {
                            alert('已到达首页');
                            return;
                        }
                    }
                    if (Page.hasClass(this, 'pagenext')) {
                        if (curr > conf.pages) {
                            alert('没有了');
                            return;
                        }
                    }
                    conf.curr = curr;
                    that.render();
                });
            }
            if (Page.hasClass(childs[i], 'pagetz')) {
                btn = childs[i];
            }
            if (Page.hasClass(childs[i], 'page-number')) {
                var _childs = childs[i].children;
                select = _childs[0];
                selectoption = _childs[1];
            }
        }
        if (btn) {
            Page.on(btn, 'click', function () {
                var curr = input.value.replace(/\s|\D/g, '') | 0;
                if (curr && curr <= conf.pages) {
                    conf.curr = curr;
                    that.render();
                }
                else {
                    input.value = '';
                    input.focus();
                }
            });
        }
        var ntt = false;
        if (select) {
            Page.on(select, 'click', function (e) {
                e = e || window.event;
                var _top;
                var clientHeight = Page.client().height;
                var scrollHeight = Page.scroll().height;
                var _h = scrollHeight < clientHeight ? clientHeight : scrollHeight;
                var offsetTop = (+Page.offset(this).top) + (+Page.height(this));
                var selecth = Page.height(selectoption);
                //console.log(_h + '+' + (offsetTop + selecth));
                //console.log(Page.height(selectoption));
                if (_h < (offsetTop + selecth)) {
                    _top = -selecth + 'px';
                }
                else {
                    _top = (+Page.height(this)) + 'px';
                }
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }
                if (ntt) {
                    ntt = false;
                    Page.css(selectoption, {'display': 'none'});
                } else {
                    ntt = true;
                    Page.css(selectoption, {'display': 'block'});
                }
                Page.css(selectoption, {'top': _top});
                window.document.onclick = function () {
                    ntt = false;
                    Page.css(selectoption, {'display': 'none'});
                    window.document.onclick = null;
                };
            });
        }
        if (selectoption) {
            Page.on(selectoption, 'click', function (e) {
                var mya = (e.srcElement ? e.srcElement : e.target);
                if (mya.nodeName.toLowerCase() === 'li') {
                    ntt = false;
                    Page.css(selectoption, {'display': 'none'});
                    var newitem = parseInt(mya.innerHTML);
                    if (conf.listitem !== newitem) {
                        conf.listitem = newitem;
                        conf.curr = 1;
                        that.render();

                    }


//                    select.innerHTML = '每页' + mya.innerHTML + '条<i></i>';

                }
            });
        }
    };

//渲染分页
    Page.prototype.render = function (load) {

        var that = this, conf = that.config, type = that.type();
        var view = that.view();
        if (type === 2) {
            conf.cont.innerHTML = view;
        } else if (type === 3) {
            conf.cont.html(view);
        } else {
            doc[id](conf.cont).innerHTML = view;
        }
        conf.jump && conf.jump(conf, load);
        that.jump(doc[id]('laypage_' + conf.item));
        doc[id]('laypage_' + conf.item).onselectstart = function () {
            return false;
        };
        if (conf.hash && !load) {
            location.hash = '!' + conf.hash + '=' + conf.curr;
        }
    };

    //for 页面模块加载、Node.js运用、页面普通应用
    "function" === typeof define ? define(function () {
        return laypage;
    }) : "undefined" != typeof exports ? module.exports = laypage : window.laypage = laypage;
}();