//图片延迟加载
var temp = -1; //用来判断是否是向下滚动（向上滚动就不需要判断延迟加载图片了）  
var body_s_top = document.documentElement.scrollTop;
var body_height = document.documentElement.clientHeight;
var img_loading_len = 3;
var auto_loading;
var $id = function (id) {
    return typeof id === 'string' ? document.getElementById(id) : id;
},
$tag = function (tag, parentNode) {
    return ($id(parentNode) || document).getElementsByTagName(tag);
};
$(function () {
    body_s_top = document.documentElement.scrollTop || document.body.scrollTop; //当前滚动条滚动高度
    body_height = document.documentElement.clientHeight || document.body.clientHeight; //当前页面可视高度
    var elements = $("img[loaded!='true'][_src]"); //获取未加载图片集
    var img_all_len = elements.length;
    if (elements.length > img_loading_len)//超出加载数量
    {
        var yushu = elements.length % img_loading_len; //余数
        var yeshu = parseInt(elements.length / img_loading_len); //分组数
        if (yushu > 0) {
            yeshu++; //最后分组数
        }
        for (var i = 1; i <= yeshu; i++) {
            load_img_page(i, elements, yushu); //分组加载;
        }
    }
    else {//少于加载数量
        for (var i = 0; i < elements.length; i++) {//判断当前页面下所有图片
            var obj = elements.get(i); //获得dom远素
            var offsetobj = $(elements[i]).offset(); //ie6 ie7下js offsetTop无效
            var documentimg = obj;
            if ((offsetobj.top - body_s_top) <= body_height) {//此图片条件达到 立即转换
                documentimg.setAttribute("src", documentimg.getAttribute("_src")); //转换原图地址
                documentimg.setAttribute("loaded", "true"); //修改加载图片防止多次加载
                documentimg.style.filter = "alpha(opacity=0)";
                documentimg.style.opacity = "0";
                documentimg.onload = function () {
                    var i_time = 10;
                    var ii_time = 0;
                    var bid = this;
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
                    }, 10);
                }
                if ($.browser.msie) {
                    documentimg.setAttribute("src", documentimg.getAttribute("src")); //解决ie不onload bug
                }
            }
            else {
                documentimg.setAttribute("loaded", "false"); //示能达到加载条件
            }
        }
    }
});

function load_img_page(page, elements, yushu) {
    setTimeout(function () {
        var img_all_len = elements.length;
        if (page == 1) {
            load_img(0, 6, elements);
        }
        else if (page * img_loading_len > img_all_len) {
            load_img(img_all_len - yushu, img_all_len, elements);
        }
        else {
            load_img(page * img_loading_len, page * img_loading_len + 6, elements);
        }
    },5000);
}

function load_img(flen, len, elements) {
    for (var i = flen; i < len; i++) {//判断当前页面下所有图片
        var obj = elements.get(i); //获得dom远素
        var offsetobj = $(elements[i]).offset(); //ie6 ie7下js offsetTop无效
        var documentimg = obj;
        if ((offsetobj.top - body_s_top) <= body_height) {//此图片条件达到 立即转换
            documentimg.setAttribute("src", documentimg.getAttribute("_src")); //转换原图地址
            documentimg.setAttribute("loaded", "true"); //修改加载图片防止多次加载
            documentimg.style.filter = "alpha(opacity=0)";
            documentimg.style.opacity = "0";
            documentimg.onload = function () {
                var i_time = 10;
                var ii_time = 0;
                var bid = this;
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
                }, 10);
            }
            if ($.browser.msie) {
                documentimg.setAttribute("src", documentimg.getAttribute("src")); //解决ie不onload bug
            }
        }
        else {
            documentimg.setAttribute("loaded", "false"); //示能达到加载条件
        }
    }
}


//随着滚动条图片显示
var ii = false;
window.onscroll = function () {
    var elements = $("img[loaded!='true'][_src]"); //获取未加载图片集
    if (elements.length > 0) {
        if (ii) {
            clearTimeout(ii); //防止onscroll一直触发，并执行两次
        }
        ii = setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop; //滚动的高度  
            var bodyHeight = document.documentElement.clientHeight || document.body.clientHeight; //body（页面）可见区域的总高度  
            if (temp < scrollHeight) {//为true表示是向下滚动，否则是向上滚动，不需要执行动作。  
                for (var i = 0; i < elements.length; i++) {//判断当前页面下所有图片
                    var obj = elements.get(i); //获得dom远素
                    var offsetobj = $(elements[i]).offset(); //ie6 ie7下js offsetTop无效
                    var documentimg = obj;
                    if ((offsetobj.top - scrollHeight - 200) <= bodyHeight) {//此图片条件达到 立即转换
                        documentimg.setAttribute("src", documentimg.getAttribute("_src")); //转换原图地址
                        documentimg.setAttribute("loaded", "true"); //修改加载图片防止多次加载
                        documentimg.style.filter = "alpha(opacity=0)";
                        documentimg.style.opacity = "0";
                        documentimg.onload = function () {
                            var i_time = 10;
                            var ii_time = 0;
                            var bid = this;
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
                            }, 25)
                        }
                        if ($.browser.msie) {
                            documentimg.setAttribute("src", documentimg.getAttribute("src")); //解决ie不onload bug
                        }
                    }
                    else {
                        documentimg.setAttribute("loaded", "false"); //示能达到加载条件
                    }
                }
                temp = scrollHeight; //判断不是向上滚动
            }
        }, 100);
    }
    else {
        //$(window).unbind("scroll");
    }
}

//针对自定义显示图片.没什么特殊意义只是图片加载完了才显示，改良用户体验度
function loading(id) {
    var box = $id(id), img = $tag('img', box), count = 0, len = img.length;
    var div_id = "." + id;
    $(div_id).find("img").attr("loaded", "false");
    for (var i = 0; i < len; i++) {
        if (img[i].getAttribute("_src") != null && img[i].getAttribute("src") != null) {//属于延迟加载图片
            var documentimg = img[i];
            if (documentimg.getAttribute("loaded") == "false") {//需要转换的图片
                documentimg.setAttribute("src", documentimg.getAttribute("_src"));
                documentimg.style.filter = "alpha(opacity=0)";
                documentimg.style.opacity = "0";
                documentimg.setAttribute("loaded", "true");
                documentimg.onload = function () {
                    var i_time = 10;
                    var ii_time = 0;
                    var bid = this;
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
                    }, 15)
                }
                img[i].src = img[i].src; //解决ie不onload bug
            }
        };
    }
}