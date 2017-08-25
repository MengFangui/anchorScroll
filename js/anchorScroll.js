/*
	 * 作者：孟繁贵
	 * 2017-08-25
	 * 版本：1.0
	 */
jQuery.anchorScroll = function(elem1, elem2) {
	var currObj,
		offsetTop = 0,
		h2List = new Array(),
		h3List = new Array(),
		positonList = new Array();
	/*
	 * addNav()函数:根据文章内容自动生成目录结构
	 * 原理是：(1)查找文章内容中的h2和h3标签
	 * 		  (2)根据查找到的h2标签生成 <dd class="cate-item1"><a href="#3">内设机构</a></dd> 样式的目录结构
	 * 	      (3)根据查找到的h3标签生成 <dd class="cate-item2"><a href="#3_1">办公室</a></dd> 样式的目录结构
	 */
	var addNav = function() {
		var i1 = 0,
			i2 = 0,
			n1 = 0,
			n2 = 0;
		var temp = '<dl style="">';
		//注意正则表达式写法：/(<h[2-3].*>.*?<\/h[2-3]>)/ig 在量词后面直接加上一个问号？就是非贪婪模式
		var cateList = $(elem1).html().match(/(<h[2-3].*>.*?<\/h[2-3]>)/ig);
		for(var i = 0; i < cateList.length; i++) {
			if(/(<h2.*>.*?<\/h2>)/ig.test(cateList[i])) {
				n1++;
				n2 = 0;
				//去掉html标签正则表达式：/<.*?>/g
				temp += '<dd class="cate-item1"><a href="#' + n1 + '">' + cateList[i].replace(/<.*?>/g, "") + '</a></dd>';
				h2List[i1] = n1;
				i1++;
			} else {
				n2++;
				//去掉html标签正则表达式：/<.*?>/g
				temp += '<dd class="cate-item2"><a href="#' + n1 + '_' + n2 + '">' + cateList[i].replace(/<.*?>/g, "") + '</a></dd>';
				h3List[i2] = n1 + '_' + n2;
				i2++;
			}
		}
		temp += '</dl>';
		$(elem2).append(temp);
	};
	//addPoint()函数:向文章内容中插入锚点，同时计算每个锚点距离文章顶部的距离
	var addPoint = function() {
		var i1 = i2 = 0;
		$(elem1).find('h2').each(function() {
			$(this).prepend('<a name="' + h2List[i1] + '"></a>');
			i1++;
		});
		$(elem1).find('h3').each(function() {
			$(this).prepend('<a name="' + h3List[i2] + '"></a>');
			i2++;
		});
		$(elem1).find('a[name]').each(function() {
			positonList.push($(this).parent().position().top);
		});
	};
	//clickPoint()函数:点击目录，跳转相对应文章内容的锚点位置
	//注意:先将滚动条修正为滚回到顶部
	var clickPoint = function() {
		$(elem2 + ' a').click(function(e) {
			e.preventDefault();
			$(elem2 + ' dd').removeClass('active');
			$(this).parent('dd').addClass('active');
			currObj = $("[name='" + $(this).attr('href').replace(/#/, '') + "']");
			//先修正为滚回到顶部
			$(elem1).scrollTop(0);
			offsetTop = currObj.parent().position().top;
			$(elem1).scrollTop(offsetTop);
		});
	};
	//scrollWin()函数:文章内容滚动时，对应的目录也随之变化
	var scrollWin = function() {
		var windowTop = 0;
		$(elem1).scroll(function() {
			windowTop = $(elem1).scrollTop();
			for(var i = 0; i < positonList.length; i++) {
				if(windowTop >= positonList[i]) {
					$(elem2 + ' dd').removeClass('active');
					$(elem2).find('a').eq(i).parent().addClass('active');
				}
			}
		});
	};
	//初始化函数
	var init = function() {
		//增加目录结构
		addNav();
		//增加文章内容锚点
		addPoint();
		//目录绑定click事件
		clickPoint();
		//文章内容绑定滚动事件
		scrollWin();
	}
	init();
}