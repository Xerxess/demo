///购物车
var cart = {
    //遍历cart
    CartName: "cookie_cart",
    Selectlist: function () {
        var _cart_arry = new Array();
        var _cart = c_cookie.Get(this.CartName); //获得cart购物车
        if (_cart != null) {
            var _cart_list = _cart.split('|'); //拆分单个商品类
            if (_cart_list.length > 0) {
                for (var i = 0; i < _cart_list.length; i++) {//提取每个商品
                    var _cart_model = new cartmodel(); //实例化model
                    var _good_str = _cart_list[i].split(','); //单商品str
                    _cart_model.Good_Id = _good_str[0];
                    _cart_model.Good_Name = _good_str[1];
                    _cart_model.Good_Price = _good_str[2];
                    _cart_model.Good_Vip_Price = _good_str[3];
                    _cart_model.Good_Count = _good_str[4];
                    _cart_model.Good_Total = _good_str[5];
                    _cart_model.Good_Img = _good_str[6];
                    _cart_arry.push(_cart_model);
                    _cart_model = null;
                }
                return _cart_arry; //返回所有商品model信息
            }
            else {
                return null;
            }
        }
        else {
            //alert("购物车为空");
            return null;
        }
    },
    //查找单个cart
    Selectid: function (id) {
        var _cart_model = new cartmodel(); //实例化model
        var _cart_arry = this.Selectlist(); //得到购物车列表
        if (_cart_arry != null) {
            if (_cart_arry.length > 0) {
                for (var i = 0; i < _cart_arry.length; i++) {
                    if (_cart_arry[i].Good_Id == id) {
                        return _cart_arry[i]; //得到model
                    }
                }
            }
            else { return null; }
        }
        else {
            return null;
        }
    },
    //尾部添加商品
    Insert: function (_id, _name, _price, _vip_price, _count, _total, _img) {
        var goodstr = _id + "," + _name + "," + _price + "," + _vip_price + "," + _count + "," + parseFloat(_price * _count) + "," + _img;
        if (this.Selectid(_id) != null) {
            this.Update(_id, _name, _price, _vip_price, _count, _total, _img);
        }
        else {
            if (this.Selectlist() != null) {
                c_cookie.Set(this.CartName, c_cookie.Get(this.CartName) + "|" + goodstr);
            }
            else {
                c_cookie.Set(this.CartName, goodstr);
            }
        }
        return true;
    },
    //修改数量
    Update: function (_id, _name, _price, _vip_price, _count, _total, _img) {
        var _cart_model = this.Selectid(_id); //得到指定商品
        var _cart_arry = this.Selectlist(); //得到购物车列表
        _cart_model.Good_Count = parseInt(_cart_model.Good_Count) + parseInt(_count); //更改数量
        _cart_model.Good_Total = parseFloat(_cart_model.Good_Count * _price); //更改合计
        for (var i = 0; i < _cart_arry.length; i++) {
            if (_id == _cart_arry[i].Good_Id) {
                _cart_arry.splice(i, 1, _cart_model);
                c_cookie.Set(this.CartName, carttext(_cart_arry)); //更新
            }
        }
    },
    //删除
    Delete: function (_id) {
        var _cart_arry = this.Selectlist(); //得到购物车列表
        if (_cart_arry != null) {
            var alen = _cart_arry.length
            for (var i = 0; i < alen; i++) {
                //alert(_id + "=" + _cart_arry[i].Good_Id);
                if (_id == _cart_arry[i].Good_Id) {
                    _cart_arry.splice(i, 1); //删除数组
                    var text = carttext(_cart_arry);
                    if (text != "") {
                        c_cookie.Set(this.CartName, text); //更新
                    }
                    else {
                        cart.Celar_cart();
                    }
                    return true;
                }
            }
        }
        else {
            return false;
        }
    },
    //批量删除
    Deletelist: function () { },
    //合计
    Sum: function () {
        var _cart_arry = this.Selectlist(); //得到购物车列表
        var sum = 0;
        if (_cart_arry != null) {
            for (var i = 0, j = _cart_arry.length; i < j; i++) {
                sum += parseFloat(_cart_arry[i]["Good_Price"]) * parseFloat(_cart_arry[i]["Good_Count"]);
            }
            return sum;
        }
        else {
            return 0;
        }
    },
    //合计指定商品价格总合
    Summodel: function () { },
    //返回商品数
    Count: function () {
        var _cart_arry = this.Selectlist(); //得到购物车列表
        if (_cart_arry != null) {
            return _cart_arry.length;
        }
        else {
            return 0;
        }
    },
    //查找Cart是否有信息
    Whether: function () { },
    //查找单个Cart是否有信息
    Whethermodel: function () { },
    //celar
    Celar_cart: function () {
        c_cookie.Del(this.CartName);
        return true;
    }
}

///cart商品对象
///_id:商品id
///_price：价格
///_vip_price:会员价
///_count:商品数量
///_total:商品价格合计
///_img:产品小图
///_name:商品名称
var cartmodel = function (_id, _name, _price, _vip_price, _count, _total, _img) {
    this.Good_Id = _id;
    this.Good_Name = _name;
    this.Good_Price = parseFloat(_price);
    this.Good_Vip_Price = parseFloat(_vip_price);
    this.Good_Count = parseInt(_count);
    this.Good_Total = parseFloat(_total);
    this.Good_Img = _img;
}

//////
///商品对象转换为cookie
/////
var carttext = function (_cartlist) {
    var str = "", _cart;
    if (_cartlist.length > 0) {
        for (var i = 0; i < _cartlist.length; i++) {
            _cart = _cartlist[i];
            if (i == 0) {
                str = _cart.Good_Id + "," + _cart.Good_Name + "," + _cart.Good_Price + "," + _cart.Good_Vip_Price + "," + _cart.Good_Count + "," + _cart.Good_Total + "," + _cart.Good_Img;
            }
            else {
                str += "|" + _cart.Good_Id + "," + _cart.Good_Name + "," + _cart.Good_Price + "," + _cart.Good_Vip_Price + "," + _cart.Good_Count + "," + _cart.Good_Total + "," + _cart.Good_Img;
            }
        }
        return str;
    }
    else { return ""; }
}

// 对Cookie进行读取,添加,删除操作
var c_cookie = {
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
    }, //读取Cookie结束
    //------------------------------------------Get end------------------------------------------//
    //------------------------------------------Set start------------------------------------------//
    //写入cookie,n为cookie名，v为value 
    Set: function (n, v) {
        //创建一个时间对象t
        var eTime = new Date();
        //Cookie失效时间为1小时,8.64e7 一天, 3.6e6 一小时 
        eTime.setTime(eTime.getTime() + (1 * 3.6e6));
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
    //------------------------------------------Set end------------------------------------------//
    //------------------------------------------Del end------------------------------------------//     
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
        //购物车里商品的总价
        amount = 0;
    }
    //------------------------------------------Del end------------------------------------------// 
};