/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
!function (w, $) {
    w.MyDataBind = {
        'config': null,
        'source': {
            total: 0,
            cont: '', //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
            pages: 0, //通过后台拿到的总页数
            curr: 1, //当前页
            pageitems: [15, 20, 30],
            listitem: 15,
            jump: function (obj, first) { //触发分页后的回调
            }
        },
        'undefined': function (str) {
            if (!str || str === 'undefined') {
                return '';
            }
            return str;
        },
        'tempbind': function (str, obj) {
            var that = this;
            return str.replace(/\{\$\w+\}/gi, function (matchs) {
                var key = matchs.replace(/\{\$/g, "").replace(/\}/g, "");
                var returns = obj[key];
                //执行回调
                for (var i = 0, j = that.length; i < j; i++) {
                    if (that[i]['id'] === key) {
                        if (that[i].fun) {
                            returns = (returns + "") == "undefined" ? "" : returns;
                            return that[i].fun(obj);
                        }
                        break;
                    }
                }
                return (returns + "") == "undefined" ? "" : returns;
            });
        },
        'createlist': function (data) {
            var that = this
            var thhid = that.config['thhid'];//获得是否显示表头
            var field = that.config['config']; //获得列表的详细配置
            var tempbind = that.tempbind;
            var _html = '<table class="table">';
            var _thAll = '<tr class="first-child">';
            var _trAll = '<tr>';
            var _trall = [];
            var _field = field;
            //创建模板
            for (var i = 0, j = _field.length; i < j; i++) {
                var w = _field[i]['w'] ? _field[i]['w'] : null;
                var align = _field[i]['align'] ? _field[i]['align'] : 'center';
                if (thhid) {
                    var _th = ['<th'];
                    if (w) {
                        _th.push(' width="' + w + '"');
                    }
                    if (align) {
                        _th.push(' style="text-align:' + align + '"');
                    }
                    _th.push('>');
                    if (_field[i].thfun) {
                        _th.push(_field[i].thfun());
                    }
                    else {
                        _th.push(_field[i].name);
                    }
                    _th.push('</th>');
                    _thAll += _th.join('');
                }
                _trAll += '<td ';
                if (align) {
                    _trAll += ' style="text-align:' + align + ';width:' + w + 'px;"';
                }
                _trAll += '>{$' + _field[i].id + '}</td>';
                if (i === j - 1) {
                    _thAll += '</tr>';
                    _trAll += '</tr>';
                }
            }

            //绑定数据
            if (!data.length) {
                _trall.push(tempbind(_trAll, {})); //产生一条空数据
            }
            for (var i = 0, j = data.length; i < j; i++) {
                data[i]['sort'] = i + 1;
                _trall.push(tempbind.call(field, _trAll, data[i]));
            }
            _html += _thAll + _trall.join('') + '</table>';
            return _html;
        },
        'laypage': function (oobj) {
            var that = this;
            var obj = that.config['laypage']; //获得分页列表
            var source = that.source;
            for (var p in obj) {
                if (source.hasOwnProperty(p)) {
                    source[p] = obj[p];
                }
            }
            for (var p in oobj) {
                if (source.hasOwnProperty(p)) {
                    source[p] = oobj[p];
                }
            }
            laypage(source);
        },
        'start': function (config, fun) {
            var _that = this;
            _that.config = config;
            if (fun) {
                fun(config, function (data) {
                    if (data) {
                        _that.laypage({
                            'total': data['total']
                        });
                    }
                });
                _that.laypage({
                    jump: function (obj, first) {
                        if (first) {
                            return;
                        }
                        fun(obj, first);
                    }
                });
            }
            else {
                alert('请定义回调函数');
            }
        }
    };
}(window, $);