//说明：图片上传预览插件
//上传的时候可以生成固定宽高范围内的等比例缩放图

//参数设置：
//width                     存放图片固定大小容器的宽
//height                    存放图片固定大小容器的高
//imgDiv                    页面DIV的JQuery的id
//maxSize                   图片大小最大限制(K)
//imgType                   数组后缀名
//**********************图片上传预览插件*************************
(function ($) {
    jQuery.fn.extend({
        uploadPreview: function (opts) {
            var infocode = {
                code0: { code: 0, info: true }, //正常
                code1: { code: -1, info: '图片格式错误' },
                code2: { code: -2, info: '图片大小超出指定范围' },
                code3: { code: -99, info: '异常错误' }
            };
            opts = jQuery.extend({
                width: 0,
                height: 0,
                imgDiv: null,
                imgBox: null,
                maxSize: 300,
                noimg: '',
                imgType: ["gif", "jpeg", "jpg", "bmp", "png"],
                validatorEnd: null,
                callback: function () {
                    return false;
                },
                error: null
            }, opts || {});
            var _this = $(this);
            var imgDiv = opts.imgDiv;
            var imgbox = opts.imgBox;
            var version = 7;
            var filters = imgbox[0].filters ? true : false;//ie10内核filters是舍弃了的
            var v = {//判断是否是ie
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
                ie9: function () {
                    if (navigator.userAgent.indexOf('MSIE 9.0') > 0) {
                        return true;
                    }
                }
            };
            version = (v.getoldie || v.ie9) ? 9 : 10;
            var fit = (version <= 9 && filters) || (version >= 10 && filters);

            var myalert = function (msg) {
                if (!opts.isalert) {
                    return;
                }
                alert(msg);
            };
            var autoScaling = function () {
                if (fit) {
                    imgbox.get(0).filters.item("DXImageTransform.Microsoft.AlphaImageLoader").sizingMethod = "image";
                }
                //                var box_width = imgbox.width();
                //                var box_height = imgbox.height();
                //                var img_width = imgDiv.width();
                //                var img_height = imgDiv.height();
                var box_width = opts.width;
                var box_height = opts.height;
                var img_width = opts.width;
                var img_height = opts.height;
                if (fit) {
                    img_width = box_width;
                    img_height = box_height;
                }
                if (img_width > 0 && img_height > 0) {
                    var rate = (opts.width / img_width < opts.height / img_height) ? opts.width / img_width : opts.height / img_height;
                    if (rate <= 1) {
                        //img_width = img_width * rate;
                        //img_height = img_height * rate;
                        imgbox.width(opts.width);
                        imgbox.height(opts.height);
                        if (fit) {
                            imgbox.get(0).filters.item("DXImageTransform.Microsoft.AlphaImageLoader").sizingMethod = "scale";
                        }
                        else {
                            imgDiv.width(img_width);
                            imgDiv.height(img_height);
                        }

                    } else {
                        imgDiv.width(img_width);
                        imgDiv.height(img_height);
                    }
                    var left = (opts.width - imgbox.width()) * 0.5;
                    var top = (opts.height - imgbox.height()) * 0.5;
                    //imgbox.css({"margin-left": left, "margin-top": top});
                    setTimeout(function () {
                        imgDiv.show();
                        if (fit) {
                            imgbox.show();
                        }
                    }, 100);
                }
                else {
                    imgbox.get(0).filters.item("DXImageTransform.Microsoft.AlphaImageLoader").sizingMethod = "scale";
                    imgbox.width(opts.width);
                    imgbox.height(opts.height);
                }
                if (opts.callback) {
                    opts.callback();
                }
            };
            var createImg = function () {
                imgDiv.html('');
                var img = $("<img />");
                imgDiv.replaceWith(img);
                imgDiv = img;
            };
            _this.change(function () {
                imgDiv.hide();
                imgDiv.css({ 'width': '', 'height': '' });
                imgbox.css({ 'width': '', 'height': '', 'padding': '' });
                if (this.value) {
                    if (!RegExp("\.(" + opts.imgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                        myalert("图片类型必须是" + opts.imgType.join("，") + "中的一种");
                        _this.val('');
                        if (opts.error) {
                            opts.error(infocode.code1);
                        }
                        return false;
                    }
                    var file = null;
                    var size = 0;
                    if (this.files && this.files[0]) {
                        file = this.files[0];
                        size = file.size;
                    } else if (this.files && this.files.item(0)) {
                        file = this.files.item(0);
                        size = file.fileSize;
                    }

                    if ((size / 1024) > opts.maxSize) {
                        myalert('图片大小不能超过' + opts.maxSize + 'K');
                        _this.val('');
                        if (opts.error) {
                            opts.error(infocode.code2);
                        }
                        return false;
                    }
                    //ie7\8\9
                    var i = this;
                    if (fit) {
                        try {
                            this.select();
                            var imgSrc = document.selection.createRange().text;
                            imgbox.html('');
                            imgbox.css({ filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)" });
                            imgbox[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").sizingMethod = "scale";
                            imgbox[0].filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc;
                            imgbox.hide();
                            if (opts.validatorEnd)
                                opts.validatorEnd();
                            setTimeout(function () {
                                autoScaling();
                            }, 100);
                        } catch (e) {
                            myalert("无效的图片文件！");
                            if (opts.error) {
                                opts.error(infocode.code1);
                            }
                            return;
                        }
                    }
                    else {
                        try {

                            //支持html5的浏览器,比如高版本的firefox、chrome、ie10
                            if (this.files && this.files[0]) {
                                if ((this.files[0].size / 1024) > opts.maxSize) {
                                    myalert('图片大小不能超过' + opts.maxSize + 'K');
                                    _this.val('');
                                    if (opts.error) {
                                        opts.error(infocode.code2);
                                    }
                                    return false;
                                }
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    imgDiv.attr('src', e.target.result);
                                };
                                reader.readAsDataURL(this.files[0]);
                                if (opts.validatorEnd)
                                    opts.validatorEnd();
                                setTimeout(function () {
                                    autoScaling();
                                }, 100);
                            }
                        } catch (e) {
                            if (opts.error) {
                                opts.error(infocode.code3);
                            }
                            myalert('系统错误，请重试！');
                        }
                    }
                }
            });
        }
    });
})(jQuery);