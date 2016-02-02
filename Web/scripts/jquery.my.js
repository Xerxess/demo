//js通过class 进行遍历子元素
function getElementsByClassName(className) {
        var all = document.all ? document.all : document.getElementsByTagName(' *');
        var elements = new Array();
        for (var e = 0; e < all.length; e++) {
            if (all[e].className == className) {
                elements[elements.length] = all[e];
                break;
            }
        }
        return elements;
    }

//判断某标签的图片全部加载完成
(function ($) {
    $.fn.loadimg = function (options) {//options 经常用这个表示有许多个参数。 
        var defaultVal = {
            id: 'pic',
            loadingclass: "",
            showbox: "",
            fn: ""
        };
        //默认值 
        var $id = function (id) {
            return typeof id === 'string' ? document.getElementById(id) : id;
        },
		$tag = function (tag, parentNode) {
		    return ($id(parentNode) || document).getElementsByTagName(tag);
		};
        var obj = $.extend(defaultVal, options); //自定义参数，调用时传过来的
        return this.each(function () {
            var box = $id(obj.id), img = $tag('img', box), count = 0, len = img.length;
            for (var i = 0; i < len; i++) {
                if (img[i].complete) { //如果图片已经存在于浏览器缓存，直接调用回调函数 
                    if (obj.loadingclass == "") {
                        setTimeout(function () {
                            $(obj.showbox).fadeIn();
                            obj.fn();
                        }, 250);
                    }
                    else {
                        $(obj.loadingclass).hide(0, function () {
                            $(obj.showbox).fadeIn();
                            obj.fn();
                        });
                    }
                    return; // 直接返回，不用再处理onload事件 
                }
                else {
                    img[i].onload = function () {
                        this.onload = null;
                        count += 1;
                        if (count == len) {
                            if (obj.loadingclass == "") {
                                setTimeout(function () {
                                    $(obj.showbox).fadeIn();
                                    obj.fn();
                                }, 250);
                            }
                            else {
                                $(obj.loadingclass).hide(0, function () {
                                    $(obj.showbox).fadeIn();
                                    obj.fn();
                                });
                            }
                        }
                    }
                    img[i].setAttribute("src", img[i].getAttribute("src")); //防止ie 谷歌下 有缓存旱onload不执行情况
                }
            }
        });
    }
})(jQuery);

///id:遍历img 父标签id
///classid1:loading_div 加载时显示
///classid2:要显示的div
///回调函数
function this_loading_img(id, classid1, classid2, fn) {
    var loadingclass = "." + classid1;
    var showclass = "." + classid2;
    //默认值 
    var $id = function (id) {
        return typeof id === 'string' ? document.getElementById(id) : id;
    },
	$tag = function (tag, parentNode) {
	    return ($id(parentNode) || document).getElementsByTagName(tag);
	};
    var box = $id(id), img = $tag('img', box), count = 0, len = img.length;
    for (var i = 0; i < len; i++) {
        if (img[i].complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            $(loadingclass).hide(0, function () {
                $(showclass).fadeIn();
                fn();
            });
            return; // 直接返回，不用再处理onload事件 
        }
        else {
            img[i].onload = function () {
                this.onload = null;
                count += 1;
                if (count == len) {
                    $(loadingclass).hide(0, function () {
                        $(showclass).fadeIn();
                        fn();
                    });
                }
            }
            img[i].setAttribute("src", img[i].getAttribute("src")); //防止ie 谷歌下 有缓存旱onload不执行情况
        }
    }
}

////自己的lightbox 使用class 不太完美以后有兴趣再来改进
(function ($) {
    $.fn.lightbox = function (options) {//options 经常用这个表示有许多个参数。 
        var defaultVal = {
            id: ''
        };
        var obj = $.extend(defaultVal, options);
        return this.each(function () {
            $(this).click(function () {
                var html1 = '<div class="lightbox_loading_1" style="width:32px;height:32px;overflow:hidden;position:absolute;z-index:10001;left:50%;top:50%;margin-left:-16px;margin-top:-16px;"></div><div class="lightbox_loading" style="filter: alpha(opacity=50);opacity: 0.5;width:100%;height:100%;background:#000;position:absolute;z-index:10000;left:0px;top:0px;"></div>';
                var html2 = '<div class="lightbox_show" sytle=""><a class="close_box_show" href="javascript:void(0)" title="关闭"/></div>';
                $("body").append(html1 + html2);
                var height_1; //lightbox_loading的背景全屏高度
                //浏览器兼容
                if ($.browser.msie) {
                    height_1 = document.documentElement.scrollHeight;
                } else if ($.browser.opera) {
                    height_1 = document.documentElement.scrollHeight;
                } else if ($.browser.mozilla) {
                    height_1 = document.documentElement.scrollHeight;
                } else if ($.browser.safari) {
                    height_1 = document.body.scrollHeight;
                } else {
                    height_1 = document.documentElement.offsetHeight;
                }
                var oldt = document.documentElement.scrollTop || document.body.scrollTop; //滚动条滚动高度
                var clheight = document.documentElement.clientHeight || document.body.clientHeight; //当前可视高度
                if (height_1 < clheight) {//当内容高度小于可视高度时
                    height_1 = clheight;
                }
                $(".lightbox_loading").height(height_1); //重写背景高度，达到全屏透明背景
                $(".lightbox_loading").width(document.documentElement.scrollWidth); //重写背景宽度，达到全屏透明背景
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop; //当前滚动的高度  
                var bodyHeight = document.documentElement.clientHeight || document.body.clientHeight; //当前分辨率下 body（页面）可见区域的总高度  
                $(".lightbox_show").css({ "top": clheight / 2 + oldt + "px", "left": Math.max(document.documentElement.scrollWidth) / 2 })//没用可删除
                $(".lightbox_loading_1").css({ "top": clheight / 2 + oldt + "px", "left": Math.max(document.documentElement.scrollWidth) / 2 })//正在loading图标可删除lightbox_loading_1标签
                if ($(this).attr("data_img") != "") {//是否达到大图展示说明
                    var offset = $(this).offset();
                    var thisheight = $(this).height() / 2;
                    var thiswidth = $(this).width() / 2;
                    var newimg = $(this).attr("data_img"); //获得展示的大图地址
                    $(".lightbox_show").css({ "top": (offset.top + thisheight), "left": (offset.left + thiswidth) }); //使div达到缩略图位置
                    if (newimg != "") {
                        $(".lightbox_show").append("<img _src=\"../images/loading.gif\" src='" + newimg + "' id=\"bigimg\" style=\"vertical-align:middle;filter: alpha(opacity=0);opacity:0;\" />"); //添加图片元素
                        document.getElementById("bigimg").onload = function () {
                            $(".lightbox_show").show();
                            var newheight = this.height;
                            var newwidth = this.width;
                            var newtop = clheight / 2 + oldt;
                            var jqheight = 0;
                            if (newwidth > document.documentElement.scrollWidth)//防止图片过大，导致body左右边有空白
                            {
                                $(".lightbox_loading").width(newwidth);
                            }
                            if ((newheight + oldt) > height_1 && newheight < height_1)//防止大图片高大，冲破body
                            {
                                newtop = newtop - ((newheight + oldt) - height_1);
                            }
                            else if ((newheight + oldt) > height_1 && newheight > height_1) {
                                newtop = newheight / 2 + 1;
                            }
                            //alert(newheight + "," + newwidth);
                            setTimeout(function () {
                                $(".lightbox_show").animate({
                                    width: newwidth,
                                    height: newheight,
                                    top: newtop,
                                    left: Math.max(document.documentElement.scrollWidth) / 2,
                                    marginLeft: "-" + newwidth / 2,
                                    marginTop: "-" + newheight / 2,
                                    borderWidth: 2
                                }, 350, function () {
                                    //alert("v");
                                    var i_time = 10;
                                    var ii_time = 0;
                                    var bid = document.getElementById("bigimg");
                                    var iiii = setInterval(function () {
                                        ii_time += i_time;
                                        if (ii_time >= 100) {
                                            ii_time = 100;
                                        }
                                        bid.style.filter = "alpha(opacity=" + ii_time + ")";
                                        bid.style.opacity = ii_time / 100;
                                        if (ii_time >= 100) {
                                            clearInterval(iiii); //清除clearInterval 防止页面抢占内容，造成页面卡=原因
                                        }
                                    }, 5);
                                });
                            }, 25);
                            $(".close_box_show").show();
                        }
                        document.getElementById("bigimg").src = document.getElementById("bigimg").src; //解决ie不onload bug
                    }
                }
                else {
                    alert("正在上传中，请继续关注！");
                }
                //点击背景清除加载的元素
                $(".lightbox_loading").click(function () {
                    $(".close_box_show").hide();
                    $(".lightbox_loading_1").remove();
                    $(".lightbox_show").find("img").hide();
                    $(".lightbox_show").animate({
                        width: 0,
                        height: 0,
                        marginLeft: 0,
                        marginTop: 0,
                        borderWidth: 2
                    }, 100, function () {
                        $(".lightbox_loading").fadeOut("fast", function () {
                            $(".lightbox_loading").remove();
                        });
                        $(".lightbox_show").remove();
                    });
                });

                //点击关闭按钮清除加载的元素
                $(".close_box_show").click(function () {
                    $(".close_box_show").hide();
                    $(".lightbox_loading_1").remove();
                    $(".lightbox_show").find("img").hide();
                    $(".lightbox_show").animate({
                        width: 0,
                        height: 0,
                        marginLeft: 0,
                        marginTop: 0,
                        borderWidth: 2
                    }, 100, function () {
                        $(".lightbox_loading").fadeOut("fast", function () {
                            $(".lightbox_loading").remove();
                        });
                        $(".lightbox_show").remove();
                    });
                });

                //双击当前展示图片元素清除加载的元素
                $(".lightbox_show").dblclick(function () {
                    $(".close_box_show").hide();
                    $(".lightbox_loading_1").remove();
                    $(".lightbox_show").find("img").hide();
                    $(".lightbox_show").animate({
                        width: 0,
                        height: 0,
                        marginLeft: 0,
                        marginTop: 0,
                        borderWidth: 2
                    }, 100, function () {
                        $(".lightbox_loading").fadeOut("slow", function () {
                            $(".lightbox_loading").remove();
                        });
                        $(".lightbox_show").remove();
                    });
                });
            });
        });
    }
})(jQuery);


//根据内容高宽度 移动top_right_bottom_left
(function ($) {
    $.fn.top_right_bottom_left = function (options) {//options 经常用这个表示有许多个参数。 
        var defaultVal = {
            hoverid: "", //鼠标移动id
            clickid: "", //onclickid
            displayid: "", //外层div
            scrollid: "", //需要滚动div
            action: "top", //滚动方向
            scrollfun: ""//回调函数
        };
        var obj = $.extend(defaultVal, options); //自定义参数，调用时传过来的
        return this.each(function () {
            var thisobj=$(this);
            var height = thisobj.find(obj.displayid).height(); //获要滚动的总高度
            var width = thisobj.find(obj.displayid).width(); //获要滚动的总宽度
            var margintop = $(obj.scrollid).css("margin-top");
            var marginleft = $(obj.scrollid).css("margin-left");
            var action1 = ""; //margin方向
            var action2 = ""; //top 加减
            var action3 = ""; //top or left 方向
            var action4 = ""; //top or left 方向
            var action5 = ""; //top or left 方向
            var scroll_w_h = ""; //移动距离
            var set_w_h = "";
            if (obj.action == "top") {
                action2 = "-"; //top向上
                action5 = "";
                scroll_w_h = height;

            }
            else if (obj.action == "right") {
                action2 = ""; //right向右
                action5 = "-";
                scroll_w_h = width;

            }
            else if (obj.action == "bottom") {
                action2 = "-"; //bottom向下
                action5 = "-";
                scroll_w_h = height;
            }
            else {
                action2 = "-"; //left向左
                action5 = "";
                scroll_w_h = width;
            }

            if (obj.action == "top" || obj.action == "bottom") {
                thisobj.find(obj.clickid).click(function () {
                    //alert(scroll_w_h);
                    if (thisobj.find(obj.displayid).css("display") == "none") {
                        thisobj.find(obj.displayid).css({ "top": action2 + scroll_w_h + "px", "left": "0px", "display": "block", "height": scroll_w_h });
                        thisobj.find(obj.scrollid).css({ "margin-top": action5 + scroll_w_h + "px", "margin-left": marginleft });
                        thisobj.find(obj.scrollid).animate({ marginTop: 0 }, 250, "easeInQuint");
                        thisobj.hover(function () { }, function () {
                            if (thisobj.find(obj.displayid).css("display") != "none") {
                                thisobj.find(obj.scrollid).animate({ marginTop: action5 + scroll_w_h + "px" }, 250, function () {
                                    thisobj.find(obj.displayid).css("display", "none");
                                });
                            }
                        });
                    }
                    else {
                        thisobj.find(obj.hoverid).unbind("hover");
                        thisobj.find(obj.scrollid).animate({ "margin-top": action5 + scroll_w_h }, 250, function () {
                            thisobj.find(obj.displayid).css("display", "none");
                        });
                    }
                });
            }
            else {
                thisobj.find(obj.clickid).click(function () {
                    //alert(scroll_w_h);
                    if (thisobj.find(obj.displayid).css("display") == "none") {
                        thisobj.find(obj.displayid).css({ "left": action2 + scroll_w_h + "px", "top": "0px", "display": "block", "width": scroll_w_h });
                        thisobj.find(obj.scrollid).css({ "margin-left": action5 + scroll_w_h + "px", "margin-top": margintop });
                        thisobj.find(obj.scrollid).animate({ marginLeft: 0 }, 250);
                        thisobj.hover(function () { }, function () {
                            if (thisobj.find(obj.displayid).css("display") != "none") {
                                thisobj.find(obj.scrollid).animate({ marginLeft: action5 + scroll_w_h + "px" }, 250, function () {
                                    thisobj.find(obj.displayid).css("display", "none");
                                });
                            }
                        });
                    }
                    else {
                        thisobj.find(obj.hoverid).unbind("hover");
                        thisobj.find(obj.scrollid).animate({ "margin-left": action5 + scroll_w_h }, 250, function () {
                            thisobj.find(obj.displayid).css("display", "none");
                        });
                    }
                });
            }
        });
    }
})(jQuery);

//图片左右无间隙滚动
(function ($) {
    $.fn.yc_slide = function (options) {//options 经常用这个表示有许多个参数。 
        var defaultVal = {
            parentclass: ".banner_list_text .img_list",
            loadingclass: ".loading",
            showbox: ".list",
            fn: "",
            scrolllen: 5, //可风个数
            scrolllen_1: 1, //滚动
            left_or_right: "left",
            leftid: ".left_1",
            rightid: ".right_1",
            autoPlay: true,
            delayTime: 50
        };
        return this.each(function () {
            //配制参数
            var objid = $(this);
            var obj = $.extend(defaultVal, options); //自定义参数，调用时传过来的
            var scrolltag_p = $(obj.parentclass); //父级ul
            var scrolltag_z = $(obj.parentclass).children(); //子级li
            var scrolltag_len = scrolltag_z.length; //子元素个数
            var Arraylist_li = scrolltag_z.toArray(); //将.ul li变换为数组
            var html_src = $(scrolltag_p).html(); //获得所有html元素;
            var item_len = parseInt(obj.scrolllen) - 1 + parseInt(obj.scrolllen_1) + scrolltag_len; //获得需要滚动的个数
            var item_w = scrolltag_z.eq(0).outerWidth(true); //获得单个li总宽度
            var item_h = scrolltag_z.eq(0).outerHeight(true); //获得单个li总高度
            var item1 = obj.scrolllen; //获得可见;
            //begin html复制
            var html_src_1 = "";
            var html_src_2 = "";
            if (obj.scrolllen_1 > 0) {
                for (var j = 1; j <= obj.scrolllen_1; j++) {
                    scrolltag_z.eq(scrolltag_len - j).clone().prependTo(scrolltag_p); //克隆并
                }
            }
            for (var i = 0; i < obj.scrolllen - 1; i++) {
                scrolltag_z.eq(i).clone().appendTo(scrolltag_p);
            }
            scrolltag_p.wrap("<div style=\"overflow:hidden; position:relative; width:" + item_w * obj.scrolllen + "px\"></div>")
            scrolltag_p.css({ "width": item_len * item_w, "position": "relative" });
            //end html复制
            //滚动参数
            var i_widht = -item_w;
            var ycscroll;
            var left_or_right = obj.left_or_right;
            yc_scroll_fun(left_or_right);
            $(obj.leftid).click(function () {
                left_or_right = "left";
                clearInterval(ycscroll);
                yc_scroll_fun(left_or_right)
            });
            $(obj.rightid).click(function () {
                left_or_right = "right";
                clearInterval(ycscroll);
                yc_scroll_fun(left_or_right)
            });
            $(scrolltag_p).hover(function () {
                clearInterval(ycscroll);
            }, function () {
                yc_scroll_fun(left_or_right)
            });
            function yc_scroll_fun(left_or_right) {
                //begin滚动——left
                if (left_or_right == "left") {
                    ycscroll = setInterval(function () {
                        i_widht--;
                        if (i_widht == -((item_len - obj.scrolllen) * item_w)) {
                            i_widht = 0;
                        }
                        else {
                            $(scrolltag_p).css("left", i_widht);
                        }
                    }, obj.delayTime);
                }
                //end滚动——left
                //begin滚动——right
                if (left_or_right == "right") {
                    ycscroll = setInterval(function () {
                        i_widht++;
                        if (i_widht == 0) {
                            i_widht = -((item_len - obj.scrolllen) * item_w);
                        }
                        else {
                            $(scrolltag_p).css("left", i_widht);
                        }
                    }, obj.delayTime);
                }
            }
        });
    }
})(jQuery);

//缓冲效果集合
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) { return jQuery.easing[jQuery.easing.def](x, t, b, c, d); },
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
    easeInBounce: function (x, t, b, c, d) { return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b },
    easeOutBounce: function (x, t, b, c, d) { if ((t /= d) < (1 / 2.75)) { return c * (7.5625 * t * t) + b; } else if (t < (2 / 2.75)) { return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b; } else if (t < (2.5 / 2.75)) { return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b; } else { return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b; } },
    easeInOutBounce: function (x, t, b, c, d) { if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b; return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b; }
});