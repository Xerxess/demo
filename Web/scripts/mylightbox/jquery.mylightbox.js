////自己的lightbox 使用class 不太完美以后有兴趣再来改进
(function ($) {
    $.fn.mylightbox = function (options) {//options 经常用这个表示有许多个参数。 
        var defaultVal = {
            id: ''
        };
        var obj = $.extend(defaultVal, options);
        return this.each(function () {
            $(this).click(function () {
                var html1 = '<div class="lightbox_loading_1" style="width:32px;height:32px;overflow:hidden;position:absolute;z-index:10001;left:50%;top:50%;margin-left:-16px;margin-top:-16px;"></div><div class="lightbox_loading" style="filter: alpha(opacity=50);opacity: 0.5;width:100%;height:100%;background:#000;position:absolute;z-index:10000;left:0px;top:0px;"></div>';
                var html2 = '<div class="lightbox_show" sytle=""><a class="close_box_show" href="javascript:void(0)" title="关闭"></a></div>';
                $("body").append(html1 + html2);
                var height_1; //lightbox_loading的背景全屏高度
                //浏览器兼容
                //                if ($.browser.msie) {
                //                    height_1 = document.documentElement.scrollHeight;
                //                } if ($.browser.opera) {
                //                    height_1 = document.documentElement.scrollHeight;
                //                } else if ($.browser.mozilla) {
                //                    height_1 = document.documentElement.scrollHeight;
                //                } else if ($.browser.safari) {
                //                    height_1 = document.body.scrollHeight;
                //                } else {
                //                    height_1 = document.documentElement.offsetHeight;
                //                }
                height_1 = document.documentElement.scrollHeight;
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
                        $(".lightbox_show").append("<img src='" + newimg + "' id=\"bigimg\" style=\"vertical-align:middle;filter: alpha(opacity=0);opacity:0;\" />"); //添加图片元素
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
                                    borderWidth: 1
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
                        if (window.attachEvent) {
                            document.getElementById("bigimg").src = document.getElementById("bigimg").src; //解决ie不onload bug
                        }
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