/// JavaScript Document
/// urlParameters 获取js文件后的url参数组，如：test.js?id=1&classid=2中的?后面的内容
urlParameters = (function (script) {
    var l = script.length;

    for (var i = 0; i < l; i++) {
        //alert(document.querySelector);
        me = script[i].getAttribute('src');
    }
    return me.split('?')[1];
})(document.getElementsByTagName('script'))

///获取url参数值函数
///name:参数名
///
GetParameters = function (name) {
    if (urlParameters && urlParameters.indexOf('&') > 0) {
        var parame = urlParameters.split('&'), i = 0, l = parame.length, arr;
        for (var i = 0; i < l; i++) {
            arr = parame[i].split('=');
            if (name === arr[0]) {
                return arr[1];
            }
        }
    }
    return null;
}

//可转换为fn
//Common.showFlash = function (id, url, width, height, mode) {
if (GetParameters("url") != null & GetParameters("width") != null & GetParameters("height") != null) {
    var url = GetParameters("url");
    var width = GetParameters("width");
    var height = GetParameters("height");
    var swf_src=url
    var arr = new Array();
    var str = "";
    var mode = true;
    arr.push("<object id classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\" width=\"" + width + "\" height=\"" + height + "\"> ");
    arr.push("<param name=\"movie\" value=\"" + url + "\">");
    arr.push("<param name=\"quality\" value=\"high\"> ");
    if (mode) {
        arr.push("<param name=\"wmode\" value=\"transparent\">");
    }
    arr.push("<param name=\"menu\" value=\"false\">");
    arr.push("<embed src=\"" + url + "\" quality=\"high\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" width=\"" + width + "\" height=\"" + height + "\" wmode=\"transparent\"></embed>");
    arr.push("</object>");
    str = arr.join("");
    document.write(str);

}

///js判断swf加载成功
//    timer = setInterval("loading()", 10);//判断
//function loading() {
//    var mFlash = getById("mFlash");
//    var divIng = getById("divBoolar");
//    var tmeValue = 0;
//    if (ubType) {//判断是否IE浏览器
//        tempValue = objrUrl.PercentLoaded();
//    }
//    else {
//        tempValue = document.embeds["emSrc"].PercentLoaded();
//    }
//    divIng.style.width = tempValue + "%";
//    divIng.innerHTML = tempValue + "%";
//    if (tempValue == 100) {
//        $("objrUrl").style.visibility = "visible";
//        $("objrUrl").style.height = "400px";
//        if (!ubType) {
//            getById("emSrc").style.visibility = "visible";
//            getById("emSrc").style.height = "400px";
//        }
//        getById("imgLoad").style.display = "none";
//        clearInterval(timer);
//    }
//}
//function getById(idValue){
//    return document.getElementById(idValue);
//}