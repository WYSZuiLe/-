var jq = jQuery.noConflict();
//回到顶部
var goTop = (function(window){
	return function(obj){
		//显示隐藏
   	jq(window).scroll(function(){
      if(jq(window).scrollTop()>0){
           obj.show();
      }else{
           obj.hide();
      };
   	});

   	 //返回顶部
   	obj.on('click',function(){
      jq('html,body').scrollTop(0);
   	});
	}
})(window);
var oNby={
	zansUrl:'/index.php?m=api&c=api&a=setDigs',
	searchTip:function(o, boxid,i,offX){
	  if (o.is('input:text')) {
	  	offX = offX || 0;
	    jq('#' + boxid).remove();
	    var otext = o.val();
	    var paramtxt = otext;
	    if (otext != '') {
	      if (otext.length > 10) {
	        otext = otext.substring(0, 10) + '...';
	      }
	      var sBox = '<ul id="' + boxid + '" class="searchTip"><li id="toNews">含<span>' + otext + '</span>的资讯</li><li id="toVideo" class="active">含<span>' + otext + '</span>的视频</li><li id="toPhoto">含<span>' + otext + '</span>的图库</li><li id="toAudio">含<span>' + otext + '</span>的音频</li></ul>';
	      jq('body').append(sBox).click(function () {
	        jq('#' + boxid).remove();
	      });

	      jq('#' + boxid).children('li').eq(i).addClass('cur').siblings().removeClass();
	      jq('#' + boxid).css({
	        left: o.offset().left+offX,
	        top: o.offset().top + o.outerHeight(true),
	        width: o.parent().attr('class') == 'sech-box' ? '288' : o.parent().width()
	      }).children('li').filter(':not(".title")').hover(function () {
	        jq(this).addClass('active').siblings(":not('.title')").removeClass();
	      });

	      jq('#' + boxid).children('li').filter(':not(".title")').each(function () {
	          jq(this).click(function(){
	            var liid = jq(this).attr('id');
	            switch (liid) {
	              case 'toVideo':
	                window.location.href = '/search/video/q'+encodeURIComponent(paramtxt)+'_o_1.html';
	                break;
	              case 'toNews':
	                window.location.href = '/search/news/q'+encodeURIComponent(paramtxt)+'_o_1.html';
	                break;
	              case 'toAudio':
	                window.location.href = '/search/audio/q'+encodeURIComponent(paramtxt)+'_o_1.html';
	                break;
	              case 'toPhoto':
	                window.location.href = '/search/photos/q'+encodeURIComponent(paramtxt)+'_o_1.html';
	                break;
	            }
	            return false;
	          });
	      });
	    }
	  }
	},

	decodeParams:function ( para , isEncode){
	    if( typeof para !== 'object' ){
	      return para;
	    }else{
	      var html = [];
	      for(var p in para ){
	      	if(isEncode){
	      		html.push( p + "=" + encodeURIComponent(para[p]) );
	      	}else{
	      		html.push( p + "=" + para[p] );
	      	}
	      }
	      return html.join("&");
	    }
	},

	imgResize:function(imgurl,w,h){
    if(imgurl.indexOf('cuctv.com')!=-1){
      var match = /(_[0-9]+X[0-9]+)(.jpg|.png|.gif)/;
      if(match.test(imgurl)){
        return imgurl.replace(/(_[0-9]+X[0-9]+)(.jpg|.png|.gif)/g,'_'+w+'X'+h+'$2');
      }else{
        return imgurl.replace(/(.jpg|.png|.gif)/g,'_'+w+'X'+h+'$1');
      }
    }else{
      return imgurl;
    }
  },

	/**
	 * [创建模态音频播放器]
	 * @param  {[jQ]} clickJqObj [点击的对象]
	 * @return {[type]}            [description]
	 */
	showAudio:function(clickJqObj){
		if(!(clickJqObj instanceof jq)){return;}
		var that = clickJqObj,
		adoInfo = {},
		objectHtmlArr = [];
		if(that.attr('playurl')){
			adoInfo.playurl = that.attr('playurl');
			adoInfo.title = that.attr('title');
			adoInfo.source = that.attr('source');
			adoInfo.duration = Math.ceil(that.attr('duration')/1000);
			adoInfo.isPlay = true;
			adoInfo.img = that.attr('thumb');
			objectHtmlArr.push('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%" data="/statics/js/swf/AudoPlayerNanGuang.swf" type="application/x-shockwave-flash">');
			objectHtmlArr.push('<param name="movie" value="/statics/js/swf/AudoPlayerNanGuang.swf" type="application/x-shockwave-flash">');
			objectHtmlArr.push('<param value="true" name="allowFullScreen">');
			objectHtmlArr.push('<param value="transparent" name="wmode">');
			objectHtmlArr.push('<param value="always" name="allowScriptAccess">');
			objectHtmlArr.push('<param value="'+oNby.decodeParams(adoInfo)+'" name="FlashVars">');
			objectHtmlArr.push('<!--[if !IE]>-->');
			objectHtmlArr.push('<object width="100%" height="100%" data="/statics/js/swf/AudoPlayerNanGuang.swf" type="application/x-shockwave-flash">');
		    objectHtmlArr.push('<param name="movie" value="/statics/js/swf/AudoPlayerNanGuang.swf">');
		   	objectHtmlArr.push('<param value="true" name="allowFullScreen">');
		    objectHtmlArr.push('<param value="transparent" name="wmode">');
		    objectHtmlArr.push('<param value="always" name="allowScriptAccess">');
		    objectHtmlArr.push('<param value="'+oNby.decodeParams(adoInfo)+'" name="FlashVars">');
			objectHtmlArr.push('</object> ');
	    	objectHtmlArr.push('<!--<![endif]-->');
			objectHtmlArr.push('</object>');

			jq('.obj-box').html(objectHtmlArr.join(''));
			//jq('body,html').animate({scrollTop:jq('.obj-box').offset().top},200);
			
			that.closest('tr').addClass('on').siblings().removeClass('on');
//			that.closest('tr').find('em').attr('class','ico-pd ico-musehover');
		}
	},
	init:function(){
		var me = this,
				$slideBanner = jq('.slideBanner'),
				$slideAd = jq('.slideAd'),
				$navlist = jq('.nav-list'),
				$searchIcon = jq('#searchIcon'),
				$sechbox = jq('#sech-box'),
				$importantNav=jq('#importantNav'),
				$slideBox = jq('#slideBox'),
				$yahei = jq('.yahei'),
				subList = $yahei.find('.subList'),
				em = $yahei.find('em'),
				$wailian = jq('.wailian'),
				$directNav = jq('.directNav'),
				$trifficSlide = jq('#trifficSlide'),
				$directMod = jq('.directMod'),
				$program = jq('.program'),
				$iconShow = jq('.iconShow'),
				$clickPop = jq('#clickPop'),
				$fenxiang = jq('#fen-xiang'),
				$dianji = jq('.dianji'),
				$tupic = jq('.tu-pic'),
				$searchTip = jq('#searchTip'),
				$sbg =jq('.sbg'),
				$qrMod = jq('.qrMod'),
				len1 = $slideBanner.find('.hd li').length,
				marL1 = -(49*len1)/2,
				len2 = $slideAd.find('.hd li').length,
				marL2 = -(50*len2)/2,
				winHeight = jq('body,html').height(),
				popEmailTpl = '<figure class="popEmail">'+
												'<em class="closeIcon"></em>'+
												'<div class="con">'+
													'<p>您好！蒲树林董事长邮箱为：</p>'+
													'<p><a href="mailto:psl@cucn.edu.cn" target="_blank">psl@cucn.edu.cn</a></p>'+
													'<p>欢迎您来邮提出宝贵建议和意见。</p>'+
												'</div>'+
											'</figure>',
				onlineSubTpl = '<div class="layout-wrap"></div>'+
												'<section class="onlineSub" id="onlineSub">'+
													'<div class="hd">在线投稿<a href="javascript:void(0)" class="close"></a></div>'+
													'<div class="bd">'+
														'<p>您好！欢迎来邮南广网邮箱：</p>'+
														'<a href="mailto:cucnnews@126.com" target="_blank">cucnnews@126.com</a>'+
														'<p>投稿。</p>'+
													'</div>'+
												'</section>';
		//侧导航定位变化
		jq(document).on('scroll',function(){
				if(jq(document).scrollTop()+$importantNav.height()>=winHeight){
					$importantNav.css('position','absolute').css('top',jq(document).scrollTop() +'px');
				}else{
					$importantNav.css('position','fixed').css('top','314px');
				}
		});

		//文章内容图片自动居中
		jq(".zw-text div:first").after("<p></p>");
		jq(".zw-text img").parent().css({"text-indent":"0" ,"text-align":"center"});
		jq(".zw-text img").parent().next().css({"text-indent":"0" ,"text-align":"center" ,"font-family":"KaiTi_GB2312" ,"font-size":"14px"});

	
		//官方微信扫码
		$qrMod.on('mouseenter','.qrCode',function(){
			var that = jq(this);
			that.find('.qrPop').show();
		}).on('mouseleave','.qrCode',function(){
			var that = jq(this);
			that.find('.qrPop').hide();
		});
		//顶部导航效果
		$navlist.on('mouseenter','.grey',function(){
			var that = jq(this);
			that.find('.sub-menu').stop().show(300);
			that.find('.sbg').hide();
		}).on('mouseleave','.grey',function(){
			var that = jq(this);
			that.find('.sub-menu').stop().hide(300);
			that.find('.sbg').show();
		});
		//董事长邮箱弹窗
		jq('.systemMod').on('click','.second',function(){
			jq('.systemMod').append(popEmailTpl);
			return false;
		}).on('click','.closeIcon',function(){
			jq('.popEmail').remove();
			return false;
		});
		//在线投稿弹窗
		jq('.rBox').on('click','.up .oncolor',function(){
			jq('body').append(onlineSubTpl);
			//关闭在线投稿弹窗
			jq('#onlineSub').on('click','.close',function(){
				jq('#onlineSub').remove();
				jq('.layout-wrap').remove();
				return false;
			});
			return false;
		});

		//音频播放
		jq('#audioList').on('click','a',function(){
			me.showAudio(jq(this));
			return false;
		});
		//视频顶踩
		jq('#zanbtn').on('click',function(){
			var that = jq(this),
			id = that.parent().attr('id'),
			catid = that.parent().attr('catid'),
			$num = jq('.zanCount'),
			num = parseInt($num.text());
			jq.post(me.zansUrl+'&id='+id+'&catid='+catid,function(res){
				if(res.result==1){
					that.addClass('ico-zanhover');
					$num.text(++num);
				}else{
					alert(res.msg);
				}
			});
			return false;
		});

		//搜索框显示隐藏
		$searchIcon.on('click',function(e){
			$sechbox.stop().slideToggle(200);
			return false;
		});
			// 全站搜索
		var monTimer = null, curVal='',inputTarget = jq('#sech-box>input:text'),serchTipIndex = 0;
	  	inputTarget.focusin(function(){
	      var $this = jq(this);
	      monTimer = setInterval(function(){
	        if(curVal != $this.val()){
	          me.searchTip($this, 'searchtip', serchTipIndex,-1);
	        }
	        curVal = $this.val();
    	},500);
	  	}).focusout(function(){
	    	clearInterval(monTimer);
	  	}).keyup(function(event){
		    var keytxt = inputTarget.val()
		      , $Box = jq('#searchtip')
		      , iS = $Box.children('li').size();
		    
		    switch (event.keyCode) {
		        case 38:
		          serchTipIndex--;
		          if (serchTipIndex < 0) { serchTipIndex = iS - 1 }
		          $Box.children('li').eq(serchTipIndex).addClass('active').siblings().removeClass();
		          break;
		        case 40:
		          serchTipIndex++;
		          if (serchTipIndex >= iS) { serchTipIndex = 0 }
		          $Box.children('li').eq(serchTipIndex).addClass('active').siblings().removeClass();
		          break;
		        case 13:
		          if (serchTipIndex == 0) {
		        	  window.location.href = '/search/news/q'+encodeURIComponent(keytxt)+'_o_1.html';
		          } else if (serchTipIndex == 1) {
		        	  window.location.href = '/search/video/q'+encodeURIComponent(keytxt)+'_o_1.html';
		          } else if (serchTipIndex == 2) {
		        	  window.location.href = '/search/photos/q'+encodeURIComponent(keytxt)+'_o_1.html';
		          } else if (serchTipIndex == 3) {
		        	  window.location.href = '/search/audio/q'+encodeURIComponent(keytxt)+'_o_1.html';
		          }
		          break;
		      }
		      event.stopPropagation();
	  }).next().click(function(){//默认跳转地址
	    if(inputTarget.val() == ''){
	      alert('请输入搜索关键字');
	    }else{
	      window.location.href = '/search/video/q' + encodeURIComponent(inputTarget.val())+'_o_1.html';
	    }
	    return false;
	  });
		//首页banner切换
		$slideBanner.slide({
			mainCell:".bd ul",
			trigger:"mouseover",
			interTime:4000,
			delayTime:900,
			autoPlay:true,
			startFun:function(){
					$slideBanner.find('.hd').css('margin-left',marL1+'px');
			}});
		//底部图片切换
		$slideAd.slide({
			mainCell:".bd ul",
			trigger:"click",
			interTime:4000,
			delayTime:900,
			autoPlay:true,
			startFun:function(){
				$slideAd.find('.hd').css('margin-left',marL2+'px');
	    }});
		
		//侧边导航
		$importantNav.find('.first').on('mouseenter','dd',function(){
			var that = jq(this);
			that.addClass('on').find('.floatItem').stop().show(300);
		}).on('mouseleave','dd',function(){
			var that = jq(this);
			that.removeClass('on').find('.floatItem').stop().hide(300);
		});
		//侧边微信
		$importantNav.find('.third').on('mouseenter','dt',function(){
			var that = jq(this);
			that.next().stop().slideToggle(200);
		});
		$importantNav.find('.third').on('mouseleave',function(){
			var that = jq(this);
			that.find('dd').stop().slideToggle(200);
		});
		//大学概况  学校简介
		$slideBox.slide({mainCell:".bd ul",effect:"left",autoPlay:true,interTime:4000,delayTime:900});
		//教育教学左侧下拉效果
		if($yahei.find('.navArea').next().attr('class')=='subList'){
			$yahei.on('click','.navArea',function(){
				var that = jq(this);
				if(that.next().is(':hidden')){
					that.find('em').addClass('jian').removeClass('addIcon');
					that.next().show();
				}else{
					that.find('em').removeClass('jian').addClass('addIcon');
					that.next().hide();
				}
				that.parent().addClass('current').siblings().removeClass('current');
			});
		}
		//相关链接效果
		$wailian.on('mouseenter','.wailian-hover',function(){
			var that = jq(this);
			that.next().show(300);
		});
		$wailian.on('mouseleave',function(){
			var that = jq(this);
			that.find('#wailian-show').hide(300);
		});
		//学校地图右侧切换
		$trifficSlide.slide({trigger:"click"});
		$trifficSlide.on('click','.num1',function(){
			var that = jq(this);
			that.closest('div').addClass('hd1').removeClass('hd2 hd3 hd4 hd5');
			that.removeClass('short').addClass('dt height');
			jq('.num2').removeClass('height hc').addClass('short');
			jq('.num3').removeClass('height ct').addClass('short');
			jq('.num4').removeClass('height fj').addClass('short');
			jq('.num5').removeClass('height zj').addClass('short');
		});
		$trifficSlide.on('click','.num2',function(){
			var that = jq(this);
			that.closest('div').addClass('hd2').removeClass('hd1 hd3 hd4 hd5');
			that.removeClass('short').addClass('hc height');
			jq('.num1').removeClass('height dt').addClass('short');
			jq('.num3').removeClass('height ct').addClass('short');
			jq('.num4').removeClass('height fj').addClass('short');
			jq('.num5').removeClass('height zj').addClass('short');
		});
		$trifficSlide.on('click','.num3',function(){
			var that = jq(this);
			that.closest('div').addClass('hd3').removeClass('hd1 hd2 hd4 hd5');
			that.removeClass('short').addClass('ct height');
			jq('.num1').removeClass('height dt').addClass('short');
			jq('.num2').removeClass('height hc').addClass('short');
			jq('.num4').removeClass('height fj').addClass('short');
			jq('.num5').removeClass('height zj').addClass('short');
		});
		$trifficSlide.on('click','.num4',function(){
			var that = jq(this);
			that.closest('div').addClass('hd4').removeClass('hd1 hd2 hd3 hd5');
			that.removeClass('short').addClass('fj height');
			jq('.num1').removeClass('height dt').addClass('short');
			jq('.num2').removeClass('height hc').addClass('short');
			jq('.num3').removeClass('height ct').addClass('short');
			jq('.num5').removeClass('height zj').addClass('short');
		});
		$trifficSlide.on('click','.num5',function(){
			var that = jq(this);
			that.closest('div').addClass('hd5').removeClass('hd1 hd2 hd3 hd4');
			that.removeClass('short').addClass('zj height');
			jq('.num1').removeClass('height dt').addClass('short');
			jq('.num2').removeClass('height hc').addClass('short');
			jq('.num3').removeClass('height ct').addClass('short');
			jq('.num4').removeClass('height fj').addClass('short');
		});
		//学校地图锚点效果
		$directNav.on('click','li',function(){
			var that = jq(this),top = 0;
			index = that.index();
			if(index == 0){
				top = 650;
			}else if(index == 1){
				top = 1300;
			}else{
				top = 2200;
			}
			$directNav.find('em').removeClass('anchor').eq(index).addClass('anchor');
			jq('html,body').animate({'scrollTop':top},1000);
		});
		//左侧目录导航
		jq(window).scroll(function(){
			if(jq(window).scrollTop()<=830){
				$directMod.css({'position':'absolute','top':590});
			}else{
				$directMod.css({'position':'fixed','top':0});
			}
		});
		//视友分享
		$fenxiang.on('click','[type="shiyou"]',function(){
			var title = jq('meta[name="title"]').attr('content'),
					$img = jq('.main-text').find('img'),
					pic = $img.eq(0).attr('src') == undefined ? '' : $img.eq(0).attr('src'),
					renderParam = "width=600,height=555,top = " + (jq(window).height() - 555) / 2 + "px,left =" + (jq(window).width() - 600) / 2 + "px";
			window.open('http://app.cuctv.com/share/share.action?url='+encodeURIComponent(location.href)+'&appkey=08a76503aac24919b625e7fb34726c98&type=1&title='+encodeURIComponent(title)+'&pic='+encodeURIComponent(pic),'_blank',renderParam);
			return false;
		});
		
		(function(){
			//点击放大字体
			var min = 12;
			var max = 18;
			var zwText = jq('.zw-text');
			var fontsize = parseInt(zwText.css('font-size'));
			$dianji.on('click','.zw-big',function(){
				if(fontsize < max){
					fontsize++;
					zwText.css('font-size',fontsize + 'px');
				}
				return false;
			});
			//点击放大字体
			$dianji.on('click','.zw-saml',function(){
				if(fontsize > min){
					fontsize--;
					zwText.css('font-size',fontsize+'px');
				}
				return false;
			});
		})();

		//云视频道首页按钮显示隐藏
		$program.on('mouseenter','li',function(){
			var that = jq(this),
					index = that.index();
			$program.find('em').hide().eq(index).show();
		}).on('mouseleave','li',function(){
			$program.find('em').hide();
		});
		$iconShow.on('mouseenter','li',function(){
			var that = jq(this),
					index = that.index();
			$iconShow.find('em').hide().eq(index).show();
		}).on('mouseleave','li',function(){
			$iconShow.find('em').hide();
		});
		//图片详情页滚动
		$tupic.slide({
			titCell:".hd li",
			mainCell:".bd ul",
			trigger:"click",
			interTime:4000,
			delayTime:900,
			autoPlay:true,
			startFun:function(i,c){
				var that = $tupic,
				 		$hdCon = that.find('.hd ul'),
		    		liW = $hdCon.children(':eq(0)').outerWidth(true);
		    	$hdCon.width(liW*$hdCon.children().size());
	    		if(i>4){
	    			$hdCon.parent().animate({scrollLeft:liW*i},500);
	    		}else{
	    			
	    			$hdCon.parent().animate({scrollLeft:0},500);
	    		}
	    	}
		});
		// $tupic.slide({mainCell:".bd ul",trigger:"click",interTime:8000,delayTime:900,autoPlay:true});	
		//云视频到师生作品图片详情
		if($tupic.find('.bd li').length==1){
			$tupic.find('.hd').hide();
			$tupic.find('.prev').hide();
			$tupic.find('.next').hide();
			$tupic.find('.pageState').hide();
			$tupic.css('height','420px');
		}

		//查看大图
		$tupic.on('click','.bd img',function(){
			var pic,index=0;
			if($tupic.find('.bd li').length == 1){
				pic = $tupic.find('.bd li').find('img').attr('src');
			}else{
				index = $tupic.find('.hd li.on').index();
				pic = $tupic.find('.bd li').eq(index).find('img').attr('src');
			}
			jq('body').append('<div id="mask-layer" class="mask-layer"></div><div class="popPic"><img src='+me.imgResize(pic,1002,4000)+' alt=""><em></em></div>');
			//关闭弹窗
			jq('.popPic').on('click','em',function(){
				var that = jq(this);
				that.closest('.popPic').remove();
				jq('#mask-layer').remove();
			});
		});

		jq('.zan-datu').on('click',function(){
			var pic,index=0;
			if($tupic.find('.bd li').length == 1){
				pic = $tupic.find('.bd li').find('img').attr('src');
			}else{
				index = $tupic.find('.hd li.on').index();
				pic = $tupic.find('.bd li').eq(index).find('img').attr('src');
			}
			jq('body').append('<div id="mask-layer" class="mask-layer"></div><div class="popPic"><img src='+me.imgResize(pic,1002,4000)+' alt=""><em></em></div>');
			//关闭弹窗
			jq('.popPic').on('click','em',function(){
				var that = jq(this);
				that.closest('.popPic').remove();
				jq('#mask-layer').remove();
			});
		});
		
		if(jq('video').length){
			jq('video').each(function(){
				var that = jq(this);
				var h = Math.ceil(that.width()*9/16);
				that.height(h);
//				videojs(
//					that.get(0),
//					{controls: false, autoplay: false, preload: 'auto',height:h+'px'}
//				);
			});
		}
	}
};
/**
 * [文档加载完毕]
 */
jq(function(){
	oNby.init();
	goTop(jq('#goTop'));
});




