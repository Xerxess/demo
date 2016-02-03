/**
 * 监听滚动条滚到结尾的插件
 * var myScorll = new Hscroll(window,function(){alert('还到10px就到底了！');},false,10);
 * async参数的意义是防止做ajax请求，请求没有返回就再次触发事件
 * 
 * @auther weirhp@gmail.com
 */

(function($) {
	var Hscroll = function(container, callback, async, range) {
		this.container = container;
		this.callback = callback || function() {
		};
		this.range = range || 20;
		this.async = async || false;
		this.init();
	};

	var BaseScoll = {
		last : {
			top : 0,
			exeTime : new Date().getTime() - 1000,
			complete : true
		},
		init : function() {
			this.last = {
				top : 0,
				exeTime : new Date().getTime() - 1000,
				complete : true
			}
			$(this.container).scroll($.proxy(this._scroll, this));
		},
		_nowTop : function() {
			if (this.container == document || this.container == window) {
				return this.max(document.documentElement.scrollTop,
						document.body.scrollTop);
			} else {
				return $(this.container).scrollTop();
			}
		},
		_nowScrollHeight : function() {
			if (this.container == document || this.container == window) {
				return this.max(document.documentElement.scrollHeight,
						document.body.scrollHeight);
			} else {
				return $(this.container)[0].scrollHeight;
			}
		},
		_nowHeight : function() {
			return $(this.container).height();
		},
		_scroll : function(e) {
			var nowTop = this._nowTop();
			var nowScrollHeight = this._nowScrollHeight();
			var nowHeight = this._nowHeight();
			if ((nowTop + nowHeight + this.range) >= nowScrollHeight
					&& nowTop >= this.last.top) {
				this.doCallback();
			}
			this.last.top = nowTop;
		},
		doCallback : function() {
			var $this = this;
			var now = new Date().getTime();
			// 离最后一次执行的时间差 以及是否是异步，是异步就等上次完成再执行
			if (now - 100 >= this.last.exeTime && this.last.complete) {
				this.last.complete = false;
				$.proxy(this.callback, {
					complete : function() {
						$this.complete();
					}
				})();
				if (!this.async) {
					this.last.complete = true;
				}
				this.last.exeTime = now;
			}
		},
		complete : function() {
			this.last.complete = true;
		},
		destroy : function() {
			$(this.container).unbind('scroll');
		},
		max : function(x, y) {
			return x > y ? x : y;
		}
	};

	Hscroll.prototype = BaseScoll;
	window.Hscroll = Hscroll;
})(jQuery);
