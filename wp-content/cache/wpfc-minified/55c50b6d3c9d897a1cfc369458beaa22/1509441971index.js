// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/jquery.countdown.min.js 
/*!
 * The Final Countdown for jQuery v2.0.5 (http://hilios.github.io/jQuery.countdown/)
 * Copyright (c) 2015 Edson Hilios
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){"use strict";function b(a){if(a instanceof Date)return a;if(String(a).match(g))return String(a).match(/^[0-9]*$/)&&(a=Number(a)),String(a).match(/\-/)&&(a=String(a).replace(/\-/g,"/")),new Date(a);throw new Error("Couldn't cast `"+a+"` to a date object.")}function c(a){var b=a.toString().replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1");return new RegExp(b)}function d(a){return function(b){var d=b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);if(d)for(var f=0,g=d.length;g>f;++f){var h=d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),j=c(h[0]),k=h[1]||"",l=h[3]||"",m=null;h=h[2],i.hasOwnProperty(h)&&(m=i[h],m=Number(a[m])),null!==m&&("!"===k&&(m=e(l,m)),""===k&&10>m&&(m="0"+m.toString()),b=b.replace(j,m.toString()))}return b=b.replace(/%%/,"%")}}function e(a,b){var c="s",d="";return a&&(a=a.replace(/(:|;|\s)/gi,"").split(/\,/),1===a.length?c=a[0]:(d=a[0],c=a[1])),1===Math.abs(b)?d:c}var f=[],g=[],h={precision:100,elapse:!1};g.push(/^[0-9]*$/.source),g.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),g=new RegExp(g.join("|"));var i={Y:"years",m:"months",w:"weeks",d:"days",D:"totalDays",H:"hours",M:"minutes",S:"seconds"},j=function(b,c,d){this.el=b,this.$el=a(b),this.interval=null,this.offset={},this.options=a.extend({},h),this.instanceNumber=f.length,f.push(this),this.$el.data("countdown-instance",this.instanceNumber),d&&("function"==typeof d?(this.$el.on("update.countdown",d),this.$el.on("stoped.countdown",d),this.$el.on("finish.countdown",d)):this.options=a.extend({},h,d)),this.setFinalDate(c),this.start()};a.extend(j.prototype,{start:function(){null!==this.interval&&clearInterval(this.interval);var a=this;this.update(),this.interval=setInterval(function(){a.update.call(a)},this.options.precision)},stop:function(){clearInterval(this.interval),this.interval=null,this.dispatchEvent("stoped")},toggle:function(){this.interval?this.stop():this.start()},pause:function(){this.stop()},resume:function(){this.start()},remove:function(){this.stop.call(this),f[this.instanceNumber]=null,delete this.$el.data().countdownInstance},setFinalDate:function(a){this.finalDate=b(a)},update:function(){if(0===this.$el.closest("html").length)return void this.remove();var b,c=void 0!==a._data(this.el,"events"),d=new Date;b=this.finalDate.getTime()-d.getTime(),b=Math.ceil(b/1e3),b=!this.options.elapse&&0>b?0:Math.abs(b),this.totalSecsLeft!==b&&c&&(this.totalSecsLeft=b,this.elapsed=d>=this.finalDate,this.offset={seconds:this.totalSecsLeft%60,minutes:Math.floor(this.totalSecsLeft/60)%60,hours:Math.floor(this.totalSecsLeft/60/60)%24,days:Math.floor(this.totalSecsLeft/60/60/24)%7,totalDays:Math.floor(this.totalSecsLeft/60/60/24),weeks:Math.floor(this.totalSecsLeft/60/60/24/7),months:Math.floor(this.totalSecsLeft/60/60/24/30),years:Math.floor(this.totalSecsLeft/60/60/24/365)},this.options.elapse||0!==this.totalSecsLeft?this.dispatchEvent("update"):(this.stop(),this.dispatchEvent("finish")))},dispatchEvent:function(b){var c=a.Event(b+".countdown");c.finalDate=this.finalDate,c.elapsed=this.elapsed,c.offset=a.extend({},this.offset),c.strftime=d(this.offset),this.$el.trigger(c)}}),a.fn.countdown=function(){var b=Array.prototype.slice.call(arguments,0);return this.each(function(){var c=a(this).data("countdown-instance");if(void 0!==c){var d=f[c],e=b[0];j.prototype.hasOwnProperty(e)?d[e].apply(d,b.slice(1)):null===String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i)?(d.setFinalDate.call(d,e),d.start()):a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi,e))}else new j(this,b[0],b[1])})}});
(function ($) {
	$(document).on('ready', function(){					
		$('.countdown-slider .slider .product-countdown').each(function(event){
			$this = $(this);
			$id = this.id;			
			$current_time 	= new Date().getTime();
			$start_time 	= $(this).data('starttime');
			$countdown_time = $(this).data('cdtime');
			var $austDay 	= new Date();
			$austDay 		= new Date( $countdown_time * 1000 );	
			//console.log( $austDay );
			if( $start_time > $current_time  ){
				$this.remove();
				return ;
			}
			if( $countdown_time.length > 0 && $current_time > $countdown_time ){
				$this.remove();
				return ;
			}
			if( $countdown_time.length <= 0 ){
				$this.remove();
				return ;
			}
			$this.countdown($austDay, function(event) {
				$(this).html(
					event.strftime('<span class="countdown-row countdown-show4"><span class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-period">Days</span></span><span class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-period">Hours</span></span><span class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-period">Mins</span></span><span class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-period">Secs</span></span></span>')
				);
			}).on('finish.countdown', function(event){
				$(this).remove();
				$id = $(this).data( 'id' );
				$target = this;
				$(this).hide('slow', function(){ $(this).remove(); });	
				$price = $(this).data( 'price' );
				$('#' + $id + ' .item-price > span').hide('slow', function(){ $('#' + $id + ' .item-price > span').remove(); });					
				$('#' + $id + ' .item-price' ).append( '<span><span class="amount">' + $price + '</span></span>' );
			});
		});	
	});
})(jQuery);
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/jquery.fancybox.pack.js 
/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
(function(r,G,f,v){var J=f("html"),n=f(r),p=f(G),b=f.fancybox=function(){b.open.apply(this,arguments)},I=navigator.userAgent.match(/msie/i),B=null,s=G.createTouch!==v,t=function(a){return a&&a.hasOwnProperty&&a instanceof f},q=function(a){return a&&"string"===f.type(a)},E=function(a){return q(a)&&0<a.indexOf("%")},l=function(a,d){var e=parseInt(a,10)||0;d&&E(a)&&(e*=b.getViewport()[d]/100);return Math.ceil(e)},w=function(a,b){return l(a,b)+"px"};f.extend(b,{version:"2.1.5",defaults:{padding:15,margin:20,
width:900,height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,pixelRatio:1,autoSize:!0,autoHeight:!1,autoWidth:!1,autoResize:!0,autoCenter:!s,fitToView:!0,aspectRatio:!1,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:!0,closeBtn:!0,closeClick:!1,nextClick:!1,mouseWheel:!0,autoPlay:!1,playSpeed:3E3,preload:3,modal:!1,loop:!0,ajax:{dataType:"html",headers:{"X-fancyBox":!0}},iframe:{scrolling:"auto",preload:!0},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},
keys:{next:{13:"left",34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:!0,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+
(I?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:!0,
openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:!0,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:!0,title:!0},onCancel:f.noop,beforeLoad:f.noop,afterLoad:f.noop,beforeShow:f.noop,afterShow:f.noop,beforeChange:f.noop,beforeClose:f.noop,afterClose:f.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:!1,
isOpen:!1,isOpened:!1,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:!1},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(a,d){if(a&&(f.isPlainObject(d)||(d={}),!1!==b.close(!0)))return f.isArray(a)||(a=t(a)?f(a).get():[a]),f.each(a,function(e,c){var k={},g,h,j,m,l;"object"===f.type(c)&&(c.nodeType&&(c=f(c)),t(c)?(k={href:c.data("fancybox-href")||c.attr("href"),title:c.data("fancybox-title")||c.attr("title"),isDom:!0,element:c},f.metadata&&f.extend(!0,k,
c.metadata())):k=c);g=d.href||k.href||(q(c)?c:null);h=d.title!==v?d.title:k.title||"";m=(j=d.content||k.content)?"html":d.type||k.type;!m&&k.isDom&&(m=c.data("fancybox-type"),m||(m=(m=c.prop("class").match(/fancybox\.(\w+)/))?m[1]:null));q(g)&&(m||(b.isImage(g)?m="image":b.isSWF(g)?m="swf":"#"===g.charAt(0)?m="inline":q(c)&&(m="html",j=c)),"ajax"===m&&(l=g.split(/\s+/,2),g=l.shift(),l=l.shift()));j||("inline"===m?g?j=f(q(g)?g.replace(/.*(?=#[^\s]+$)/,""):g):k.isDom&&(j=c):"html"===m?j=g:!m&&(!g&&
k.isDom)&&(m="inline",j=c));f.extend(k,{href:g,type:m,content:j,title:h,selector:l});a[e]=k}),b.opts=f.extend(!0,{},b.defaults,d),d.keys!==v&&(b.opts.keys=d.keys?f.extend({},b.defaults.keys,d.keys):!1),b.group=a,b._start(b.opts.index)},cancel:function(){var a=b.coming;a&&!1!==b.trigger("onCancel")&&(b.hideLoading(),b.ajaxLoad&&b.ajaxLoad.abort(),b.ajaxLoad=null,b.imgPreload&&(b.imgPreload.onload=b.imgPreload.onerror=null),a.wrap&&a.wrap.stop(!0,!0).trigger("onReset").remove(),b.coming=null,b.current||
b._afterZoomOut(a))},close:function(a){b.cancel();!1!==b.trigger("beforeClose")&&(b.unbindEvents(),b.isActive&&(!b.isOpen||!0===a?(f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),b._afterZoomOut()):(b.isOpen=b.isOpened=!1,b.isClosing=!0,f(".fancybox-item, .fancybox-nav").remove(),b.wrap.stop(!0,!0).removeClass("fancybox-opened"),b.transitions[b.current.closeMethod]())))},play:function(a){var d=function(){clearTimeout(b.player.timer)},e=function(){d();b.current&&b.player.isActive&&(b.player.timer=
setTimeout(b.next,b.current.playSpeed))},c=function(){d();p.unbind(".player");b.player.isActive=!1;b.trigger("onPlayEnd")};if(!0===a||!b.player.isActive&&!1!==a){if(b.current&&(b.current.loop||b.current.index<b.group.length-1))b.player.isActive=!0,p.bind({"onCancel.player beforeClose.player":c,"onUpdate.player":e,"beforeLoad.player":d}),e(),b.trigger("onPlayStart")}else c()},next:function(a){var d=b.current;d&&(q(a)||(a=d.direction.next),b.jumpto(d.index+1,a,"next"))},prev:function(a){var d=b.current;
d&&(q(a)||(a=d.direction.prev),b.jumpto(d.index-1,a,"prev"))},jumpto:function(a,d,e){var c=b.current;c&&(a=l(a),b.direction=d||c.direction[a>=c.index?"next":"prev"],b.router=e||"jumpto",c.loop&&(0>a&&(a=c.group.length+a%c.group.length),a%=c.group.length),c.group[a]!==v&&(b.cancel(),b._start(a)))},reposition:function(a,d){var e=b.current,c=e?e.wrap:null,k;c&&(k=b._getPosition(d),a&&"scroll"===a.type?(delete k.position,c.stop(!0,!0).animate(k,200)):(c.css(k),e.pos=f.extend({},e.dim,k)))},update:function(a){var d=
a&&a.type,e=!d||"orientationchange"===d;e&&(clearTimeout(B),B=null);b.isOpen&&!B&&(B=setTimeout(function(){var c=b.current;c&&!b.isClosing&&(b.wrap.removeClass("fancybox-tmp"),(e||"load"===d||"resize"===d&&c.autoResize)&&b._setDimension(),"scroll"===d&&c.canShrink||b.reposition(a),b.trigger("onUpdate"),B=null)},e&&!s?0:300))},toggle:function(a){b.isOpen&&(b.current.fitToView="boolean"===f.type(a)?a:!b.current.fitToView,s&&(b.wrap.removeAttr("style").addClass("fancybox-tmp"),b.trigger("onUpdate")),
b.update())},hideLoading:function(){p.unbind(".loading");f("#fancybox-loading").remove()},showLoading:function(){var a,d;b.hideLoading();a=f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");p.bind("keydown.loading",function(a){if(27===(a.which||a.keyCode))a.preventDefault(),b.cancel()});b.defaults.fixed||(d=b.getViewport(),a.css({position:"absolute",top:0.5*d.h+d.y,left:0.5*d.w+d.x}))},getViewport:function(){var a=b.current&&b.current.locked||!1,d={x:n.scrollLeft(),
y:n.scrollTop()};a?(d.w=a[0].clientWidth,d.h=a[0].clientHeight):(d.w=s&&r.innerWidth?r.innerWidth:n.width(),d.h=s&&r.innerHeight?r.innerHeight:n.height());return d},unbindEvents:function(){b.wrap&&t(b.wrap)&&b.wrap.unbind(".fb");p.unbind(".fb");n.unbind(".fb")},bindEvents:function(){var a=b.current,d;a&&(n.bind("orientationchange.fb"+(s?"":" resize.fb")+(a.autoCenter&&!a.locked?" scroll.fb":""),b.update),(d=a.keys)&&p.bind("keydown.fb",function(e){var c=e.which||e.keyCode,k=e.target||e.srcElement;
if(27===c&&b.coming)return!1;!e.ctrlKey&&(!e.altKey&&!e.shiftKey&&!e.metaKey&&(!k||!k.type&&!f(k).is("[contenteditable]")))&&f.each(d,function(d,k){if(1<a.group.length&&k[c]!==v)return b[d](k[c]),e.preventDefault(),!1;if(-1<f.inArray(c,k))return b[d](),e.preventDefault(),!1})}),f.fn.mousewheel&&a.mouseWheel&&b.wrap.bind("mousewheel.fb",function(d,c,k,g){for(var h=f(d.target||null),j=!1;h.length&&!j&&!h.is(".fancybox-skin")&&!h.is(".fancybox-wrap");)j=h[0]&&!(h[0].style.overflow&&"hidden"===h[0].style.overflow)&&
(h[0].clientWidth&&h[0].scrollWidth>h[0].clientWidth||h[0].clientHeight&&h[0].scrollHeight>h[0].clientHeight),h=f(h).parent();if(0!==c&&!j&&1<b.group.length&&!a.canShrink){if(0<g||0<k)b.prev(0<g?"down":"left");else if(0>g||0>k)b.next(0>g?"up":"right");d.preventDefault()}}))},trigger:function(a,d){var e,c=d||b.coming||b.current;if(c){f.isFunction(c[a])&&(e=c[a].apply(c,Array.prototype.slice.call(arguments,1)));if(!1===e)return!1;c.helpers&&f.each(c.helpers,function(d,e){if(e&&b.helpers[d]&&f.isFunction(b.helpers[d][a]))b.helpers[d][a](f.extend(!0,
{},b.helpers[d].defaults,e),c)});p.trigger(a)}},isImage:function(a){return q(a)&&a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)},isSWF:function(a){return q(a)&&a.match(/\.(swf)((\?|#).*)?$/i)},_start:function(a){var d={},e,c;a=l(a);e=b.group[a]||null;if(!e)return!1;d=f.extend(!0,{},b.opts,e);e=d.margin;c=d.padding;"number"===f.type(e)&&(d.margin=[e,e,e,e]);"number"===f.type(c)&&(d.padding=[c,c,c,c]);d.modal&&f.extend(!0,d,{closeBtn:!1,closeClick:!1,nextClick:!1,arrows:!1,
mouseWheel:!1,keys:null,helpers:{overlay:{closeClick:!1}}});d.autoSize&&(d.autoWidth=d.autoHeight=!0);"auto"===d.width&&(d.autoWidth=!0);"auto"===d.height&&(d.autoHeight=!0);d.group=b.group;d.index=a;b.coming=d;if(!1===b.trigger("beforeLoad"))b.coming=null;else{c=d.type;e=d.href;if(!c)return b.coming=null,b.current&&b.router&&"jumpto"!==b.router?(b.current.index=a,b[b.router](b.direction)):!1;b.isActive=!0;if("image"===c||"swf"===c)d.autoHeight=d.autoWidth=!1,d.scrolling="visible";"image"===c&&(d.aspectRatio=
!0);"iframe"===c&&s&&(d.scrolling="scroll");d.wrap=f(d.tpl.wrap).addClass("fancybox-"+(s?"mobile":"desktop")+" fancybox-type-"+c+" fancybox-tmp "+d.wrapCSS).appendTo(d.parent||"body");f.extend(d,{skin:f(".fancybox-skin",d.wrap),outer:f(".fancybox-outer",d.wrap),inner:f(".fancybox-inner",d.wrap)});f.each(["Top","Right","Bottom","Left"],function(a,b){d.skin.css("padding"+b,w(d.padding[a]))});b.trigger("onReady");if("inline"===c||"html"===c){if(!d.content||!d.content.length)return b._error("content")}else if(!e)return b._error("href");
"image"===c?b._loadImage():"ajax"===c?b._loadAjax():"iframe"===c?b._loadIframe():b._afterLoad()}},_error:function(a){f.extend(b.coming,{type:"html",autoWidth:!0,autoHeight:!0,minWidth:0,minHeight:0,scrolling:"no",hasError:a,content:b.coming.tpl.error});b._afterLoad()},_loadImage:function(){var a=b.imgPreload=new Image;a.onload=function(){this.onload=this.onerror=null;b.coming.width=this.width/b.opts.pixelRatio;b.coming.height=this.height/b.opts.pixelRatio;b._afterLoad()};a.onerror=function(){this.onload=
this.onerror=null;b._error("image")};a.src=b.coming.href;!0!==a.complete&&b.showLoading()},_loadAjax:function(){var a=b.coming;b.showLoading();b.ajaxLoad=f.ajax(f.extend({},a.ajax,{url:a.href,error:function(a,e){b.coming&&"abort"!==e?b._error("ajax",a):b.hideLoading()},success:function(d,e){"success"===e&&(a.content=d,b._afterLoad())}}))},_loadIframe:function(){var a=b.coming,d=f(a.tpl.iframe.replace(/\{rnd\}/g,(new Date).getTime())).attr("scrolling",s?"auto":a.iframe.scrolling).attr("src",a.href);
f(a.wrap).bind("onReset",function(){try{f(this).find("iframe").hide().attr("src","//about:blank").end().empty()}catch(a){}});a.iframe.preload&&(b.showLoading(),d.one("load",function(){f(this).data("ready",1);s||f(this).bind("load.fb",b.update);f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();b._afterLoad()}));a.content=d.appendTo(a.inner);a.iframe.preload||b._afterLoad()},_preloadImages:function(){var a=b.group,d=b.current,e=a.length,c=d.preload?Math.min(d.preload,
e-1):0,f,g;for(g=1;g<=c;g+=1)f=a[(d.index+g)%e],"image"===f.type&&f.href&&((new Image).src=f.href)},_afterLoad:function(){var a=b.coming,d=b.current,e,c,k,g,h;b.hideLoading();if(a&&!1!==b.isActive)if(!1===b.trigger("afterLoad",a,d))a.wrap.stop(!0).trigger("onReset").remove(),b.coming=null;else{d&&(b.trigger("beforeChange",d),d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());b.unbindEvents();e=a.content;c=a.type;k=a.scrolling;f.extend(b,{wrap:a.wrap,skin:a.skin,
outer:a.outer,inner:a.inner,current:a,previous:d});g=a.href;switch(c){case "inline":case "ajax":case "html":a.selector?e=f("<div>").html(e).find(a.selector):t(e)&&(e.data("fancybox-placeholder")||e.data("fancybox-placeholder",f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()),e=e.show().detach(),a.wrap.bind("onReset",function(){f(this).find(e).length&&e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",!1)}));break;case "image":e=a.tpl.image.replace("{href}",
g);break;case "swf":e='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+g+'"></param>',h="",f.each(a.swf,function(a,b){e+='<param name="'+a+'" value="'+b+'"></param>';h+=" "+a+'="'+b+'"'}),e+='<embed src="'+g+'" type="application/x-shockwave-flash" width="100%" height="100%"'+h+"></embed></object>"}(!t(e)||!e.parent().is(a.inner))&&a.inner.append(e);b.trigger("beforeShow");a.inner.css("overflow","yes"===k?"scroll":
"no"===k?"hidden":k);b._setDimension();b.reposition();b.isOpen=!1;b.coming=null;b.bindEvents();if(b.isOpened){if(d.prevMethod)b.transitions[d.prevMethod]()}else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();b.transitions[b.isOpened?a.nextMethod:a.openMethod]();b._preloadImages()}},_setDimension:function(){var a=b.getViewport(),d=0,e=!1,c=!1,e=b.wrap,k=b.skin,g=b.inner,h=b.current,c=h.width,j=h.height,m=h.minWidth,u=h.minHeight,n=h.maxWidth,p=h.maxHeight,s=h.scrolling,q=h.scrollOutside?
h.scrollbarWidth:0,x=h.margin,y=l(x[1]+x[3]),r=l(x[0]+x[2]),v,z,t,C,A,F,B,D,H;e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");x=l(k.outerWidth(!0)-k.width());v=l(k.outerHeight(!0)-k.height());z=y+x;t=r+v;C=E(c)?(a.w-z)*l(c)/100:c;A=E(j)?(a.h-t)*l(j)/100:j;if("iframe"===h.type){if(H=h.content,h.autoHeight&&1===H.data("ready"))try{H[0].contentWindow.document.location&&(g.width(C).height(9999),F=H.contents().find("body"),q&&F.css("overflow-x","hidden"),A=F.outerHeight(!0))}catch(G){}}else if(h.autoWidth||
h.autoHeight)g.addClass("fancybox-tmp"),h.autoWidth||g.width(C),h.autoHeight||g.height(A),h.autoWidth&&(C=g.width()),h.autoHeight&&(A=g.height()),g.removeClass("fancybox-tmp");c=l(C);j=l(A);D=C/A;m=l(E(m)?l(m,"w")-z:m);n=l(E(n)?l(n,"w")-z:n);u=l(E(u)?l(u,"h")-t:u);p=l(E(p)?l(p,"h")-t:p);F=n;B=p;h.fitToView&&(n=Math.min(a.w-z,n),p=Math.min(a.h-t,p));z=a.w-y;r=a.h-r;h.aspectRatio?(c>n&&(c=n,j=l(c/D)),j>p&&(j=p,c=l(j*D)),c<m&&(c=m,j=l(c/D)),j<u&&(j=u,c=l(j*D))):(c=Math.max(m,Math.min(c,n)),h.autoHeight&&
"iframe"!==h.type&&(g.width(c),j=g.height()),j=Math.max(u,Math.min(j,p)));if(h.fitToView)if(g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height(),h.aspectRatio)for(;(a>z||y>r)&&(c>m&&j>u)&&!(19<d++);)j=Math.max(u,Math.min(p,j-10)),c=l(j*D),c<m&&(c=m,j=l(c/D)),c>n&&(c=n,j=l(c/D)),g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height();else c=Math.max(m,Math.min(c,c-(a-z))),j=Math.max(u,Math.min(j,j-(y-r)));q&&("auto"===s&&j<A&&c+x+q<z)&&(c+=q);g.width(c).height(j);e.width(c+x);a=e.width();
y=e.height();e=(a>z||y>r)&&c>m&&j>u;c=h.aspectRatio?c<F&&j<B&&c<C&&j<A:(c<F||j<B)&&(c<C||j<A);f.extend(h,{dim:{width:w(a),height:w(y)},origWidth:C,origHeight:A,canShrink:e,canExpand:c,wPadding:x,hPadding:v,wrapSpace:y-k.outerHeight(!0),skinSpace:k.height()-j});!H&&(h.autoHeight&&j>u&&j<p&&!c)&&g.height("auto")},_getPosition:function(a){var d=b.current,e=b.getViewport(),c=d.margin,f=b.wrap.width()+c[1]+c[3],g=b.wrap.height()+c[0]+c[2],c={position:"absolute",top:c[0],left:c[3]};d.autoCenter&&d.fixed&&
!a&&g<=e.h&&f<=e.w?c.position="fixed":d.locked||(c.top+=e.y,c.left+=e.x);c.top=w(Math.max(c.top,c.top+(e.h-g)*d.topRatio));c.left=w(Math.max(c.left,c.left+(e.w-f)*d.leftRatio));return c},_afterZoomIn:function(){var a=b.current;a&&(b.isOpen=b.isOpened=!0,b.wrap.css("overflow","visible").addClass("fancybox-opened"),b.update(),(a.closeClick||a.nextClick&&1<b.group.length)&&b.inner.css("cursor","pointer").bind("click.fb",function(d){!f(d.target).is("a")&&!f(d.target).parent().is("a")&&(d.preventDefault(),
b[a.closeClick?"close":"next"]())}),a.closeBtn&&f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb",function(a){a.preventDefault();b.close()}),a.arrows&&1<b.group.length&&((a.loop||0<a.index)&&f(a.tpl.prev).appendTo(b.outer).bind("click.fb",b.prev),(a.loop||a.index<b.group.length-1)&&f(a.tpl.next).appendTo(b.outer).bind("click.fb",b.next)),b.trigger("afterShow"),!a.loop&&a.index===a.group.length-1?b.play(!1):b.opts.autoPlay&&!b.player.isActive&&(b.opts.autoPlay=!1,b.play()))},_afterZoomOut:function(a){a=
a||b.current;f(".fancybox-wrap").trigger("onReset").remove();f.extend(b,{group:{},opts:{},router:!1,current:null,isActive:!1,isOpened:!1,isOpen:!1,isClosing:!1,wrap:null,skin:null,outer:null,inner:null});b.trigger("afterClose",a)}});b.transitions={getOrigPosition:function(){var a=b.current,d=a.element,e=a.orig,c={},f=50,g=50,h=a.hPadding,j=a.wPadding,m=b.getViewport();!e&&(a.isDom&&d.is(":visible"))&&(e=d.find("img:first"),e.length||(e=d));t(e)?(c=e.offset(),e.is("img")&&(f=e.outerWidth(),g=e.outerHeight())):
(c.top=m.y+(m.h-g)*a.topRatio,c.left=m.x+(m.w-f)*a.leftRatio);if("fixed"===b.wrap.css("position")||a.locked)c.top-=m.y,c.left-=m.x;return c={top:w(c.top-h*a.topRatio),left:w(c.left-j*a.leftRatio),width:w(f+j),height:w(g+h)}},step:function(a,d){var e,c,f=d.prop;c=b.current;var g=c.wrapSpace,h=c.skinSpace;if("width"===f||"height"===f)e=d.end===d.start?1:(a-d.start)/(d.end-d.start),b.isClosing&&(e=1-e),c="width"===f?c.wPadding:c.hPadding,c=a-c,b.skin[f](l("width"===f?c:c-g*e)),b.inner[f](l("width"===
f?c:c-g*e-h*e))},zoomIn:function(){var a=b.current,d=a.pos,e=a.openEffect,c="elastic"===e,k=f.extend({opacity:1},d);delete k.position;c?(d=this.getOrigPosition(),a.openOpacity&&(d.opacity=0.1)):"fade"===e&&(d.opacity=0.1);b.wrap.css(d).animate(k,{duration:"none"===e?0:a.openSpeed,easing:a.openEasing,step:c?this.step:null,complete:b._afterZoomIn})},zoomOut:function(){var a=b.current,d=a.closeEffect,e="elastic"===d,c={opacity:0.1};e&&(c=this.getOrigPosition(),a.closeOpacity&&(c.opacity=0.1));b.wrap.animate(c,
{duration:"none"===d?0:a.closeSpeed,easing:a.closeEasing,step:e?this.step:null,complete:b._afterZoomOut})},changeIn:function(){var a=b.current,d=a.nextEffect,e=a.pos,c={opacity:1},f=b.direction,g;e.opacity=0.1;"elastic"===d&&(g="down"===f||"up"===f?"top":"left","down"===f||"right"===f?(e[g]=w(l(e[g])-200),c[g]="+=200px"):(e[g]=w(l(e[g])+200),c[g]="-=200px"));"none"===d?b._afterZoomIn():b.wrap.css(e).animate(c,{duration:a.nextSpeed,easing:a.nextEasing,complete:b._afterZoomIn})},changeOut:function(){var a=
b.previous,d=a.prevEffect,e={opacity:0.1},c=b.direction;"elastic"===d&&(e["down"===c||"up"===c?"top":"left"]=("up"===c||"left"===c?"-":"+")+"=200px");a.wrap.animate(e,{duration:"none"===d?0:a.prevSpeed,easing:a.prevEasing,complete:function(){f(this).trigger("onReset").remove()}})}};b.helpers.overlay={defaults:{closeClick:!0,speedOut:200,showEarly:!0,css:{},locked:!s,fixed:!0},overlay:null,fixed:!1,el:f("html"),create:function(a){a=f.extend({},this.defaults,a);this.overlay&&this.close();this.overlay=
f('<div class="fancybox-overlay"></div>').appendTo(b.coming?b.coming.parent:a.parent);this.fixed=!1;a.fixed&&b.defaults.fixed&&(this.overlay.addClass("fancybox-overlay-fixed"),this.fixed=!0)},open:function(a){var d=this;a=f.extend({},this.defaults,a);this.overlay?this.overlay.unbind(".overlay").width("auto").height("auto"):this.create(a);this.fixed||(n.bind("resize.overlay",f.proxy(this.update,this)),this.update());a.closeClick&&this.overlay.bind("click.overlay",function(a){if(f(a.target).hasClass("fancybox-overlay"))return b.isActive?
b.close():d.close(),!1});this.overlay.css(a.css).show()},close:function(){var a,b;n.unbind("resize.overlay");this.el.hasClass("fancybox-lock")&&(f(".fancybox-margin").removeClass("fancybox-margin"),a=n.scrollTop(),b=n.scrollLeft(),this.el.removeClass("fancybox-lock"),n.scrollTop(a).scrollLeft(b));f(".fancybox-overlay").remove().hide();f.extend(this,{overlay:null,fixed:!1})},update:function(){var a="100%",b;this.overlay.width(a).height("100%");I?(b=Math.max(G.documentElement.offsetWidth,G.body.offsetWidth),
p.width()>b&&(a=p.width())):p.width()>n.width()&&(a=p.width());this.overlay.width(a).height(p.height())},onReady:function(a,b){var e=this.overlay;f(".fancybox-overlay").stop(!0,!0);e||this.create(a);a.locked&&(this.fixed&&b.fixed)&&(e||(this.margin=p.height()>n.height()?f("html").css("margin-right").replace("px",""):!1),b.locked=this.overlay.append(b.wrap),b.fixed=!1);!0===a.showEarly&&this.beforeShow.apply(this,arguments)},beforeShow:function(a,b){var e,c;b.locked&&(!1!==this.margin&&(f("*").filter(function(){return"fixed"===
f(this).css("position")&&!f(this).hasClass("fancybox-overlay")&&!f(this).hasClass("fancybox-wrap")}).addClass("fancybox-margin"),this.el.addClass("fancybox-margin")),e=n.scrollTop(),c=n.scrollLeft(),this.el.addClass("fancybox-lock"),n.scrollTop(e).scrollLeft(c));this.open(a)},onUpdate:function(){this.fixed||this.update()},afterClose:function(a){this.overlay&&!b.coming&&this.overlay.fadeOut(a.speedOut,f.proxy(this.close,this))}};b.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(a){var d=
b.current,e=d.title,c=a.type;f.isFunction(e)&&(e=e.call(d.element,d));if(q(e)&&""!==f.trim(e)){d=f('<div class="fancybox-title fancybox-title-'+c+'-wrap">'+e+"</div>");switch(c){case "inside":c=b.skin;break;case "outside":c=b.wrap;break;case "over":c=b.inner;break;default:c=b.skin,d.appendTo("body"),I&&d.width(d.width()),d.wrapInner('<span class="child"></span>'),b.current.margin[2]+=Math.abs(l(d.css("margin-bottom")))}d["top"===a.position?"prependTo":"appendTo"](c)}}};f.fn.fancybox=function(a){var d,
e=f(this),c=this.selector||"",k=function(g){var h=f(this).blur(),j=d,k,l;!g.ctrlKey&&(!g.altKey&&!g.shiftKey&&!g.metaKey)&&!h.is(".fancybox-wrap")&&(k=a.groupAttr||"data-fancybox-group",l=h.attr(k),l||(k="rel",l=h.get(0)[k]),l&&(""!==l&&"nofollow"!==l)&&(h=c.length?f(c):e,h=h.filter("["+k+'="'+l+'"]'),j=h.index(this)),a.index=j,!1!==b.open(h,a)&&g.preventDefault())};a=a||{};d=a.index||0;!c||!1===a.live?e.unbind("click.fb-start").bind("click.fb-start",k):p.undelegate(c,"click.fb-start").delegate(c+
":not('.fancybox-item, .fancybox-nav')","click.fb-start",k);this.filter("[data-fancybox-start=1]").trigger("click");return this};p.ready(function(){var a,d;f.scrollbarWidth===v&&(f.scrollbarWidth=function(){var a=f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),b=b.innerWidth()-b.height(99).innerWidth();a.remove();return b});if(f.support.fixedPosition===v){a=f.support;d=f('<div style="position:fixed;top:20px;"></div>').appendTo("body");var e=20===
d[0].offsetTop||15===d[0].offsetTop;d.remove();a.fixedPosition=e}f.extend(b.defaults,{scrollbarWidth:f.scrollbarWidth(),fixed:f.support.fixedPosition,parent:f("body")});a=f(r).width();J.addClass("fancybox-lock-test");d=f(r).width();J.removeClass("fancybox-lock-test");f("<style type='text/css'>.fancybox-margin{margin-right:"+(d-a)+"px;}</style>").appendTo("head")})})(window,document,jQuery);
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/jquery.circliful.min.js 
(function(a){a.fn.circliful=function(b){var c=a.extend({fgcolor:"#556b2f",bgcolor:"#eee",fill:false,width:15,dimension:200,fontsize:15,percent:50,animationstep:1,iconsize:"20px",iconcolor:"#999",border:"default"},b);return this.each(function(){var u=["fgcolor","bgcolor","fill","width","dimension","fontsize","animationstep","endPercent","icon","iconcolor","iconsize","border"];var e={};var D="";var l=0;var r=a(this);var w=false;var t,E;r.addClass("circliful");d(r);if(r.data("text")!=undefined){t=r.data("text");if(r.data("icon")!=undefined){D=a("<i></i>").addClass("fa "+a(this).data("icon")).css({color:e.iconcolor,"font-size":e.iconsize})}if(r.data("type")!=undefined){i=a(this).data("type");if(i=="half"){q(r,"circle-text-half",(e.dimension/1.45))}else{q(r,"circle-text",e.dimension)}}else{q(r,"circle-text",e.dimension)}}if(a(this).data("total")!=undefined&&a(this).data("part")!=undefined){var G=a(this).data("total")/100;percent=((a(this).data("part")/G)/100).toFixed(3);l=(a(this).data("part")/G).toFixed(3)}else{if(a(this).data("percent")!=undefined){percent=a(this).data("percent")/100;l=a(this).data("percent")}else{percent=c.percent/100}}if(a(this).data("info")!=undefined){E=a(this).data("info");if(a(this).data("type")!=undefined){i=a(this).data("type");if(i=="half"){B(r,0.9)}else{B(r,1.25)}}else{B(r,1.25)}}a(this).width(e.dimension+"px");var h=a("<canvas></canvas>").attr({width:e.dimension,height:e.dimension}).appendTo(a(this)).get(0);var f=h.getContext("2d");var p=h.width/2;var o=h.height/2;var A=e.percent*360;var F=A*(Math.PI/180);var j=h.width/2.5;var z=2.3*Math.PI;var v=0;var C=false;var m=e.animationstep===0?l:0;var n=Math.max(e.animationstep,0);var s=Math.PI*2;var g=Math.PI/2;var i="";if(a(this).data("type")!=undefined){i=a(this).data("type");if(i=="half"){var z=2*Math.PI;var v=3.13;var s=Math.PI*1;var g=Math.PI/0.996}}function q(H,x,y){a("<span></span>").appendTo(H).addClass(x).text(t).prepend(D).css({"line-height":y+"px","font-size":e.fontsize+"px"})}function B(y,x){a("<span></span>").appendTo(y).addClass("circle-info-half").css("line-height",(e.dimension*x)+"px")}function d(x){a.each(u,function(y,H){if(x.data(H)!=undefined){e[H]=x.data(H)}else{e[H]=a(c).attr(H)}if(H=="fill"&&x.data("fill")!=undefined){w=true}})}function k(x){f.clearRect(0,0,h.width,h.height);f.beginPath();f.arc(p,o,j,v,z,false);f.lineWidth=e.width+1;f.strokeStyle=e.bgcolor;f.stroke();if(w){f.fillStyle=e.fill;f.fill()}f.beginPath();f.arc(p,o,j,-(g),((s)*x)-g,false);if(e.border=="outline"){f.lineWidth=e.width+13}else{if(e.border=="inline"){f.lineWidth=e.width-13}}f.strokeStyle=e.fgcolor;f.stroke();if(m<l){m+=n;requestAnimationFrame(function(){k(Math.min(m,l)/100)},r)}}k(m/100)})}}(jQuery));
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/jquery.counterup.js 
/*!
* jquery.counterup.js 1.0
*
* Copyright 2013, Benjamin Intal http://gambit.ph @bfintal
* Released under the GPL v2 License
*
* Date: Nov 26, 2013
*/
(function( $ ){
  "use strict";

  $.fn.counterUp = function( options ) {

    // Defaults
    var settings = $.extend({
        'time': 400,
        'delay': 10
    }, options);

    return this.each(function(){

        // Store the object
        var $this = $(this);
        var $settings = settings;

        var counterUpper = function() {
            var nums = [];
            var divisions = $settings.time / $settings.delay;
            var num = $this.text();
            var isComma = /[0-9]+,[0-9]+/.test(num);
            num = num.replace(/,/g, '');
            var isInt = /^[0-9]+$/.test(num);
            var isFloat = /^[0-9]+\.[0-9]+$/.test(num);
            var decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;

            // Generate list of incremental numbers to display
            for (var i = divisions; i >= 1; i--) {

                // Preserve as int if input was int
                var newNum = parseInt(num / divisions * i);

                // Preserve float if input was float
                if (isFloat) {
                    newNum = parseFloat(num / divisions * i).toFixed(decimalPlaces);
                }

                // Preserve commas if input had commas
                if (isComma) {
                    while (/(\d+)(\d{3})/.test(newNum.toString())) {
                        newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
                    }
                }

                nums.unshift(newNum);
            }

            $this.data('counterup-nums', nums);
            $this.text('0');

            // Updates the number until we're done
            var f = function() {
                $this.text($this.data('counterup-nums').shift());
                if ($this.data('counterup-nums').length) {
                    setTimeout($this.data('counterup-func'), $settings.delay);
                } else {
                    delete $this.data('counterup-nums');
                    $this.data('counterup-nums', null);
                    $this.data('counterup-func', null);
                }
            };
            $this.data('counterup-func', f);

            // Start the count up
            setTimeout($this.data('counterup-func'), $settings.delay);
        };

        // Perform counts when the element gets into view
        $this.waypoint(counterUpper, { offset: '100%', triggerOnce: true });
    });

  };

})( jQuery );
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/jquery.flexslider-min.js 
/*
 * jQuery FlexSlider v2.4.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */!function($){$.flexslider=function(e,t){var a=$(e);a.vars=$.extend({},$.flexslider.defaults,t);var n=a.vars.namespace,i=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,s=("ontouchstart"in window||i||window.DocumentTouch&&document instanceof DocumentTouch)&&a.vars.touch,r="click touchend MSPointerUp keyup",o="",l,c="vertical"===a.vars.direction,d=a.vars.reverse,u=a.vars.itemWidth>0,v="fade"===a.vars.animation,p=""!==a.vars.asNavFor,m={},f=!0;$.data(e,"flexslider",a),m={init:function(){a.animating=!1,a.currentSlide=parseInt(a.vars.startAt?a.vars.startAt:0,10),isNaN(a.currentSlide)&&(a.currentSlide=0),a.animatingTo=a.currentSlide,a.atEnd=0===a.currentSlide||a.currentSlide===a.last,a.containerSelector=a.vars.selector.substr(0,a.vars.selector.search(" ")),a.slides=$(a.vars.selector,a),a.container=$(a.containerSelector,a),a.count=a.slides.length,a.syncExists=$(a.vars.sync).length>0,"slide"===a.vars.animation&&(a.vars.animation="swing"),a.prop=c?"top":"marginLeft",a.args={},a.manualPause=!1,a.stopped=!1,a.started=!1,a.startTimeout=null,a.transitions=!a.vars.video&&!v&&a.vars.useCSS&&function(){var e=document.createElement("div"),t=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in t)if(void 0!==e.style[t[n]])return a.pfx=t[n].replace("Perspective","").toLowerCase(),a.prop="-"+a.pfx+"-transform",!0;return!1}(),a.ensureAnimationEnd="",""!==a.vars.controlsContainer&&(a.controlsContainer=$(a.vars.controlsContainer).length>0&&$(a.vars.controlsContainer)),""!==a.vars.manualControls&&(a.manualControls=$(a.vars.manualControls).length>0&&$(a.vars.manualControls)),a.vars.randomize&&(a.slides.sort(function(){return Math.round(Math.random())-.5}),a.container.empty().append(a.slides)),a.doMath(),a.setup("init"),a.vars.controlNav&&m.controlNav.setup(),a.vars.directionNav&&m.directionNav.setup(),a.vars.keyboard&&(1===$(a.containerSelector).length||a.vars.multipleKeyboard)&&$(document).bind("keyup",function(e){var t=e.keyCode;if(!a.animating&&(39===t||37===t)){var n=39===t?a.getTarget("next"):37===t?a.getTarget("prev"):!1;a.flexAnimate(n,a.vars.pauseOnAction)}}),a.vars.mousewheel&&a.bind("mousewheel",function(e,t,n,i){e.preventDefault();var s=a.getTarget(0>t?"next":"prev");a.flexAnimate(s,a.vars.pauseOnAction)}),a.vars.pausePlay&&m.pausePlay.setup(),a.vars.slideshow&&a.vars.pauseInvisible&&m.pauseInvisible.init(),a.vars.slideshow&&(a.vars.pauseOnHover&&a.hover(function(){a.manualPlay||a.manualPause||a.pause()},function(){a.manualPause||a.manualPlay||a.stopped||a.play()}),a.vars.pauseInvisible&&m.pauseInvisible.isHidden()||(a.vars.initDelay>0?a.startTimeout=setTimeout(a.play,a.vars.initDelay):a.play())),p&&m.asNav.setup(),s&&a.vars.touch&&m.touch(),(!v||v&&a.vars.smoothHeight)&&$(window).bind("resize orientationchange focus",m.resize),a.find("img").attr("draggable","false"),setTimeout(function(){a.vars.start(a)},200)},asNav:{setup:function(){a.asNav=!0,a.animatingTo=Math.floor(a.currentSlide/a.move),a.currentItem=a.currentSlide,a.slides.removeClass(n+"active-slide").eq(a.currentItem).addClass(n+"active-slide"),i?(e._slider=a,a.slides.each(function(){var e=this;e._gesture=new MSGesture,e._gesture.target=e,e.addEventListener("MSPointerDown",function(e){e.preventDefault(),e.currentTarget._gesture&&e.currentTarget._gesture.addPointer(e.pointerId)},!1),e.addEventListener("MSGestureTap",function(e){e.preventDefault();var t=$(this),n=t.index();$(a.vars.asNavFor).data("flexslider").animating||t.hasClass("active")||(a.direction=a.currentItem<n?"next":"prev",a.flexAnimate(n,a.vars.pauseOnAction,!1,!0,!0))})})):a.slides.on(r,function(e){e.preventDefault();var t=$(this),i=t.index(),s=t.offset().left-$(a).scrollLeft();0>=s&&t.hasClass(n+"active-slide")?a.flexAnimate(a.getTarget("prev"),!0):$(a.vars.asNavFor).data("flexslider").animating||t.hasClass(n+"active-slide")||(a.direction=a.currentItem<i?"next":"prev",a.flexAnimate(i,a.vars.pauseOnAction,!1,!0,!0))})}},controlNav:{setup:function(){a.manualControls?m.controlNav.setupManual():m.controlNav.setupPaging()},setupPaging:function(){var e="thumbnails"===a.vars.controlNav?"control-thumbs":"control-paging",t=1,i,s;if(a.controlNavScaffold=$('<ol class="'+n+"control-nav "+n+e+'"></ol>'),a.pagingCount>1)for(var l=0;l<a.pagingCount;l++){if(s=a.slides.eq(l),i="thumbnails"===a.vars.controlNav?'<img src="'+s.attr("data-thumb")+'"/>':"<a>"+t+"</a>","thumbnails"===a.vars.controlNav&&!0===a.vars.thumbCaptions){var c=s.attr("data-thumbcaption");""!=c&&void 0!=c&&(i+='<span class="'+n+'caption">'+c+"</span>")}a.controlNavScaffold.append("<li>"+i+"</li>"),t++}a.controlsContainer?$(a.controlsContainer).append(a.controlNavScaffold):a.append(a.controlNavScaffold),m.controlNav.set(),m.controlNav.active(),a.controlNavScaffold.delegate("a, img",r,function(e){if(e.preventDefault(),""===o||o===e.type){var t=$(this),i=a.controlNav.index(t);t.hasClass(n+"active")||(a.direction=i>a.currentSlide?"next":"prev",a.flexAnimate(i,a.vars.pauseOnAction))}""===o&&(o=e.type),m.setToClearWatchedEvent()})},setupManual:function(){a.controlNav=a.manualControls,m.controlNav.active(),a.controlNav.bind(r,function(e){if(e.preventDefault(),""===o||o===e.type){var t=$(this),i=a.controlNav.index(t);t.hasClass(n+"active")||(a.direction=i>a.currentSlide?"next":"prev",a.flexAnimate(i,a.vars.pauseOnAction))}""===o&&(o=e.type),m.setToClearWatchedEvent()})},set:function(){var e="thumbnails"===a.vars.controlNav?"img":"a";a.controlNav=$("."+n+"control-nav li "+e,a.controlsContainer?a.controlsContainer:a)},active:function(){a.controlNav.removeClass(n+"active").eq(a.animatingTo).addClass(n+"active")},update:function(e,t){a.pagingCount>1&&"add"===e?a.controlNavScaffold.append($("<li><a>"+a.count+"</a></li>")):1===a.pagingCount?a.controlNavScaffold.find("li").remove():a.controlNav.eq(t).closest("li").remove(),m.controlNav.set(),a.pagingCount>1&&a.pagingCount!==a.controlNav.length?a.update(t,e):m.controlNav.active()}},directionNav:{setup:function(){var e=$('<ul class="'+n+'direction-nav"><li class="'+n+'nav-prev"><a class="'+n+'prev" href="#">'+a.vars.prevText+'</a></li><li class="'+n+'nav-next"><a class="'+n+'next" href="#">'+a.vars.nextText+"</a></li></ul>");a.controlsContainer?($(a.controlsContainer).append(e),a.directionNav=$("."+n+"direction-nav li a",a.controlsContainer)):(a.append(e),a.directionNav=$("."+n+"direction-nav li a",a)),m.directionNav.update(),a.directionNav.bind(r,function(e){e.preventDefault();var t;(""===o||o===e.type)&&(t=a.getTarget($(this).hasClass(n+"next")?"next":"prev"),a.flexAnimate(t,a.vars.pauseOnAction)),""===o&&(o=e.type),m.setToClearWatchedEvent()})},update:function(){var e=n+"disabled";1===a.pagingCount?a.directionNav.addClass(e).attr("tabindex","-1"):a.vars.animationLoop?a.directionNav.removeClass(e).removeAttr("tabindex"):0===a.animatingTo?a.directionNav.removeClass(e).filter("."+n+"prev").addClass(e).attr("tabindex","-1"):a.animatingTo===a.last?a.directionNav.removeClass(e).filter("."+n+"next").addClass(e).attr("tabindex","-1"):a.directionNav.removeClass(e).removeAttr("tabindex")}},pausePlay:{setup:function(){var e=$('<div class="'+n+'pauseplay"><a></a></div>');a.controlsContainer?(a.controlsContainer.append(e),a.pausePlay=$("."+n+"pauseplay a",a.controlsContainer)):(a.append(e),a.pausePlay=$("."+n+"pauseplay a",a)),m.pausePlay.update(a.vars.slideshow?n+"pause":n+"play"),a.pausePlay.bind(r,function(e){e.preventDefault(),(""===o||o===e.type)&&($(this).hasClass(n+"pause")?(a.manualPause=!0,a.manualPlay=!1,a.pause()):(a.manualPause=!1,a.manualPlay=!0,a.play())),""===o&&(o=e.type),m.setToClearWatchedEvent()})},update:function(e){"play"===e?a.pausePlay.removeClass(n+"pause").addClass(n+"play").html(a.vars.playText):a.pausePlay.removeClass(n+"play").addClass(n+"pause").html(a.vars.pauseText)}},touch:function(){function t(t){a.animating?t.preventDefault():(window.navigator.msPointerEnabled||1===t.touches.length)&&(a.pause(),g=c?a.h:a.w,S=Number(new Date),x=t.touches[0].pageX,b=t.touches[0].pageY,f=u&&d&&a.animatingTo===a.last?0:u&&d?a.limit-(a.itemW+a.vars.itemMargin)*a.move*a.animatingTo:u&&a.currentSlide===a.last?a.limit:u?(a.itemW+a.vars.itemMargin)*a.move*a.currentSlide:d?(a.last-a.currentSlide+a.cloneOffset)*g:(a.currentSlide+a.cloneOffset)*g,p=c?b:x,m=c?x:b,e.addEventListener("touchmove",n,!1),e.addEventListener("touchend",s,!1))}function n(e){x=e.touches[0].pageX,b=e.touches[0].pageY,h=c?p-b:p-x,y=c?Math.abs(h)<Math.abs(x-m):Math.abs(h)<Math.abs(b-m);var t=500;(!y||Number(new Date)-S>t)&&(e.preventDefault(),!v&&a.transitions&&(a.vars.animationLoop||(h/=0===a.currentSlide&&0>h||a.currentSlide===a.last&&h>0?Math.abs(h)/g+2:1),a.setProps(f+h,"setTouch")))}function s(t){if(e.removeEventListener("touchmove",n,!1),a.animatingTo===a.currentSlide&&!y&&null!==h){var i=d?-h:h,r=a.getTarget(i>0?"next":"prev");a.canAdvance(r)&&(Number(new Date)-S<550&&Math.abs(i)>50||Math.abs(i)>g/2)?a.flexAnimate(r,a.vars.pauseOnAction):v||a.flexAnimate(a.currentSlide,a.vars.pauseOnAction,!0)}e.removeEventListener("touchend",s,!1),p=null,m=null,h=null,f=null}function r(t){t.stopPropagation(),a.animating?t.preventDefault():(a.pause(),e._gesture.addPointer(t.pointerId),w=0,g=c?a.h:a.w,S=Number(new Date),f=u&&d&&a.animatingTo===a.last?0:u&&d?a.limit-(a.itemW+a.vars.itemMargin)*a.move*a.animatingTo:u&&a.currentSlide===a.last?a.limit:u?(a.itemW+a.vars.itemMargin)*a.move*a.currentSlide:d?(a.last-a.currentSlide+a.cloneOffset)*g:(a.currentSlide+a.cloneOffset)*g)}function o(t){t.stopPropagation();var a=t.target._slider;if(a){var n=-t.translationX,i=-t.translationY;return w+=c?i:n,h=w,y=c?Math.abs(w)<Math.abs(-n):Math.abs(w)<Math.abs(-i),t.detail===t.MSGESTURE_FLAG_INERTIA?void setImmediate(function(){e._gesture.stop()}):void((!y||Number(new Date)-S>500)&&(t.preventDefault(),!v&&a.transitions&&(a.vars.animationLoop||(h=w/(0===a.currentSlide&&0>w||a.currentSlide===a.last&&w>0?Math.abs(w)/g+2:1)),a.setProps(f+h,"setTouch"))))}}function l(e){e.stopPropagation();var t=e.target._slider;if(t){if(t.animatingTo===t.currentSlide&&!y&&null!==h){var a=d?-h:h,n=t.getTarget(a>0?"next":"prev");t.canAdvance(n)&&(Number(new Date)-S<550&&Math.abs(a)>50||Math.abs(a)>g/2)?t.flexAnimate(n,t.vars.pauseOnAction):v||t.flexAnimate(t.currentSlide,t.vars.pauseOnAction,!0)}p=null,m=null,h=null,f=null,w=0}}var p,m,f,g,h,S,y=!1,x=0,b=0,w=0;i?(e.style.msTouchAction="none",e._gesture=new MSGesture,e._gesture.target=e,e.addEventListener("MSPointerDown",r,!1),e._slider=a,e.addEventListener("MSGestureChange",o,!1),e.addEventListener("MSGestureEnd",l,!1)):e.addEventListener("touchstart",t,!1)},resize:function(){!a.animating&&a.is(":visible")&&(u||a.doMath(),v?m.smoothHeight():u?(a.slides.width(a.computedW),a.update(a.pagingCount),a.setProps()):c?(a.viewport.height(a.h),a.setProps(a.h,"setTotal")):(a.vars.smoothHeight&&m.smoothHeight(),a.newSlides.width(a.computedW),a.setProps(a.computedW,"setTotal")))},smoothHeight:function(e){if(!c||v){var t=v?a:a.viewport;e?t.animate({height:a.slides.eq(a.animatingTo).height()},e):t.height(a.slides.eq(a.animatingTo).height())}},sync:function(e){var t=$(a.vars.sync).data("flexslider"),n=a.animatingTo;switch(e){case"animate":t.flexAnimate(n,a.vars.pauseOnAction,!1,!0);break;case"play":t.playing||t.asNav||t.play();break;case"pause":t.pause()}},uniqueID:function(e){return e.filter("[id]").add(e.find("[id]")).each(function(){var e=$(this);e.attr("id",e.attr("id")+"_clone")}),e},pauseInvisible:{visProp:null,init:function(){var e=m.pauseInvisible.getHiddenProp();if(e){var t=e.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(t,function(){m.pauseInvisible.isHidden()?a.startTimeout?clearTimeout(a.startTimeout):a.pause():a.started?a.play():a.vars.initDelay>0?setTimeout(a.play,a.vars.initDelay):a.play()})}},isHidden:function(){var e=m.pauseInvisible.getHiddenProp();return e?document[e]:!1},getHiddenProp:function(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)if(e[t]+"Hidden"in document)return e[t]+"Hidden";return null}},setToClearWatchedEvent:function(){clearTimeout(l),l=setTimeout(function(){o=""},3e3)}},a.flexAnimate=function(e,t,i,r,o){if(a.vars.animationLoop||e===a.currentSlide||(a.direction=e>a.currentSlide?"next":"prev"),p&&1===a.pagingCount&&(a.direction=a.currentItem<e?"next":"prev"),!a.animating&&(a.canAdvance(e,o)||i)&&a.is(":visible")){if(p&&r){var l=$(a.vars.asNavFor).data("flexslider");if(a.atEnd=0===e||e===a.count-1,l.flexAnimate(e,!0,!1,!0,o),a.direction=a.currentItem<e?"next":"prev",l.direction=a.direction,Math.ceil((e+1)/a.visible)-1===a.currentSlide||0===e)return a.currentItem=e,a.slides.removeClass(n+"active-slide").eq(e).addClass(n+"active-slide"),!1;a.currentItem=e,a.slides.removeClass(n+"active-slide").eq(e).addClass(n+"active-slide"),e=Math.floor(e/a.visible)}if(a.animating=!0,a.animatingTo=e,t&&a.pause(),a.vars.before(a),a.syncExists&&!o&&m.sync("animate"),a.vars.controlNav&&m.controlNav.active(),u||a.slides.removeClass(n+"active-slide").eq(e).addClass(n+"active-slide"),a.atEnd=0===e||e===a.last,a.vars.directionNav&&m.directionNav.update(),e===a.last&&(a.vars.end(a),a.vars.animationLoop||a.pause()),v)s?(a.slides.eq(a.currentSlide).css({opacity:0,zIndex:1}),a.slides.eq(e).css({opacity:1,zIndex:2}),a.wrapup(f)):(a.slides.eq(a.currentSlide).css({zIndex:1}).animate({opacity:0},a.vars.animationSpeed,a.vars.easing),a.slides.eq(e).css({zIndex:2}).animate({opacity:1},a.vars.animationSpeed,a.vars.easing,a.wrapup));else{var f=c?a.slides.filter(":first").height():a.computedW,g,h,S;u?(g=a.vars.itemMargin,S=(a.itemW+g)*a.move*a.animatingTo,h=S>a.limit&&1!==a.visible?a.limit:S):h=0===a.currentSlide&&e===a.count-1&&a.vars.animationLoop&&"next"!==a.direction?d?(a.count+a.cloneOffset)*f:0:a.currentSlide===a.last&&0===e&&a.vars.animationLoop&&"prev"!==a.direction?d?0:(a.count+1)*f:d?(a.count-1-e+a.cloneOffset)*f:(e+a.cloneOffset)*f,a.setProps(h,"",a.vars.animationSpeed),a.transitions?(a.vars.animationLoop&&a.atEnd||(a.animating=!1,a.currentSlide=a.animatingTo),a.container.unbind("webkitTransitionEnd transitionend"),a.container.bind("webkitTransitionEnd transitionend",function(){clearTimeout(a.ensureAnimationEnd),a.wrapup(f)}),clearTimeout(a.ensureAnimationEnd),a.ensureAnimationEnd=setTimeout(function(){a.wrapup(f)},a.vars.animationSpeed+100)):a.container.animate(a.args,a.vars.animationSpeed,a.vars.easing,function(){a.wrapup(f)})}a.vars.smoothHeight&&m.smoothHeight(a.vars.animationSpeed)}},a.wrapup=function(e){v||u||(0===a.currentSlide&&a.animatingTo===a.last&&a.vars.animationLoop?a.setProps(e,"jumpEnd"):a.currentSlide===a.last&&0===a.animatingTo&&a.vars.animationLoop&&a.setProps(e,"jumpStart")),a.animating=!1,a.currentSlide=a.animatingTo,a.vars.after(a)},a.animateSlides=function(){!a.animating&&f&&a.flexAnimate(a.getTarget("next"))},a.pause=function(){clearInterval(a.animatedSlides),a.animatedSlides=null,a.playing=!1,a.vars.pausePlay&&m.pausePlay.update("play"),a.syncExists&&m.sync("pause")},a.play=function(){a.playing&&clearInterval(a.animatedSlides),a.animatedSlides=a.animatedSlides||setInterval(a.animateSlides,a.vars.slideshowSpeed),a.started=a.playing=!0,a.vars.pausePlay&&m.pausePlay.update("pause"),a.syncExists&&m.sync("play")},a.stop=function(){a.pause(),a.stopped=!0},a.canAdvance=function(e,t){var n=p?a.pagingCount-1:a.last;return t?!0:p&&a.currentItem===a.count-1&&0===e&&"prev"===a.direction?!0:p&&0===a.currentItem&&e===a.pagingCount-1&&"next"!==a.direction?!1:e!==a.currentSlide||p?a.vars.animationLoop?!0:a.atEnd&&0===a.currentSlide&&e===n&&"next"!==a.direction?!1:a.atEnd&&a.currentSlide===n&&0===e&&"next"===a.direction?!1:!0:!1},a.getTarget=function(e){return a.direction=e,"next"===e?a.currentSlide===a.last?0:a.currentSlide+1:0===a.currentSlide?a.last:a.currentSlide-1},a.setProps=function(e,t,n){var i=function(){var n=e?e:(a.itemW+a.vars.itemMargin)*a.move*a.animatingTo,i=function(){if(u)return"setTouch"===t?e:d&&a.animatingTo===a.last?0:d?a.limit-(a.itemW+a.vars.itemMargin)*a.move*a.animatingTo:a.animatingTo===a.last?a.limit:n;switch(t){case"setTotal":return d?(a.count-1-a.currentSlide+a.cloneOffset)*e:(a.currentSlide+a.cloneOffset)*e;case"setTouch":return d?e:e;case"jumpEnd":return d?e:a.count*e;case"jumpStart":return d?a.count*e:e;default:return e}}();return-1*i+"px"}();a.transitions&&(i=c?"translate3d(0,"+i+",0)":"translate3d("+i+",0,0)",n=void 0!==n?n/1e3+"s":"0s",a.container.css("-"+a.pfx+"-transition-duration",n),a.container.css("transition-duration",n)),a.args[a.prop]=i,(a.transitions||void 0===n)&&a.container.css(a.args),a.container.css("transform",i)},a.setup=function(e){if(v)a.slides.css({width:"100%","float":"left",marginRight:"-100%",position:"relative"}),"init"===e&&(s?a.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+a.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(a.currentSlide).css({opacity:1,zIndex:2}):0==a.vars.fadeFirstSlide?a.slides.css({opacity:0,display:"block",zIndex:1}).eq(a.currentSlide).css({zIndex:2}).css({opacity:1}):a.slides.css({opacity:0,display:"block",zIndex:1}).eq(a.currentSlide).css({zIndex:2}).animate({opacity:1},a.vars.animationSpeed,a.vars.easing)),a.vars.smoothHeight&&m.smoothHeight();else{var t,i;"init"===e&&(a.viewport=$('<div class="'+n+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(a).append(a.container),a.cloneCount=0,a.cloneOffset=0,d&&(i=$.makeArray(a.slides).reverse(),a.slides=$(i),a.container.empty().append(a.slides))),a.vars.animationLoop&&!u&&(a.cloneCount=2,a.cloneOffset=1,"init"!==e&&a.container.find(".clone").remove(),a.container.append(m.uniqueID(a.slides.first().clone().addClass("clone")).attr("aria-hidden","true")).prepend(m.uniqueID(a.slides.last().clone().addClass("clone")).attr("aria-hidden","true"))),a.newSlides=$(a.vars.selector,a),t=d?a.count-1-a.currentSlide+a.cloneOffset:a.currentSlide+a.cloneOffset,c&&!u?(a.container.height(200*(a.count+a.cloneCount)+"%").css("position","absolute").width("100%"),setTimeout(function(){a.newSlides.css({display:"block"}),a.doMath(),a.viewport.height(a.h),a.setProps(t*a.h,"init")},"init"===e?100:0)):(a.container.width(200*(a.count+a.cloneCount)+"%"),a.setProps(t*a.computedW,"init"),setTimeout(function(){a.doMath(),a.newSlides.css({width:a.computedW,"float":"left",display:"block"}),a.vars.smoothHeight&&m.smoothHeight()},"init"===e?100:0))}u||a.slides.removeClass(n+"active-slide").eq(a.currentSlide).addClass(n+"active-slide"),a.vars.init(a)},a.doMath=function(){var e=a.slides.first(),t=a.vars.itemMargin,n=a.vars.minItems,i=a.vars.maxItems;a.w=void 0===a.viewport?a.width():a.viewport.width(),a.h=e.height(),a.boxPadding=e.outerWidth()-e.width(),u?(a.itemT=a.vars.itemWidth+t,a.minW=n?n*a.itemT:a.w,a.maxW=i?i*a.itemT-t:a.w,a.itemW=a.minW>a.w?(a.w-t*(n-1))/n:a.maxW<a.w?(a.w-t*(i-1))/i:a.vars.itemWidth>a.w?a.w:a.vars.itemWidth,a.visible=Math.floor(a.w/a.itemW),a.move=a.vars.move>0&&a.vars.move<a.visible?a.vars.move:a.visible,a.pagingCount=Math.ceil((a.count-a.visible)/a.move+1),a.last=a.pagingCount-1,a.limit=1===a.pagingCount?0:a.vars.itemWidth>a.w?a.itemW*(a.count-1)+t*(a.count-1):(a.itemW+t)*a.count-a.w-t):(a.itemW=a.w,a.pagingCount=a.count,a.last=a.count-1),a.computedW=a.itemW-a.boxPadding},a.update=function(e,t){a.doMath(),u||(e<a.currentSlide?a.currentSlide+=1:e<=a.currentSlide&&0!==e&&(a.currentSlide-=1),a.animatingTo=a.currentSlide),a.vars.controlNav&&!a.manualControls&&("add"===t&&!u||a.pagingCount>a.controlNav.length?m.controlNav.update("add"):("remove"===t&&!u||a.pagingCount<a.controlNav.length)&&(u&&a.currentSlide>a.last&&(a.currentSlide-=1,a.animatingTo-=1),m.controlNav.update("remove",a.last))),a.vars.directionNav&&m.directionNav.update()},a.addSlide=function(e,t){var n=$(e);a.count+=1,a.last=a.count-1,c&&d?void 0!==t?a.slides.eq(a.count-t).after(n):a.container.prepend(n):void 0!==t?a.slides.eq(t).before(n):a.container.append(n),a.update(t,"add"),a.slides=$(a.vars.selector+":not(.clone)",a),a.setup(),a.vars.added(a)},a.removeSlide=function(e){var t=isNaN(e)?a.slides.index($(e)):e;a.count-=1,a.last=a.count-1,isNaN(e)?$(e,a.slides).remove():c&&d?a.slides.eq(a.last).remove():a.slides.eq(e).remove(),a.doMath(),a.update(t,"remove"),a.slides=$(a.vars.selector+":not(.clone)",a),a.setup(),a.vars.removed(a)},m.init()},$(window).blur(function(e){focused=!1}).focus(function(e){focused=!0}),$.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:!1,fadeFirstSlide:!0,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){},init:function(){}},$.fn.flexslider=function(e){if(void 0===e&&(e={}),"object"==typeof e)return this.each(function(){var t=$(this),a=e.selector?e.selector:".slides > li",n=t.find(a);1===n.length&&e.allowOneSlide===!0||0===n.length?(n.fadeIn(400),e.start&&e.start(t)):void 0===t.data("flexslider")&&new $.flexslider(this,e)});var t=$(this).data("flexslider");switch(e){case"play":t.play();break;case"pause":t.pause();break;case"stop":t.stop();break;case"next":t.flexAnimate(t.getTarget("next"),!0);break;case"prev":case"previous":t.flexAnimate(t.getTarget("prev"),!0);break;default:"number"==typeof e&&t.flexAnimate(e,!0)}}}(jQuery);
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/masonry.pkgd.min.js 

/*!
 * Masonry PACKAGED v3.2.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c("object"==typeof exports?require("jquery"):a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(this),function(a){function b(a){"function"==typeof a&&(b.isReady?a():g.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==f.readyState;b.isReady||c||d()}function d(){b.isReady=!0;for(var a=0,c=g.length;c>a;a++){var d=g[a];d()}}function e(e){return"complete"===f.readyState?d():(e.bind(f,"DOMContentLoaded",c),e.bind(f,"readystatechange",c),e.bind(a,"load",c)),b}var f=a.document,g=[];b.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],e):"object"==typeof exports?module.exports=e(require("eventie")):a.docReady=e(a.eventie)}(window),function(){function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:e.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a){function b(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function c(){}function d(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=g.length;c>b;b++){var d=g[b];a[d]=0}return a}function e(c){function e(){if(!m){m=!0;var d=a.getComputedStyle;if(j=function(){var a=d?function(a){return d(a,null)}:function(a){return a.currentStyle};return function(b){var c=a(b);return c||f("Style returned "+c+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),c}}(),k=c("boxSizing")){var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style[k]="border-box";var g=document.body||document.documentElement;g.appendChild(e);var h=j(e);l=200===b(h.width),g.removeChild(e)}}}function h(a){if(e(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var c=j(a);if("none"===c.display)return d();var f={};f.width=a.offsetWidth,f.height=a.offsetHeight;for(var h=f.isBorderBox=!(!k||!c[k]||"border-box"!==c[k]),m=0,n=g.length;n>m;m++){var o=g[m],p=c[o];p=i(a,p);var q=parseFloat(p);f[o]=isNaN(q)?0:q}var r=f.paddingLeft+f.paddingRight,s=f.paddingTop+f.paddingBottom,t=f.marginLeft+f.marginRight,u=f.marginTop+f.marginBottom,v=f.borderLeftWidth+f.borderRightWidth,w=f.borderTopWidth+f.borderBottomWidth,x=h&&l,y=b(c.width);y!==!1&&(f.width=y+(x?0:r+v));var z=b(c.height);return z!==!1&&(f.height=z+(x?0:s+w)),f.innerWidth=f.width-(r+v),f.innerHeight=f.height-(s+w),f.outerWidth=f.width+t,f.outerHeight=f.height+u,f}}function i(b,c){if(a.getComputedStyle||-1===c.indexOf("%"))return c;var d=b.style,e=d.left,f=b.runtimeStyle,g=f&&f.left;return g&&(f.left=b.currentStyle.left),d.left=c,c=d.pixelLeft,d.left=e,g&&(f.left=g),c}var j,k,l,m=!1;return h}var f="undefined"==typeof console?c:function(a){console.error(a)},g=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],e):"object"==typeof exports?module.exports=e(require("desandro-get-style-property")):a.getSize=e(a.getStyleProperty)}(window),function(a){function b(a,b){return a[g](b)}function c(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function d(a,b){c(a);for(var d=a.parentNode.querySelectorAll(b),e=0,f=d.length;f>e;e++)if(d[e]===a)return!0;return!1}function e(a,d){return c(a),b(a,d)}var f,g=function(){if(a.matchesSelector)return"matchesSelector";for(var b=["webkit","moz","ms","o"],c=0,d=b.length;d>c;c++){var e=b[c],f=e+"MatchesSelector";if(a[f])return f}}();if(g){var h=document.createElement("div"),i=b(h,"div");f=i?b:e}else f=d;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return f}):"object"==typeof exports?module.exports=f:window.matchesSelector=f}(Element.prototype),function(a){function b(a,b){for(var c in b)a[c]=b[c];return a}function c(a){for(var b in a)return!1;return b=null,!0}function d(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function e(a,e,f){function h(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}var i=f("transition"),j=f("transform"),k=i&&j,l=!!f("perspective"),m={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[i],n=["transform","transition","transitionDuration","transitionProperty"],o=function(){for(var a={},b=0,c=n.length;c>b;b++){var d=n[b],e=f(d);e&&e!==d&&(a[d]=e)}return a}();b(h.prototype,a.prototype),h.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},h.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},h.prototype.getSize=function(){this.size=e(this.element)},h.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=o[c]||c;b[d]=a[c]}},h.prototype.getPosition=function(){var a=g(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=parseInt(a[c?"left":"right"],10),f=parseInt(a[d?"top":"bottom"],10);e=isNaN(e)?0:e,f=isNaN(f)?0:f;var h=this.layout.size;e-=c?h.paddingLeft:h.paddingRight,f-=d?h.paddingTop:h.paddingBottom,this.position.x=e,this.position.y=f},h.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={};b.isOriginLeft?(c.left=this.position.x+a.paddingLeft+"px",c.right=""):(c.right=this.position.x+a.paddingRight+"px",c.left=""),b.isOriginTop?(c.top=this.position.y+a.paddingTop+"px",c.bottom=""):(c.bottom=this.position.y+a.paddingBottom+"px",c.top=""),this.css(c),this.emitEvent("layout",[this])};var p=l?function(a,b){return"translate3d("+a+"px, "+b+"px, 0)"}:function(a,b){return"translate("+a+"px, "+b+"px)"};h.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={},k=this.layout.options;h=k.isOriginLeft?h:-h,i=k.isOriginTop?i:-i,j.transform=p(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},h.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},h.prototype.moveTo=k?h.prototype._transitionTo:h.prototype.goTo,h.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},h.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},h.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var q=j&&d(j)+",opacity";h.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:q,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(m,this,!1))},h.prototype.transition=h.prototype[i?"_transition":"_nonTransition"],h.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},h.prototype.onotransitionend=function(a){this.ontransitionend(a)};var r={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};h.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,d=r[a.propertyName]||a.propertyName;if(delete b.ingProperties[d],c(b.ingProperties)&&this.disableTransition(),d in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[d]),d in b.onEnd){var e=b.onEnd[d];e.call(this),delete b.onEnd[d]}this.emitEvent("transitionEnd",[this])}},h.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(m,this,!1),this.isTransitioning=!1},h.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var s={transitionProperty:"",transitionDuration:""};return h.prototype.removeTransitionStyles=function(){this.css(s)},h.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.emitEvent("remove",[this])},h.prototype.remove=function(){if(!i||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.on("transitionEnd",function(){return a.removeElem(),!0}),this.hide()},h.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options;this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0})},h.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options;this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:{opacity:function(){this.isHidden&&this.css({display:"none"})}}})},h.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},h}var f=a.getComputedStyle,g=f?function(a){return f(a,null)}:function(a){return a.currentStyle};"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property"],e):"object"==typeof exports?module.exports=e(require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property")):(a.Outlayer={},a.Outlayer.Item=e(a.EventEmitter,a.getSize,a.getStyleProperty))}(window),function(a){function b(a,b){for(var c in b)a[c]=b[c];return a}function c(a){return"[object Array]"===l.call(a)}function d(a){var b=[];if(c(a))b=a;else if(a&&"number"==typeof a.length)for(var d=0,e=a.length;e>d;d++)b.push(a[d]);else b.push(a);return b}function e(a,b){var c=n(b,a);-1!==c&&b.splice(c,1)}function f(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()}function g(c,g,l,n,o,p){function q(a,c){if("string"==typeof a&&(a=h.querySelector(a)),!a||!m(a))return void(i&&i.error("Bad "+this.constructor.namespace+" element: "+a));this.element=a,this.options=b({},this.constructor.defaults),this.option(c);var d=++r;this.element.outlayerGUID=d,s[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var r=0,s={};return q.namespace="outlayer",q.Item=p,q.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},b(q.prototype,l.prototype),q.prototype.option=function(a){b(this.options,a)},q.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),b(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},q.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},q.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},q.prototype._filterFindItemElements=function(a){a=d(a);for(var b=this.options.itemSelector,c=[],e=0,f=a.length;f>e;e++){var g=a[e];if(m(g))if(b){o(g,b)&&c.push(g);for(var h=g.querySelectorAll(b),i=0,j=h.length;j>i;i++)c.push(h[i])}else c.push(g)}return c},q.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},q.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},q.prototype._init=q.prototype.layout,q.prototype._resetLayout=function(){this.getSize()},q.prototype.getSize=function(){this.size=n(this.element)},q.prototype._getMeasurement=function(a,b){var c,d=this.options[a];d?("string"==typeof d?c=this.element.querySelector(d):m(d)&&(c=d),this[a]=c?n(c)[b]:d):this[a]=0},q.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},q.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},q.prototype._layoutItems=function(a,b){function c(){d.emitEvent("layoutComplete",[d,a])}var d=this;if(!a||!a.length)return void c();this._itemsOn(a,"layout",c);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f],i=this._getItemLayoutPosition(h);i.item=h,i.isInstant=b||h.isLayoutInstant,e.push(i)}this._processLayoutQueue(e)},q.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},q.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},q.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},q.prototype._postLayout=function(){this.resizeContainer()},q.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},q.prototype._getContainerSize=k,q.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},q.prototype._itemsOn=function(a,b,c){function d(){return e++,e===f&&c.call(g),!0}for(var e=0,f=a.length,g=this,h=0,i=a.length;i>h;h++){var j=a[h];j.on(b,d)}},q.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},q.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},q.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},q.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e(d,this.stamps),this.unignore(d)}},q.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=d(a)):void 0},q.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},q.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},q.prototype._manageStamp=k,q.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,d=n(a),e={left:b.left-c.left-d.marginLeft,top:b.top-c.top-d.marginTop,right:c.right-b.right-d.marginRight,bottom:c.bottom-b.bottom-d.marginBottom};return e},q.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},q.prototype.bindResize=function(){this.isResizeBound||(c.bind(a,"resize",this),this.isResizeBound=!0)},q.prototype.unbindResize=function(){this.isResizeBound&&c.unbind(a,"resize",this),this.isResizeBound=!1},q.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},q.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},q.prototype.needsResizeLayout=function(){var a=n(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},q.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},q.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},q.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},q.prototype.reveal=function(a){var b=a&&a.length;if(b)for(var c=0;b>c;c++){var d=a[c];d.reveal()}},q.prototype.hide=function(a){var b=a&&a.length;if(b)for(var c=0;b>c;c++){var d=a[c];d.hide()}},q.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},q.prototype.getItems=function(a){if(a&&a.length){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c],f=this.getItem(e);f&&b.push(f)}return b}},q.prototype.remove=function(a){a=d(a);var b=this.getItems(a);if(b&&b.length){this._itemsOn(b,"remove",function(){this.emitEvent("removeComplete",[this,b])});for(var c=0,f=b.length;f>c;c++){var g=b[c];g.remove(),e(g,this.items)}}},q.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize();var e=this.element.outlayerGUID;delete s[e],delete this.element.outlayerGUID,j&&j.removeData(this.element,this.constructor.namespace)},q.data=function(a){var b=a&&a.outlayerGUID;return b&&s[b]},q.create=function(a,c){function d(){q.apply(this,arguments)}return Object.create?d.prototype=Object.create(q.prototype):b(d.prototype,q.prototype),d.prototype.constructor=d,d.defaults=b({},q.defaults),b(d.defaults,c),d.prototype.settings={},d.namespace=a,d.data=q.data,d.Item=function(){p.apply(this,arguments)},d.Item.prototype=new p,g(function(){for(var b=f(a),c=h.querySelectorAll(".js-"+b),e="data-"+b+"-options",g=0,k=c.length;k>g;g++){var l,m=c[g],n=m.getAttribute(e);try{l=n&&JSON.parse(n)}catch(o){i&&i.error("Error parsing "+e+" on "+m.nodeName.toLowerCase()+(m.id?"#"+m.id:"")+": "+o);continue}var p=new d(m,l);j&&j.data(m,a,p)}}),j&&j.bridget&&j.bridget(a,d),d},q.Item=p,q}var h=a.document,i=a.console,j=a.jQuery,k=function(){},l=Object.prototype.toString,m="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1===a.nodeType&&"string"==typeof a.nodeName},n=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1};"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","doc-ready/doc-ready","eventEmitter/EventEmitter","get-size/get-size","matches-selector/matches-selector","./item"],g):"object"==typeof exports?module.exports=g(require("eventie"),require("doc-ready"),require("wolfy87-eventemitter"),require("get-size"),require("desandro-matches-selector"),require("./item")):a.Outlayer=g(a.eventie,a.docReady,a.EventEmitter,a.getSize,a.matchesSelector,a.Outlayer.Item)}(window),function(a){function b(a,b){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}this.columnWidth+=this.gutter,this.cols=Math.floor((this.containerWidth+this.gutter)/this.columnWidth),this.cols=Math.max(this.cols,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d}var c=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++){var e=a[c];if(e===b)return c}return-1};"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],b):"object"==typeof exports?module.exports=b(require("outlayer"),require("get-size")):a.Masonry=b(a.Outlayer,a.getSize)}(window);
jQuery(window).load(function() {
 // Call Masonry here
 jQuery('.grid-blog').masonry({
  itemSelector: '.post'
 });
});
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/cloud-zoom.1.0.2.min.js 
//////////////////////////////////////////////////////////////////////////////////
// Cloud Zoom V1.0.1
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software
//////////////////////////////////////////////////////////////////////////////////
(function($){$(document).ready(function(){$('.cloud-zoom, .cloud-zoom-gallery').CloudZoom()});function format(a){for(var i=1;i<arguments.length;i++){a=a.replace('%'+(i-1),arguments[i])}return a}function CloudZoom(g,i){var j=$('img',g);var k;var l;var m=null;var n=null;var o=null;var p=null;var q=null;var r=null;var s;var t=0;var u,ch;var v=0;var z=0;var A=0;var B=0;var C=0;var D,my;var E=this,zw;setTimeout(function(){if(n===null){var w=g.width();g.parent().append(format('<div style="width:%0px;position:absolute;top:75%;left:%1px;text-align:center" class="cloud-zoom-loading" >Loading...</div>',w/3,(w/2)-(w/6))).find(':last').css('opacity',0.5)}},200);var F=function(){if(r!==null){r.remove();r=null}};this.removeBits=function(){if(o){o.remove();o=null}if(p){p.remove();p=null}if(q){q.remove();q=null}F();$('.cloud-zoom-loading',g.parent()).remove()};this.destroy=function(){g.data('zoom',null);if(n){n.unbind();n.remove();n=null}if(m){m.remove();m=null}this.removeBits()};this.fadedOut=function(){if(m){m.remove();m=null}this.removeBits()};this.controlLoop=function(){if(o){var x=(D-j.offset().left-(u*0.5))>>0;var y=(my-j.offset().top-(ch*0.5))>>0;if(x<0){x=0}else if(x>(j.outerWidth()-u)){x=(j.outerWidth()-u)}if(y<0){y=0}else if(y>(j.outerHeight()-ch)){y=(j.outerHeight()-ch)}o.css({left:x,top:y});o.css('background-position',(-x)+'px '+(-y)+'px');v=(((x)/j.outerWidth())*s.width)>>0;z=(((y)/j.outerHeight())*s.height)>>0;B+=(v-B)/i.smoothMove;A+=(z-A)/i.smoothMove;m.css('background-position',(-(B>>0)+'px ')+(-(A>>0)+'px'))}t=setTimeout(function(){E.controlLoop()},30)};this.init2=function(a,b){C++;if(b===1){s=a}if(C===2){this.init()}};this.init=function(){$('.cloud-zoom-loading',g.parent()).remove();n=g.parent().append(format("<div class='mousetrap' style='background-image:url(\".\");z-index:999;position:absolute;width:%0px;height:%1px;left:%2px;top:%3px;\'></div>",j.outerWidth(),j.outerHeight(),0,0)).find(':last');n.bind('mousemove',this,function(a){D=a.pageX;my=a.pageY});n.bind('mouseleave',this,function(a){clearTimeout(t);if(o){o.fadeOut(299)}if(p){p.fadeOut(299)}if(q){q.fadeOut(299)}m.fadeOut(300,function(){E.fadedOut()});return false});n.bind('mouseenter',this,function(a){D=a.pageX;my=a.pageY;zw=a.data;if(m){m.stop(true,false);m.remove()}var b=i.adjustX,yPos=i.adjustY;var c=j.outerWidth();var d=j.outerHeight();var w=i.zoomWidth;var h=i.zoomHeight;if(i.zoomWidth=='auto'){w=c}if(i.zoomHeight=='auto'){h=d}var e=g.parent();switch(i.position){case'top':yPos-=h;break;case'right':b+=c;break;case'bottom':yPos+=d;break;case'left':b-=w;break;case'inside':w=c;h=d;break;default:e=$('#'+i.position);if(!e.length){e=g;b+=c;yPos+=d}else{w=e.innerWidth();h=e.innerHeight()}}m=e.append(format('<div id="cloud-zoom-big" class="cloud-zoom-big" style="display:none;position:absolute;left:%0px;top:%1px;width:%2px;height:%3px;background-image:url(\'%4\');z-index:99;"></div>',b,yPos,w,h,s.src)).find(':last');if(j.attr('title')&&i.showTitle){m.append(format('<div class="cloud-zoom-title">%0</div>',j.attr('title'))).find(':last').css('opacity',i.titleOpacity)}if($.browser.msie&&$.browser.version<7){r=$('<iframe frameborder="0" src="#"></iframe>').css({position:"absolute",left:b,top:yPos,zIndex:99,width:w,height:h}).insertBefore(m)}m.fadeIn(500);if(o){o.remove();o=null}u=(j.outerWidth()/s.width)*m.width();ch=(j.outerHeight()/s.height)*m.height();o=g.append(format("<div class = 'cloud-zoom-lens' style='display:none;z-index:98;position:absolute;width:%0px;height:%1px;'></div>",u,ch)).find(':last');n.css('cursor',o.css('cursor'));var f=false;if(i.tint){o.css('background','url("'+j.attr('src')+'")');p=g.append(format('<div style="display:none;position:absolute; left:0px; top:0px; width:%0px; height:%1px; background-color:%2;" />',j.outerWidth(),j.outerHeight(),i.tint)).find(':last');p.css('opacity',i.tintOpacity);f=true;p.fadeIn(500)}if(i.softFocus){o.css('background','url("'+j.attr('src')+'")');q=g.append(format('<div style="position:absolute;display:none;top:2px; left:2px; width:%0px; height:%1px;" />',j.outerWidth()-2,j.outerHeight()-2,i.tint)).find(':last');q.css('background','url("'+j.attr('src')+'")');q.css('opacity',0.5);f=true;q.fadeIn(500)}if(!f){o.css('opacity',i.lensOpacity)}if(i.position!=='inside'){o.fadeIn(500)}zw.controlLoop();return})};k=new Image();$(k).load(function(){E.init2(this,0)});k.src=j.attr('src');l=new Image();$(l).load(function(){E.init2(this,1)});l.src=g.attr('href')}$.fn.CloudZoom=function(d){try{document.execCommand("BackgroundImageCache",false,true)}catch(e){}this.each(function(){var c,opts;eval('var	a = {'+$(this).attr('rel')+'}');c=a;if($(this).is('.cloud-zoom')){$(this).css({'position':'relative','display':'block'});$('img',$(this)).css({'display':'block'});if($(this).parent().attr('id')!='wrap'){$(this).wrap('<div id="wrap" style="top:0px;z-index:9999;position:relative;"></div>')}opts=$.extend({},$.fn.CloudZoom.defaults,d);opts=$.extend({},opts,c);$(this).data('zoom',new CloudZoom($(this),opts))}else if($(this).is('.cloud-zoom-gallery')){opts=$.extend({},c,d);$(this).data('relOpts',opts);$(this).bind('click',$(this),function(a){var b=a.data.data('relOpts');$('#'+b.useZoom).data('zoom').destroy();$('#'+b.useZoom).attr('href',a.data.attr('href'));$('#'+b.useZoom+' img').attr('src',a.data.data('relOpts').smallImage);$('#'+a.data.data('relOpts').useZoom).CloudZoom();return false})}});return this};$.fn.CloudZoom.defaults={zoomWidth:'auto',zoomHeight:'auto',position:'right',tint:false,tintOpacity:0.5,lensOpacity:0.5,softFocus:false,smoothMove:3,showTitle:true,titleOpacity:0.5,adjustX:0,adjustY:0}})(jQuery);
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/number-polyfill.min.js 
(function(){(function(e){var t,n;return t=document.createElement("input"),t.setAttribute("type","number"),"text"!==t.type?(e.fn.inputNumber=function(){return e(this)},void 0):(e.fn.inputNumber=function(){return e(this).filter(function(){var t;return t=e(this),t.is('input[type="number"]')&&!(t.parent().is("span")&&t.next().is("div.number-spin-btn-container")&&t.next().children().first().is("div.number-spin-btn-up")&&t.next().children().eq(1).is("div.number-spin-btn-down"))}).each(function(){n.polyfills.push(new n(this))}),e(this)},n=function(t){var i,r,o,s,a=this;if(this.elem=e(t),!(this.elem.is(":root *")&&this.elem.height()>0))throw Error("Element must be in DOM and displayed so that its height can be measured.");s=this.elem.outerHeight()/2+"px",this.upBtn=e("<div/>",{"class":"number-spin-btn number-spin-btn-up",style:"height: "+s}),this.downBtn=e("<div/>",{"class":"number-spin-btn number-spin-btn-down",style:"height: "+s}),this.btnContainer=e("<div/>",{"class":"number-spin-btn-container"}),i=e("<span/>",{style:"white-space: nowrap"}),this.upBtn.appendTo(this.btnContainer),this.downBtn.appendTo(this.btnContainer),this.elem.wrap(i),this.btnContainer.insertAfter(this.elem),this.elem.on({focus:function(){a.elem.on({DOMMouseScroll:n.domMouseScrollHandler,mousewheel:n.mouseWheelHandler},{p:a})},blur:function(){a.elem.off({DOMMouseScroll:n.domMouseScrollHandler,mousewheel:n.mouseWheelHandler})}}),this.elem.on({keypress:n.elemKeypressHandler,change:n.elemChangeHandler},{p:this}),this.upBtn.on("mousedown",{p:this,func:"increment"},n.elemBtnMousedownHandler),this.downBtn.on("mousedown",{p:this,func:"decrement"},n.elemBtnMousedownHandler),this.elem.css("textAlign","right"),this.attrMutationHandler("class"),"undefined"!=typeof WebKitMutationObserver&&null!==WebKitMutationObserver||r!==void 0&&null!==r?("undefined"==typeof WebKitMutationObserver||null===WebKitMutationObserver||void 0!==r&&null!==r||(r=WebKitMutationObserver),o=new r(function(e){var t,n,i;for(n=0,i=e.length;i>n;n++)t=e[n],"attributes"===t.type&&a.attrMutationHandler(t.attributeName,t.oldValue,a.elem.attr(t.attributeName))}),o.observe(t,{attributes:!0,attributeOldValue:!0,attributeFilter:["class","style","min","max","step"]})):"undefined"!=typeof MutationEvent&&null!==MutationEvent&&this.elem.on("DOMAttrModified",function(e){a.attrMutationHandler(e.originalEvent.attrName,e.originalEvent.prevValue,e.originalEvent.newValue)})},n.polyfills=[],n.isNumber=function(e){return null!=e&&"function"==typeof e.toString?/^-?\d+(?:\.\d+)?$/.test(""+e):!1},n.isFloat=function(e){return null!=e&&"function"==typeof e.toString?/^-?\d+\.\d+$/.test(""+e):!1},n.isInt=function(e){return null!=e&&"function"==typeof e.toString?/^-?\d+$/.test(""+e):!1},n.isNegative=function(e){return null!=e&&"function"==typeof e.toString?/^-\d+(?:\.\d+)?$/.test(""+e):!1},n.raiseNum=function(e){var t,i,r;if("number"==typeof e||"object"==typeof e&&e instanceof Number)return e%1?{num:""+e,precision:0}:n.raiseNum(""+e);if("string"==typeof e||"object"==typeof e&&e instanceof String){if(n.isFloat(e))return e=e.replace(/(\.\d)0+$/,"$1"),r=n.getPrecision(e),i=e.slice(0,-(r+1))+e.slice(-r),i=i.replace(/^(-?)0+(\d+)/,"$1$2"),t={num:i,precision:r};if(n.isInt(e))return{num:e,precision:0}}},n.raiseNumPrecision=function(e,n){var i,r;if(n>e.precision){for(t=i=r=e.precision;n>=r?n>i:i>n;t=n>=r?++i:--i)e.num+="0";e.precision=n}},n.lowerNum=function(e){if(e.precision>0){for(;e.num.length<e.precision+1;)e.num=n.isNegative(e.num)?e.num.slice(0,1)+"0"+e.num.slice(1):"0"+e.num;return(e.num.slice(0,-e.precision)+"."+e.num.slice(-e.precision)).replace(/\.?0+$/,"").replace(/^(-?)(\.)/,"$10$2")}return e.num},n.preciseAdd=function(e,t){var i,r,o;if(("number"==typeof e||"object"==typeof e&&e instanceof Number)&&("number"==typeof t||"object"==typeof t&&t instanceof Number))return 0===e%1&&0===t%1?""+(e+t):n.preciseAdd(""+e,""+t);if(("string"==typeof e||"object"==typeof e&&e instanceof String)&&("string"==typeof t||"object"==typeof t&&t instanceof String)){if(n.isNumber(e)){if(n.isNumber(t)){if(n.isInt(e)){if(n.isInt(t))return n.preciseAdd(parseInt(e,10),parseInt(t,10));n.isFloat(t)&&(e+=".0")}else n.isFloat(e)&&n.isInt(t)&&(t+=".0");if(i=n.raiseNum(e),r=n.raiseNum(t),i.precision<r.precision?n.raiseNumPrecision(i,r.precision):i.precision>r.precision&&n.raiseNumPrecision(r,i.precision),o=""+(parseInt(i.num,10)+parseInt(r.num,10)),i.precision>0){if(n.isNegative(o))for(;i.precision>o.length-1;)o="-0"+o.slice(1);else for(;i.precision>o.length;)o="0"+o;o=n.lowerNum({num:o,precision:i.precision})}return o=o.replace(/^(-?)\./,"$10."),n.isFloat(o)&&(o=o.replace(/0+$/,"")),o}throw new SyntaxError('Argument "'+t+'" is not a number.')}throw new SyntaxError('Argument "'+e+'" is not a number.')}return n.preciseAdd(""+e,""+t)},n.preciseSubtract=function(e,t){return"number"==typeof t||"object"==typeof t&&t instanceof Number?n.preciseAdd(e,-t):"string"==typeof t||"object"==typeof t&&t instanceof String?n.isNegative(t)?n.preciseAdd(e,t.slice(1)):n.preciseAdd(e,"-"+t):void 0},n.getPrecision=function(e){var t,i;if("number"==typeof e){for(t=0,i=e;i!==Math.floor(i);)i=e*Math.pow(10,++t);return t}return"string"==typeof e&&n.isNumber(e)?n.isFloat(e)?/^-?\d+(?:\.(\d+))?$/.exec(e)[1].length:0:void 0},n.prototype.getParams=function(){var e,t,i,r;return i=this.elem.attr("step"),t=this.elem.attr("min"),e=this.elem.attr("max"),r=this.elem.val(),n.isNumber(i)||(i=null),n.isNumber(t)||(t=null),n.isNumber(e)||(e=null),n.isNumber(r)||(r=t||0),{min:null!=t?t:null,max:null!=e?e:null,step:null!=i?i:"1",val:null!=r?r:null}},n.prototype.clipValues=function(e,t,n){return null!=n&&parseFloat(e)>parseFloat(n)?n:null!=t&&parseFloat(e)<parseFloat(t)?t:e},n.prototype.stepNormalize=function(e){var t,i,r,o,s;return r=this.getParams(),s=r.step,i=r.min,null==s?e:(s=n.raiseNum(s),t=n.raiseNum(e),t.precision>s.precision?n.raiseNumPrecision(s,t.precision):t.precision<s.precision&&n.raiseNumPrecision(t,s.precision),null!=i&&(t=n.raiseNum(n.preciseSubtract(e,i)),n.raiseNumPrecision(t,s.precision)),0===parseFloat(t.num)%parseFloat(s.num)?e:(t=n.lowerNum({num:""+Math.round(parseFloat(t.num)/(o=parseFloat(s.num)))*o,precision:t.precision}),null!=i&&(t=n.preciseAdd(t,i)),t))},n.domMouseScrollHandler=function(e){var t;t=e.data.p,e.preventDefault(),0>e.originalEvent.detail?t.increment():t.decrement()},n.mouseWheelHandler=function(e){var t;t=e.data.p,e.preventDefault(),e.originalEvent.wheelDelta>0?t.increment():t.decrement()},n.elemKeypressHandler=function(e){var t,n,i;t=e.data.p,38===e.keyCode?t.increment():40===e.keyCode?t.decrement():8!==(n=e.keyCode)&&9!==n&&35!==n&&36!==n&&37!==n&&39!==n&&46!==n&&45!==(i=e.which)&&46!==i&&48!==i&&49!==i&&50!==i&&51!==i&&52!==i&&53!==i&&54!==i&&55!==i&&56!==i&&57!==i&&e.preventDefault()},n.elemChangeHandler=function(e){var t,i,r,o;r=e.data.p,""!==r.elem.val()&&(n.isNumber(r.elem.val())?(o=r.getParams(),i=r.clipValues(o.val,o.min,o.max),i=r.stepNormalize(i),""+i!==r.elem.val()&&r.elem.val(i).change()):(t=r.elem.attr("min"),r.elem.val(null!=t&&n.isNumber(t)?t:"0").change()))},n.elemBtnMousedownHandler=function(t){var n,i,r,o,s=this;i=t.data.p,n=t.data.func,i[n](),o=function(){i[n](),i.timeoutID=window.setTimeout(o,10)},r=function(){window.clearTimeout(i.timeoutID),e(document).off("mouseup",r),e(s).off("mouseleave",r)},e(document).on("mouseup",r),e(this).on("mouseleave",r),i.timeoutID=window.setTimeout(o,700)},n.prototype.attrMutationHandler=function(e){var n,i,r,o,s;if("class"===e||"style"===e){for(i={},n=null,s=["opacity","visibility","-moz-transition-property","-moz-transition-duration","-moz-transition-timing-function","-moz-transition-delay","-webkit-transition-property","-webkit-transition-duration","-webkit-transition-timing-function","-webkit-transition-delay","-o-transition-property","-o-transition-duration","-o-transition-timing-function","-o-transition-delay","transition-property","transition-duration","transition-timing-function","transition-delay"],r=0,o=s.length;o>r;r++)t=s[r],(n=this.elem.css(t))!==this.btnContainer.css(t)&&(i[t]=n);i.display="none"===this.elem.css("display")?"none":"inline-block",this.btnContainer.css(i)}else("min"===e||"max"===e||"step"===e)&&this.elem.change()},n.prototype.increment=function(){var e,t;this.elem.is(":disabled")||this.elem.is("[readonly]")||(t=this.getParams(),e=n.preciseAdd(t.val,t.step),null!=t.max&&parseFloat(e)>parseFloat(t.max)&&(e=t.max),e=this.stepNormalize(e),this.elem.val(e).change())},n.prototype.decrement=function(){var e,t;this.elem.is(":disabled")||this.elem.is("[readonly]")||(t=this.getParams(),e=n.preciseSubtract(t.val,t.step),null!=t.min&&parseFloat(e)<parseFloat(t.min)&&(e=t.min),e=this.stepNormalize(e),this.elem.val(e).change())},e(function(){e('input[type="number"]').inputNumber()}),void 0)})(jQuery)}).call(this);
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/wc-quantity-increment.min.js 
jQuery(function($){$("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").addClass("buttons_added").append('<input type="button" value="+" class="plus" />').prepend('<input type="button" value="-" class="minus" />'),$(document).on("click",".plus, .minus",function(){var t=$(this).closest(".quantity").find(".qty"),a=parseFloat(t.val()),n=parseFloat(t.attr("max")),s=parseFloat(t.attr("min")),e=t.attr("step");a&&""!==a&&"NaN"!==a||(a=0),(""===n||"NaN"===n)&&(n=""),(""===s||"NaN"===s)&&(s=0),("any"===e||""===e||void 0===e||"NaN"===parseFloat(e))&&(e=1),$(this).is(".plus")?t.val(n&&(n==a||a>n)?n:a+parseFloat(e)):s&&(s==a||s>a)?t.val(s):a>0&&t.val(a-parseFloat(e)),t.trigger("change")})});
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/bootstrap.min.js 
/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/
if(!jQuery)throw new Error("Bootstrap requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]}}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(window.jQuery),+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function c(){f.trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one(a.support.transition.end,c).emulateTransitionEnd(150):c())};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),"string"==typeof b&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d)};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.is("input")?"val":"html",e=c.data();a+="Text",e.resetText||c.data("resetText",c[d]()),c[d](e[a]||this.options[a]),setTimeout(function(){"loadingText"==a?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.closest('[data-toggle="buttons"]');if(a.length){var b=this.$element.find("input").prop("checked",!this.$element.hasClass("active")).trigger("change");"radio"===b.prop("type")&&a.find(".active").removeClass("active")}this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof c&&c;e||d.data("bs.button",e=new b(this,f)),"toggle"==c?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition.end&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){return this.sliding?void 0:this.slide("next")},b.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}this.sliding=!0,f&&this.pause();var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});if(!e.hasClass("active")){if(this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")){if(this.$element.trigger(j),j.isDefaultPrevented())return;e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid")},0)}).emulateTransitionEnd(600)}else{if(this.$element.trigger(j),j.isDefaultPrevented())return;d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return f&&this.cycle(),this}};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c),g="string"==typeof c?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),"number"==typeof c?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c,d=a(this),e=a(d.attr("data-target")||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),d.data()),g=d.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=d.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b=a.Event("show.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])}}},b.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?(this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350),void 0):d.call(this)}}},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);e||d.data("bs.collapse",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":d.data(),i=d.attr("data-parent"),j=i&&a(i);g&&g.transitioning||(j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(d).addClass("collapsed"),d[f.hasClass("in")?"addClass":"removeClass"]("collapsed")),f.collapse(h)})}(window.jQuery),+function(a){"use strict";function b(){a(d).remove(),a(e).each(function(b){var d=c(a(this));d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown")),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown"))})}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}var d=".dropdown-backdrop",e="[data-toggle=dropdown]",f=function(b){a(b).on("click.bs.dropdown",this.toggle)};f.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){if("ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b),f.trigger(d=a.Event("show.bs.dropdown")),d.isDefaultPrevented())return;f.toggleClass("open").trigger("shown.bs.dropdown"),e.focus()}return!1}},f.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var f=c(d),g=f.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&f.find(e).focus(),d.click();var h=a("[role=menu] li:not(.divider):visible a",f);if(h.length){var i=h.index(h.filter(":focus"));38==b.keyCode&&i>0&&i--,40==b.keyCode&&i<h.length-1&&i++,~i||(i=0),h.eq(i).focus()}}}};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),d=c.data("dropdown");d||c.data("dropdown",d=new f(this)),"string"==typeof b&&d[b].call(c)})},a.fn.dropdown.Constructor=f,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",e,f.prototype.toggle).on("keydown.bs.dropdown.data-api",e+", [role=menu]",f.prototype.keydown)}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.load(this.options.remote)};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show(),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)}))},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;if(this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),"object"==typeof c&&c);f||e.data("bs.modal",f=new b(this,g)),"string"==typeof c?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(window.jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focus",i="hover"==g?"mouseleave":"blur";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show),void 0):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide),void 0):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this.tip();this.setContent(),this.options.animation&&c.addClass("fade");var d="function"==typeof this.options.placement?this.options.placement.call(this,c[0],this.$element[0]):this.options.placement,e=/\s?auto?\s?/i,f=e.test(d);f&&(d=d.replace(e,"")||"top"),c.detach().css({top:0,left:0,display:"block"}).addClass(d),this.options.container?c.appendTo(this.options.container):c.insertAfter(this.$element);var g=this.getPosition(),h=c[0].offsetWidth,i=c[0].offsetHeight;if(f){var j=this.$element.parent(),k=d,l=document.documentElement.scrollTop||document.body.scrollTop,m="body"==this.options.container?window.innerWidth:j.outerWidth(),n="body"==this.options.container?window.innerHeight:j.outerHeight(),o="body"==this.options.container?0:j.offset().left;d="bottom"==d&&g.top+g.height+i-l>n?"top":"top"==d&&g.top-l-i<0?"bottom":"right"==d&&g.right+h>m?"left":"left"==d&&g.left-h<o?"right":d,c.removeClass(k).addClass(d)}var p=this.getCalculatedOffset(d,g,h,i);this.applyPlacement(p,d),this.$element.trigger("shown.bs."+this.type)}},b.prototype.applyPlacement=function(a,b){var c,d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),a.top=a.top+g,a.left=a.left+h,d.offset(a).addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;if("top"==b&&j!=f&&(c=!0,a.top=a.top+f-j),/bottom|top/.test(b)){var k=0;a.left<0&&(k=-2*a.left,a.left=0,d.offset(a),i=d[0].offsetWidth,j=d[0].offsetHeight),this.replaceArrow(k-e+i,i,"left")}else this.replaceArrow(j-f,j,"top");c&&d.offset(a)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach()}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.$element.trigger("hidden.bs."+this.type),this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(window.jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"html":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof c&&c;e||d.data("bs.popover",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(window.jQuery),+function(a){"use strict";function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(c).is("body")?a(window):a(c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);var c=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#\w/.test(e)&&a(e);return f&&f.length&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,d=c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(b>=d)return g!=(a=f.last()[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parents(".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.attr("data-target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},b.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find(".active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),f.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),"string"==typeof c&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(this.$element.is(":visible")){var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top()),"function"==typeof h&&(h=f.bottom());var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=c-h?"bottom":null!=g&&g>=d?"top":!1;this.affixed!==i&&(this.unpin&&this.$element.css("top",""),this.affixed=i,this.unpin="bottom"==i?e.top-d:null,this.$element.removeClass(b.RESET).addClass("affix"+(i?"-"+i:"")),"bottom"==i&&this.$element.offset({top:document.body.offsetHeight-h-this.$element.height()}))}};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof c&&c;e||d.data("bs.affix",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(window.jQuery);
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/plugins.js 
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
 
/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie=function(e,t,n){if(typeof t!="undefined"){n=n||{};if(t===null){t="";n.expires=-1}var r="";if(n.expires&&(typeof n.expires=="number"||n.expires.toUTCString)){var i;if(typeof n.expires=="number"){i=new Date;i.setTime(i.getTime()+n.expires*24*60*60*1e3)}else{i=n.expires}r="; expires="+i.toUTCString()}var s=n.path?"; path="+n.path:"";var o=n.domain?"; domain="+n.domain:"";var u=n.secure?"; secure":"";document.cookie=[e,"=",encodeURIComponent(t),r,s,o,u].join("")}else{var a=null;if(document.cookie&&document.cookie!=""){var f=document.cookie.split(";");for(var l=0;l<f.length;l++){var c=jQuery.trim(f[l]);if(c.substring(0,e.length+1)==e+"="){a=decodeURIComponent(c.substring(e.length+1));break}}}return a}}

/*!
 * jQuery imagesLoaded plugin v2.1.1
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */

/*jshint curly: true, eqeqeq: true, noempty: true, strict: true, undef: true, browser: true */
/*global jQuery: false */
;(function($, undefined) {
	'use strict';
	// blank image data-uri bypasses webkit log warning (thx doug jones)
	var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

	$.fn.imagesLoaded = function( callback ) {
		var $this = this,
			deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
			hasNotify = $.isFunction(deferred.notify),
			$images = $this.find('img').add( $this.filter('img') ),
			loaded = [],
			proper = [],
			broken = [];

		// Register deferred callbacks
		if ($.isPlainObject(callback)) {
			$.each(callback, function (key, value) {
				if (key === 'callback') {
					callback = value;
				} else if (deferred) {
					deferred[key](value);
				}
			});
		}

		function doneLoading() {
			var $proper = $(proper),
				$broken = $(broken);

			if ( deferred ) {
				if ( broken.length ) {
					deferred.reject( $images, $proper, $broken );
				} else {
					deferred.resolve( $images );
				}
			}

			if ( $.isFunction( callback ) ) {
				callback.call( $this, $images, $proper, $broken );
			}
		}

		function imgLoadedHandler( event ) {
			imgLoaded( event.target, event.type === 'error' );
		}

		function imgLoaded( img, isBroken ) {
			// don't proceed if BLANK image, or image is already loaded
			if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
				return;
			}

			// store element in loaded images array
			loaded.push( img );

			// keep track of broken and properly loaded images
			if ( isBroken ) {
				broken.push( img );
			} else {
				proper.push( img );
			}

			// cache image and its state for future calls
			$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

			// trigger deferred progress method if present
			if ( hasNotify ) {
				deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
			}

			// call doneLoading and clean listeners if all images are loaded
			if ( $images.length === loaded.length ) {
				setTimeout( doneLoading );
				$images.unbind( '.imagesLoaded', imgLoadedHandler );
			}
		}

		// if no images, trigger immediately
		if ( !$images.length ) {
			doneLoading();
		} else {
			$images.bind( 'load.imagesLoaded error.imagesLoaded', imgLoadedHandler )
			.each( function( i, el ) {
				var src = el.src;

				// find out if this image has been already checked for status
				// if it was, and src has not changed, call imgLoaded on it
				var cached = $.data( el, 'imagesLoaded' );
				if ( cached && cached.src === src ) {
					imgLoaded( el, cached.isBroken );
					return;
				}

				// if complete is true and browser supports natural sizes, try
				// to check for image status manually
				if ( el.complete && el.naturalWidth !== undefined ) {
					imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
					return;
				}

				// cached images don't fire load sometimes, so we reset src, but only when
				// dealing with IE, or image is complete (loaded) and failed manual check
				// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
				if ( el.readyState || el.complete ) {
					el.src = BLANK;
					el.src = src;
				}
			});
		}

		return deferred ? deferred.promise( $this ) : $this;
	};

})(jQuery);
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/main.js 
(function($) {
	"use strict";
	/* Add Click On Ipad */
	$(window).resize(function(){
		var $width = $(this).width();
		if( $width < 1199 ){
			$( '.primary-menu .nav .dropdown-toggle'  ).each(function(){
				$(this).attr('data-toggle', 'dropdown');
			});
		}
	});
    jQuery('.phone-icon-search').click(function(){
		//alert("The paragraph was clicked.");
        jQuery('.top-search').toggle("slide");
    });
	
	$('ul.orderby.order-dropdown li ul').hide(); 
	$("ul.order-dropdown > li").each( function(){
		$(this).hover( function() {
			$(this).find( '> ul' ).stop().fadeIn("fast");
		}, function() {
				$(this).find( '> ul' ).stop().fadeOut("fast");
		});
	});
	
	/*Product listing select box*/
	jQuery('.catalog-ordering .orderby .current-li a').html(jQuery('.catalog-ordering .orderby ul li.current a').html());
	jQuery('.catalog-ordering .sort-count .current-li a').html(jQuery('.catalog-ordering .sort-count ul li.current a').html());

//  jQuery(".box-newsletter").center();

var mobileHover = function () {
    $('*').on('touchstart', function () {
        $(this).trigger('hover');
    }).on('touchend', function () {
        $(this).trigger('hover');
    });
};

mobileHover();

    jQuery('.product-categories')
        .find('li:gt(4)') //you want :gt(4) since index starts at 0 and H3 is not in LI
        .hide()
        .end()
        .each(function(){
            if($(this).children('li').length > 4){ //iterates over each UL and if they have 5+ LIs then adds Show More...
                $(this).append(
                    $('<li><a>See more   +</a></li>')
                        .addClass('showMore')
                        .click(function(){
                            if($(this).siblings(':hidden').length > 0){
                                $(this).html('<a>See less   -</a>').siblings(':hidden').show(400);
                            }else{
                                $(this).html('<a>See more   +</a>').show().siblings('li:gt(4)').hide(400);
                            }
                        })
                );
            }
        });
    
		/* brand view more */
		$('.bran2-layout-slider').each(function(){
			var this_target = $(this).find( 'ul.bran2' );
			var brand_number = $(this).data( 'number' ) - 1;
			var brand_target = $(this).find( '.block-title > a' );
			$(this).find('li:gt(' + brand_number +')') //you want :gt(4) since index starts at 0 and H3 is not in LI
        .hide()
        .end();        
			if( this_target.children('li').length > brand_number ){ 
				brand_target.click(function(){
					if(this_target.children('li').siblings(':hidden').length > 0){
							this_target.children('li').siblings(':hidden').show(400);
					}
				});
			}
			var el = $(this);
			setTimeout(function(){
				el.removeClass("loading");
			}, 1000);
		});


		/*Form search iP*/
    jQuery('a.phone-icon-menu').click(function(){
       var temp = jQuery('.navbar-inner.navbar-inverse').toggle( "slide" );
	   $(this).toggleClass('active');
    });
	$('.ya-tooltip').tooltip();
	// fix accordion heading state
	$('.accordion-heading').each(function(){
		var $this = $(this), $body = $this.siblings('.accordion-body');
		if (!$body.hasClass('in')){
			$this.find('.accordion-toggle').addClass('collapsed');
		}
	});
	

	// twice click
	$(document).on('click.twice', '.open [data-toggle="dropdown"]', function(e){
		var $this = $(this), href = $this.attr('href');
		e.preventDefault();
		window.location.href = href;
		return false;
	});

    $('#cpanel').collapse();

    $('#cpanel-reset').on('click', function(e) {

    	if (document.cookie && document.cookie != '') {
    		var split = document.cookie.split(';');
    		for (var i = 0; i < split.length; i++) {
    			var name_value = split[i].split("=");
    			name_value[0] = name_value[0].replace(/^ /, '');

    			if (name_value[0].indexOf(cpanel_name)===0) {
    				$.cookie(name_value[0], 1, { path: '/', expires: -1 });
    			}
    		}
    	}

    	location.reload();
    });

	$('#cpanel-form').on('submit', function(e){
		var $this = $(this), data = $this.data(), values = $this.serializeArray();

		var checkbox = $this.find('input:checkbox');
		$.each(checkbox, function() {

			if( !$(this).is(':checked') ) {
				name = $(this).attr('name');
				name = name.replace(/([^\[]*)\[(.*)\]/g, '$1_$2');

				$.cookie( name , 0, { path: '/', expires: 7 });
			}

		})

		$.each(values, function(){
			var $nvp = this;
			var name = $nvp.name;
			var value = $nvp.value;

			if ( !(name.indexOf(cpanel_name + '[')===0) ) return ;

			//console.log('name: ' + name + ' -> value: ' +value);
			name = name.replace(/([^\[]*)\[(.*)\]/g, '$1_$2');

			$.cookie( name , value, { path: '/', expires: 7 });

		});

		location.reload();

		return false;

	});

	$('a[href="#cpanel-form"]').on( 'click', function(e) {
		var parent = $('#cpanel-form'), right = parent.css('right'), width = parent.width();

		if ( parseFloat(right) < -10 ) {
			parent.animate({
				right: '0px',
			}, "slow");
		} else {
			parent.animate({
				right: '-' + width ,
			}, "slow");
		}

		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active');
		} else $(this).addClass('active');

		e.preventDefault();
	});

/*currency Selectbox*/
	$('.currency_switcher li a').click(function(){
		$current = $(this).attr('data-currencycode');
		jQuery('.currency_w > li > a').html($current);
	});
	
	$(document).ready(function(){
		/* Quickview */
		$('.fancybox').fancybox({
			'width'     : 800,
			'height'   : 600,
			'autoSize' : false,
			helpers:  {
				title:  null
			},
			afterShow: function() {
				$( '.quickview-container .product-images' ).each(function(){
					var $id = this.id;
					var $rtl = $('body').hasClass( 'rtl' );
					var $img_slider = $( '#' + $id + ' .product-responsive');
					var $thumb_slider = $( '#' + $id + ' .product-responsive-thumbnail' )
					$img_slider.slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						fade: true,
						arrows: false,
						rtl: $rtl,
						asNavFor: $thumb_slider
					});
					$thumb_slider.slick({
						slidesToShow: 3,
						slidesToScroll: 1,
						asNavFor: $img_slider,
						arrows: true,
						focusOnSelect: true,
						rtl: $rtl,
						responsive: [				
							{
							  breakpoint: 360,
							  settings: {
								slidesToShow: 2    
							  }
							}
						  ]
					});

					var el = $(this);
					setTimeout(function(){
						el.removeClass("loading");
					}, 1000);
				});
			}
		});
		/* Slider Image */
		$( '.product-images' ).each(function(){
			var $id 			= this.id;
			var $rtl 			= $(this).data('rtl');
			var $vertical		= $(this).data('vertical');
			var $img_slider 	= $( '#' + $id + ' .product-responsive');
			var $thumb_slider 	= $( '#' + $id + ' .product-responsive-thumbnail' );
			$img_slider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				fade: true,
				arrows: false,
				rtl: $rtl,
				asNavFor: $thumb_slider
			});
			$thumb_slider.slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				asNavFor: $img_slider,
				arrows: true,
				focusOnSelect: true,
				rtl: $rtl,
				vertical: $vertical,
				verticalSwiping: $vertical,
				responsive: [				
					{
					  breakpoint: 360,
					  settings: {
						slidesToShow: 2    
					  }
					}
				  ]
			});

			var el = $(this);
			setTimeout(function(){
				el.removeClass("loading");
			}, 1000);
		});
	});
/*lavalamp*/
	$.fn.lavalamp = function(options){
		var defaults = {
    			elm_class: 'active',
				durations: 400
 		    },
            settings = $.extend(defaults, options);
		this.each( function(){
			var elm = ('> li');
			var current_check = $(elm, this).hasClass( settings.elm_class );
			current = elm + '.' + settings.elm_class;
			if( current_check ){
				var $this=jQuery(this), left0 = $(this).offset().left, dleft0 = $(current, this).offset().left - left0, dwidth0 = $('>ul>li.active', this).width();
				$(this).append('<div class="floatr"></div>');
				var $lava = jQuery('.floatr', $this), move = function(l, w){
					$lava.stop().animate({
						left: l,
						width: w
					}, {
						duration: settings.durations,
						easing: 'linear'
					});
				};
				
				var $li = jQuery('>li', this);
				//console.log( $li );
				// 1st time
				
				move(dleft0, dwidth0);
				$lava.show();
				$li.hover(function(e){
					var dleft = $(this).offset().left - left0;
					var dwidth = $(this).width();
					//console.log(dleft);
					move(dleft, dwidth);
				}, function(e){
					move(dleft0, dwidth0);
				});	
			}
		});
	}
	jQuery(document).ready(function(){
		var currency_show = jQuery('ul.currency_switcher li a.active').html();
		jQuery('.currency_to_show').html(currency_show);	
	}); 
/*end lavalamp*/
	jQuery(function($){
	// back to top
	$("#ya-totop").hide();
	$(function () {
		var wh = $(window).height();
		var whtml = $(document).height();
		$(window).scroll(function () {
			if ($(this).scrollTop() > whtml/10) {
					$('#ya-totop').fadeIn();
				} else {
					$('#ya-totop').fadeOut();
				}
			});
		$('#ya-totop').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
			});
	});
	// end back to top
	}); 

	/*currency Selectbox*/
	$('.currency_switcher li a').on('click', function(){
		var $current = $(this).attr('data-currencycode');
		jQuery('.currency_w > li > a').html($current);
	});
	/*language*/
	var $current ='';
	$('#lang_sel ul > li > ul li a').on('click',function(){
		 //console.log($(this).html());
		 $current = $(this).html();
		 $('#lang_sel ul > li > a.lang_sel_sel').html($current);
		 $a = $.cookie('lang_select_maxshop', $current, { expires: 1, path: '/'}); 
		});
	if( $.cookie('lang_select_maxshop') && $.cookie('lang_select_maxshop').length > 0 ) {
		$('#lang_sel ul > li > a.lang_sel_sel').html($.cookie('lang_select_maxshop'));
	}

	$('#lang_sel ul > li.icl-ar').click(function(){
		$('#lang_sel ul > li.icl-en').removeClass( 'active' );
		$(this).addClass( 'active' );
		$.cookie( 'sportbikes_lang_en' , 1, { path: '/', expires: 1 });
	});
	$('#lang_sel ul > li.icl-en').click(function(){
		$('#lang_sel ul > li.icl-ar').removeClass( 'active' );
		$(this).addClass( 'active' );
		$.cookie( 'sportbikes_lang_en' , 0, { path: '/', expires: -1 });
	});

	var Sportbikes_Lang = $.cookie( 'sportbikes_lang_en' );
	if( Sportbikes_Lang == null ){
		$('#lang_sel ul > li.icl-en').addClass( 'active' );
		$('#lang_sel ul > li.icl-ar').removeClass( 'active' );
	}else{
		$('#lang_sel ul > li.icl-en').removeClass( 'active' );
		$('#lang_sel ul > li.icl-ar').addClass( 'active' );
	}

	
	$('#lang_sel ul > li > a').click(function(){
		$('#lang_sel ul > li ul').slideToggle(); 
	});
	var $current ='';
	$('#lang_sel ul > li > ul li a').on('click',function(){
		$current = $(this).html();
		$('#lang_sel ul > li > a.lang_sel_sel').html($current);
		var $a = $.cookie('lang_select_maxshop', $current, { expires: 1, path: '/'});	
	});
	if( $.cookie('lang_select_maxshop') && $.cookie('lang_select_maxshop').length > 0 ) {
		$('#lang_sel ul > li > a.lang_sel_sel').html($.cookie('lang_select_maxshop'));
	}
	jQuery(document).ready(function(){
		jQuery('.wpcf7-form-control-wrap').hover(function(){
			$(this).find('.wpcf7-not-valid-tip').css('display', 'none');
		});
	});

	 // fix js
	$('.wpb_map_wraper').click(function () {
		$('.wpb_map_wraper iframe').css("pointer-events", "auto");
	});

	$( ".wpb_map_wraper" ).mouseleave(function() {
		$('.wpb_map_wraper iframe').css("pointer-events", "none"); 
	});
	$('#myTabs a').hover(function (e) {
		e.preventDefault();
		$(this).tab('show');
		$("li.menu-electronics").removeClass("active");
	     //removing active class from other selected/default tab
	    $("#myTabs .active").removeClass("active");

	    //adding active class to current clicked tab
	    $(this).parent().addClass("active");
	});

	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	});
	/* Fix 2.1.0 */
	
	/* Header 4 */
	$('.phone-icon-category').on( 'click', function(){
		$( '.header-style4 .vertical_megamenu-header' ).toggle( 'slide' );
	});

	/* Header 4 */
	$('.phone-icon-category').on( 'click', function(){
		$( '.header-style6 .vertical_megamenu-header' ).toggle( 'slide' );
	});

	/* Header 4 */
	$('.phone-icon-category').on( 'click', function(){
		$( '.header-style8 .vertical_megamenu-header' ).toggle( 'slide' );
	});

	/*Search*/
	$(".sidebar-top-header .icon-search").click(function(){
		$(".sidebar-top-header .top-search").fadeToggle();
	});

	/*Heading toggle*/
	$(".sw-woo-tab .resp-tab .top-tab-listing .navbar-toggle").click(function(){
		$(".sw-woo-tab .resp-tab .top-tab-listing .nav-tabs").fadeToggle();
	});

	/*Heading chilcat*/
	$(".sw-woo-container-slider .category-wrap-cat .navbar-toggle").click(function(){
		$(".sw-woo-container-slider .category-wrap-cat .cat-list").fadeToggle();
	});

	
}(jQuery));
// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/megamenu.js 
(function($){
	$.fn.megamenu = function(options) {
		options = jQuery.extend({
			  wrap:'.nav-mega',
			  speed: 300,
			  justify: "",
			  rtl: false,
			  mm_timeout: 200
		  }, options);
		var menuwrap = $(this);
		buildmenu(menuwrap);
		/* Build menu */
		console.log(menuwrap);
		function buildmenu(mwrap){
			mwrap.find('li').each(function(){				
				var menucontent 		= $(this).find(".dropdown-menu");
				var menuitemlink 		= $(this).find(".item-link:first");
		    	var menucontentinner 	= $(this).find(".nav-level1");
		    	var mshow_timer = 0;
		    	var mhide_timer = 0;
		     	var li = $(this);
		     	var islevel1 = (li.hasClass('level1'))?true:false;
				var havechild = (li.hasClass('dropdown'))?true:false;
				if(menucontent){
		     		menucontent.hide();
		     	}
				li.mouseenter(function(el){
					el.stopPropagation();
					clearTimeout(mhide_timer);
					clearTimeout(mshow_timer);
					addHover(li);
					if(havechild){
						positionSubMenu(li, islevel1);
						mshow_timer = setTimeout(function(){ //Emulate HoverIntent					
							showSubMenu(li, menucontent, menucontentinner);
						}, options.mm_timeout);	
					}
				}).mouseleave(function(el){ //return;
					clearTimeout(mshow_timer);
					clearTimeout(mhide_timer);
					if(havechild){
						mhide_timer = setTimeout(function(){ /*Emulate HoverIntent*/					
							hideSubMenu(li, menucontent, menucontentinner);
						}, options.mm_timeout);	

						/*hideSubMenu(li, menucontent, menucontentinner);*/
					}
					removeHover(li);
			    });
			});
		}
		// Show Submenu
		function showSubMenu(li, mcontent, mcontentinner){		
			mcontentinner.animate({
				  opacity: 1
				}, 100, function() {
			});
			mcontent.css('opacity','1').stop(true, true).slideDown({ duration: options.speed});
		}
		// Hide Submenu
		function hideSubMenu(li, mcontent, mcontentinner){
			mcontentinner.animate({
				  opacity: 0
				}, 2*options.mm_timeout, function() {
			});
			mcontent.slideUp({ duration: options.mm_timeout});
		}
		// Add class hover to li
		function addHover(el){
			$(el).addClass('hover');
			
		}
		// Remove class hover to li
		function removeHover(el){
			$(el).removeClass('hover');
		}
		// Position Submenu
		function positionSubMenu(el, islevel1){
			menucontent 		= $(el).find(".dropdown-menu");
			menuitemlink 		= $(el).find(".item-link");
	    	menucontentinner 	= $(el).find(".nav-level1");
	    	wrap_O				= ( options.rtl == false ) ? menuwrap.offset().left : ( $(window).width() - (menuwrap.offset().left + menuwrap.outerWidth()) );
	    	wrap_W				= menuwrap.outerWidth();
	    	menuitemli_O		= ( options.rtl == false ) ? menuitemlink.parent('li').offset().left : ( $(window).width() - (menuitemlink.parent('li').offset().left + menuitemlink.parent('li').outerWidth()) );
	    	menuitemli_W		= menuitemlink.parent('li').outerWidth();
	    	menuitemlink_H		= menuitemlink.outerHeight();
	    	menuitemlink_W		= menuitemlink.outerWidth();
	    	menuitemlink_O		= ( options.rtl == false ) ? menuitemlink.offset().left : ( $(window).width() - (menuitemlink.offset().left + menuitemlink.outerWidth()) );
	    	menucontent_W		= menucontent.outerWidth();
			
			if (islevel1) { 
				if( options.rtl == false ){
					menucontent.css({
						'top': menuitemlink_H + "px",
						'left': menuitemlink_O - menuitemli_O + 'px'
					})
				}else{
					menucontent.css({
						'top': menuitemlink_H + "px",
						'right': menuitemlink_O - menuitemli_O + 'px'
					})
				}
				
				if(options.justify == "left"){
					var wrap_RE = wrap_O + wrap_W;

					var menucontent_RE = menuitemlink_O + menucontent_W;
					
					if( menucontent_RE >= wrap_RE ) { 
						if( options.rtl == false ){
							menucontent.css({
								'left':wrap_RE - menucontent_RE + menuitemlink_O - menuitemli_O + 'px'
							}); 
						}else{
							menucontent.css({
								'left': 'auto',
								'right':wrap_RE - menucontent_RE + menuitemlink_O - menuitemli_O + 'px'
							});
						}
					}
				} else if( options.justify == "right" ) {
					var wrap_LE = wrap_O;
											// Coordinates of the left end of the megamenu object
					var menucontent_LE = menuitemlink_O - menucontent_W + menuitemlink_W;
											// Coordinates of the left end of the megamenu content
					if( menucontent_LE <= wrap_LE ) { // Menu content exceeding the outer box
						menucontent.css({
							'left': wrap_O
							- (menuitemli_O - menuitemlink_O) 
							- menuitemlink_O + 'px'
						}); // Limit megamenu inside the outer box
					} else {
						menucontent.css({
							'left':  menuitemlink_W
							+ (menuitemlink_O - menuitemli_O) 
							- menucontent_W + 'px'
						}); // Limit megamenu inside the outer box
					}
				}
			}else{
				_leftsub = 0;
				menucontent.css({
					'top': menuitemlink_H*0 +"px",
					'left': menuitemlink_W + _leftsub + 'px'
				})
				
				if(options.justify == "left"){
					var wrap_RE = wrap_O + wrap_W;
					var menucontent_RE = menuitemli_O + menuitemli_W + _leftsub + menucontent_W;
											
					if( menucontent_RE >= wrap_RE ) { 
						menucontent.css({
							'left': _leftsub - menucontent_W + 'px'
						}); 
					}
				} else if( options.justify == "right" ) {
					var wrap_LE = wrap_O;
					
					var menucontent_LE = menuitemli_O - menucontent_W + _leftsub;
											
					if( menucontent_LE <= wrap_LE ) { // Menu content exceeding the outer box
						menucontent.css({
							'left': menuitemli_W - _leftsub + 'px'
						}); // Limit megamenu inside the outer box
					} else {
						menucontent.css({
							'left':  - _leftsub - menucontent_W + 'px'
						}); // Limit megamenu inside the outer box
					}
				}
			}
		}
	};
	jQuery(function($){
		$rtl = $('body').hasClass('rtl');
		$(document).ready(function(){
			$('#primary-menu .mid-header').megamenu({ 
				'wrap':'.nav-mega',
				'justify' : 'left',
				'rtl': $rtl
			});
		});
	});
})(jQuery);
// source --> https://www.vensera.com/wp-includes/js/wp-embed.min.js 
!function(a,b){"use strict";function c(){if(!e){e=!0;var a,c,d,f,g=-1!==navigator.appVersion.indexOf("MSIE 10"),h=!!navigator.userAgent.match(/Trident.*rv:11\./),i=b.querySelectorAll("iframe.wp-embedded-content");for(c=0;c<i.length;c++){if(d=i[c],!d.getAttribute("data-secret"))f=Math.random().toString(36).substr(2,10),d.src+="#?secret="+f,d.setAttribute("data-secret",f);if(g||h)a=d.cloneNode(!0),a.removeAttribute("security"),d.parentNode.replaceChild(a,d)}}}var d=!1,e=!1;if(b.querySelector)if(a.addEventListener)d=!0;if(a.wp=a.wp||{},!a.wp.receiveEmbedMessage)if(a.wp.receiveEmbedMessage=function(c){var d=c.data;if(d.secret||d.message||d.value)if(!/[^a-zA-Z0-9]/.test(d.secret)){var e,f,g,h,i,j=b.querySelectorAll('iframe[data-secret="'+d.secret+'"]'),k=b.querySelectorAll('blockquote[data-secret="'+d.secret+'"]');for(e=0;e<k.length;e++)k[e].style.display="none";for(e=0;e<j.length;e++)if(f=j[e],c.source===f.contentWindow){if(f.removeAttribute("style"),"height"===d.message){if(g=parseInt(d.value,10),g>1e3)g=1e3;else if(~~g<200)g=200;f.height=g}if("link"===d.message)if(h=b.createElement("a"),i=b.createElement("a"),h.href=f.getAttribute("src"),i.href=d.value,i.host===h.host)if(b.activeElement===f)a.top.location.href=d.value}else;}},d)a.addEventListener("message",a.wp.receiveEmbedMessage,!1),b.addEventListener("DOMContentLoaded",c,!1),a.addEventListener("load",c,!1)}(window,document);
// source --> https://www.vensera.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js 
function vc_js(){vc_toggleBehaviour(),vc_tabsBehaviour(),vc_accordionBehaviour(),vc_teaserGrid(),vc_carouselBehaviour(),vc_slidersBehaviour(),vc_prettyPhoto(),vc_googleplus(),vc_pinterest(),vc_progress_bar(),vc_plugin_flexslider(),vc_google_fonts(),vc_gridBehaviour(),vc_rowBehaviour(),vc_googleMapsPointer(),vc_ttaActivation(),jQuery(document).trigger("vc_js"),window.setTimeout(vc_waypoints,500)}function getSizeName(){var a=jQuery(window).width();return 1170<a?"desktop_wide":960<a&&1169>a?"desktop":768<a&&959>a?"tablet":300<a&&767>a?"mobile":300>a?"mobile_portrait":""}function loadScript(a,b,c){var d=document.createElement("script");d.type="text/javascript",d.readyState&&(d.onreadystatechange=function(){"loaded"!==d.readyState&&"complete"!==d.readyState||(d.onreadystatechange=null,c())}),d.src=a,b.get(0).appendChild(d)}function vc_ttaActivation(){jQuery("[data-vc-accordion]").on("show.vc.accordion",function(a){var b=window.jQuery,c={};c.newPanel=b(this).data("vc.accordion").getTarget(),window.wpb_prepare_tab_content(a,c)})}function vc_accordionActivate(a,b){if(b.newPanel.length&&b.newHeader.length){var c=b.newPanel.find(".vc_pie_chart:not(.vc_ready)"),d=b.newPanel.find(".vc_round-chart"),e=b.newPanel.find(".vc_line-chart"),f=b.newPanel.find('[data-ride="vc_carousel"]');"undefined"!=typeof jQuery.fn.isotope&&b.newPanel.find(".isotope, .wpb_image_grid_ul").isotope("layout"),b.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&b.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var a=jQuery(this).data("vcGrid");a&&a.gridBuilder&&a.gridBuilder.setMasonry&&a.gridBuilder.setMasonry()}),vc_carouselBehaviour(b.newPanel),vc_plugin_flexslider(b.newPanel),c.length&&jQuery.fn.vcChat&&c.vcChat(),d.length&&jQuery.fn.vcRoundChart&&d.vcRoundChart({reload:!1}),e.length&&jQuery.fn.vcLineChart&&e.vcLineChart({reload:!1}),f.length&&jQuery.fn.carousel&&f.carousel("resizeAction"),b.newPanel.parents(".isotope").length&&b.newPanel.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}}function initVideoBackgrounds(){return window.console&&window.console.warn&&window.console.warn("this function is deprecated use vc_initVideoBackgrounds"),vc_initVideoBackgrounds()}function vc_initVideoBackgrounds(){jQuery("[data-vc-video-bg]").each(function(){var a,b,c=jQuery(this);c.data("vcVideoBg")?(a=c.data("vcVideoBg"),b=vcExtractYoutubeId(a),b&&(c.find(".vc_video-bg").remove(),insertYoutubeVideoAsBackground(c,b)),jQuery(window).on("grid:items:added",function(a,b){c.has(b).length&&vcResizeVideoBackground(c)})):c.find(".vc_video-bg").remove()})}function insertYoutubeVideoAsBackground(a,b,c){if("undefined"==typeof YT||"undefined"==typeof YT.Player)return c="undefined"==typeof c?0:c,100<c?void console.warn("Too many attempts to load YouTube api"):void setTimeout(function(){insertYoutubeVideoAsBackground(a,b,c++)},100);var d=a.prepend('<div class="vc_video-bg vc_hidden-xs"><div class="inner"></div></div>').find(".inner");new YT.Player(d[0],{width:"100%",height:"100%",videoId:b,playerVars:{playlist:b,iv_load_policy:3,enablejsapi:1,disablekb:1,autoplay:1,controls:0,showinfo:0,rel:0,loop:1,wmode:"transparent"},events:{onReady:function(a){a.target.mute().setLoop(!0)}}}),vcResizeVideoBackground(a),jQuery(window).bind("resize",function(){vcResizeVideoBackground(a)})}function vcResizeVideoBackground(a){var b,c,d,e,f=a.innerWidth(),g=a.innerHeight(),h=16,i=9;f/g<h/i?(b=g*(h/i),c=g,d=-Math.round((b-f)/2)+"px",e=-Math.round((c-g)/2)+"px",b+="px",c+="px"):(b=f,c=f*(i/h),e=-Math.round((c-g)/2)+"px",d=-Math.round((b-f)/2)+"px",b+="px",c+="px"),a.find(".vc_video-bg iframe").css({maxWidth:"1000%",marginLeft:d,marginTop:e,width:b,height:c})}function vcExtractYoutubeId(a){if("undefined"==typeof a)return!1;var b=a.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);return null!==b&&b[1]}function vc_googleMapsPointer(){var a=window.jQuery,b=a(".wpb_gmaps_widget");b.click(function(){a("iframe",this).css("pointer-events","auto")}),b.mouseleave(function(){a("iframe",this).css("pointer-events","none")}),a(".wpb_gmaps_widget iframe").css("pointer-events","none")}document.documentElement.className+=" js_active ",document.documentElement.className+="ontouchstart"in document.documentElement?" vc_mobile ":" vc_desktop ",function(){for(var a=["-webkit-","-moz-","-ms-","-o-",""],b=0;b<a.length;b++)a[b]+"transform"in document.documentElement.style&&(document.documentElement.className+=" vc_transform ")}(),"function"!=typeof window.vc_plugin_flexslider&&(window.vc_plugin_flexslider=function(a){var b=a?a.find(".wpb_flexslider"):jQuery(".wpb_flexslider");b.each(function(){var a=jQuery(this),b=800,c=1e3*parseInt(a.attr("data-interval")),d=a.attr("data-flex_fx"),e=!0;0===c&&(e=!1),a.is(":visible")&&a.flexslider({animation:d,slideshow:e,slideshowSpeed:c,sliderSpeed:b,smoothHeight:!0})})}),"function"!=typeof window.vc_googleplus&&(window.vc_googleplus=function(){0<jQuery(".wpb_googleplus").length&&!function(){var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="//apis.google.com/js/plusone.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()}),"function"!=typeof window.vc_pinterest&&(window.vc_pinterest=function(){0<jQuery(".wpb_pinterest").length&&!function(){var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="//assets.pinterest.com/js/pinit.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()}),"function"!=typeof window.vc_progress_bar&&(window.vc_progress_bar=function(){"undefined"!=typeof jQuery.fn.waypoint&&jQuery(".vc_progress_bar").waypoint(function(){jQuery(this).find(".vc_single_bar").each(function(a){var b=jQuery(this),c=b.find(".vc_bar"),d=c.data("percentage-value");setTimeout(function(){c.css({width:d+"%"})},200*a)})},{offset:"85%"})}),"function"!=typeof window.vc_waypoints&&(window.vc_waypoints=function(){"undefined"!=typeof jQuery.fn.waypoint&&jQuery(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").waypoint(function(){jQuery(this).addClass("wpb_start_animation animated")},{offset:"85%"})}),"function"!=typeof window.vc_toggleBehaviour&&(window.vc_toggleBehaviour=function(a){function b(a){a&&a.preventDefault&&a.preventDefault();var b=jQuery(this),c=b.closest(".vc_toggle"),d=c.find(".vc_toggle_content");c.hasClass("vc_toggle_active")?d.slideUp({duration:300,complete:function(){c.removeClass("vc_toggle_active")}}):d.slideDown({duration:300,complete:function(){c.addClass("vc_toggle_active")}})}a?a.hasClass("vc_toggle_title")?a.unbind("click").click(b):a.find(".vc_toggle_title").unbind("click").click(b):jQuery(".vc_toggle_title").unbind("click").on("click",b)}),"function"!=typeof window.vc_tabsBehaviour&&(window.vc_tabsBehaviour=function(a){if(jQuery.ui){var b=a||jQuery(".wpb_tabs, .wpb_tour"),c=jQuery.ui&&jQuery.ui.version?jQuery.ui.version.split("."):"1.10",d=1===parseInt(c[0])&&9>parseInt(c[1]);b.each(function(a){var b,c=jQuery(this).attr("data-interval"),e=[];if(b=jQuery(this).find(".wpb_tour_tabs_wrapper").tabs({show:function(a,b){wpb_prepare_tab_content(a,b)},beforeActivate:function(a,b){1!==b.newPanel.index()&&b.newPanel.find(".vc_pie_chart:not(.vc_ready)")},activate:function(a,b){wpb_prepare_tab_content(a,b)}}),c&&0<c)try{b.tabs("rotate",1e3*c)}catch(a){window.console&&window.console.log&&console.log(a)}jQuery(this).find(".wpb_tab").each(function(){e.push(this.id)}),jQuery(this).find(".wpb_tabs_nav li").click(function(a){return a.preventDefault(),d?b.tabs("select",jQuery("a",this).attr("href")):b.tabs("option","active",jQuery(this).index()),!1}),jQuery(this).find(".wpb_prev_slide a, .wpb_next_slide a").click(function(a){if(a.preventDefault(),d){var c=b.tabs("option","selected");jQuery(this).parent().hasClass("wpb_next_slide")?c++:c--,0>c?c=b.tabs("length")-1:c>=b.tabs("length")&&(c=0),b.tabs("select",c)}else{var c=b.tabs("option","active"),e=b.find(".wpb_tab").length;c=jQuery(this).parent().hasClass("wpb_next_slide")?c+1>=e?0:c+1:0>c-1?e-1:c-1,b.tabs("option","active",c)}})})}}),"function"!=typeof window.vc_accordionBehaviour&&(window.vc_accordionBehaviour=function(){jQuery(".wpb_accordion").each(function(a){var b,c=jQuery(this),d=(c.attr("data-interval"),!isNaN(jQuery(this).data("active-tab"))&&0<parseInt(c.data("active-tab"))&&parseInt(c.data("active-tab"))-1),e=!1===d||"yes"===c.data("collapsible");b=c.find(".wpb_accordion_wrapper").accordion({header:"> div > h3",autoHeight:!1,heightStyle:"content",active:d,collapsible:e,navigation:!0,activate:vc_accordionActivate,change:function(a,b){"undefined"!=typeof jQuery.fn.isotope&&b.newContent.find(".isotope").isotope("layout"),vc_carouselBehaviour(b.newPanel)}}),!0===c.data("vcDisableKeydown")&&(b.data("uiAccordion")._keydown=function(){})})}),"function"!=typeof window.vc_teaserGrid&&(window.vc_teaserGrid=function(){var a={fitrows:"fitRows",masonry:"masonry"};jQuery(".wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)").each(function(){var b=jQuery(this),c=b.find(".wpb_thumbnails"),d=c.attr("data-layout-mode");c.isotope({itemSelector:".isotope-item",layoutMode:"undefined"==typeof a[d]?"fitRows":a[d]}),b.find(".categories_filter a").data("isotope",c).click(function(a){a.preventDefault();var b=jQuery(this).data("isotope");jQuery(this).parent().parent().find(".active").removeClass("active"),jQuery(this).parent().addClass("active"),b.isotope({filter:jQuery(this).attr("data-filter")})}),jQuery(window).bind("load resize",function(){c.isotope("layout")})})}),"function"!=typeof window.vc_carouselBehaviour&&(window.vc_carouselBehaviour=function(a){var b=a?a.find(".wpb_carousel"):jQuery(".wpb_carousel");b.each(function(){var a=jQuery(this);if(!0!==a.data("carousel_enabled")&&a.is(":visible")){a.data("carousel_enabled",!0);var b=(getColumnsCount(jQuery(this)),500);jQuery(this).hasClass("columns_count_1")&&(b=900);var c=jQuery(this).find(".wpb_thumbnails-fluid li");c.css({"margin-right":c.css("margin-left"),"margin-left":0});var d=jQuery(this).find("ul.wpb_thumbnails-fluid");d.width(d.width()+300),jQuery(window).resize(function(){var a=screen_size;screen_size=getSizeName(),a!=screen_size&&window.setTimeout("location.reload()",20)})}})}),"function"!=typeof window.vc_slidersBehaviour&&(window.vc_slidersBehaviour=function(){jQuery(".wpb_gallery_slides").each(function(a){var b,c=jQuery(this);if(c.hasClass("wpb_slider_nivo")){var d=800,e=1e3*c.attr("data-interval");0===e&&(e=9999999999),c.find(".nivoSlider").nivoSlider({effect:"boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse",slices:15,boxCols:8,boxRows:4,animSpeed:d,pauseTime:e,startSlide:0,directionNav:!0,directionNavHide:!0,controlNav:!0,keyboardNav:!1,pauseOnHover:!0,manualAdvance:!1,prevText:"Prev",nextText:"Next"})}else c.hasClass("wpb_image_grid")&&(jQuery.fn.imagesLoaded?b=c.find(".wpb_image_grid_ul").imagesLoaded(function(){b.isotope({itemSelector:".isotope-item",layoutMode:"fitRows"})}):c.find(".wpb_image_grid_ul").isotope({itemSelector:".isotope-item",layoutMode:"fitRows"}))})}),"function"!=typeof window.vc_prettyPhoto&&(window.vc_prettyPhoto=function(){try{jQuery&&jQuery.fn&&jQuery.fn.prettyPhoto&&jQuery('a.prettyphoto, .gallery-icon a[href*=".jpg"]').prettyPhoto({animationSpeed:"normal",hook:"data-rel",padding:15,opacity:.7,showTitle:!0,allowresize:!0,counter_separator_label:"/",hideflash:!1,deeplinking:!1,modal:!1,callback:function(){var a=location.href,b=!!a.indexOf("#!prettyPhoto");b&&(location.hash="")},social_tools:""})}catch(a){window.console&&window.console.log&&console.log(a)}}),"function"!=typeof window.vc_google_fonts&&(window.vc_google_fonts=function(){return!1}),window.vcParallaxSkroll=!1,"function"!=typeof window.vc_rowBehaviour&&(window.vc_rowBehaviour=function(){function a(){var a=e('[data-vc-full-width="true"]');e.each(a,function(a,b){var c=e(this);c.addClass("vc_hidden");var d=c.next(".vc_row-full-width");if(d.length||(d=c.parent().next(".vc_row-full-width")),d.length){var f=parseInt(c.css("margin-left"),10),g=parseInt(c.css("margin-right"),10),h=0-d.offset().left-f,i=e(window).width(),j=e("body").hasClass("rtl");if(0==j?c.css({position:"relative",left:h,"box-sizing":"border-box",width:e(window).width()}):c.css({position:"relative",left:"auto",right:h,"box-sizing":"border-box",width:e(window).width()}),!c.data("vcStretchContent")){var k=-1*h;0>k&&(k=0);var l=i-k-d.width()+f+g;0>l&&(l=0),c.css({"padding-left":k+"px","padding-right":l+"px"})}c.attr("data-vc-full-width-init","true"),c.removeClass("vc_hidden"),e(document).trigger("vc-full-width-row-single",{el:c,offset:h,marginLeft:f,marginRight:g,elFull:d,width:i})}}),e(document).trigger("vc-full-width-row",a)}function b(){var a,b=!1;return window.vcParallaxSkroll&&window.vcParallaxSkroll.destroy(),e(".vc_parallax-inner").remove(),e("[data-5p-top-bottom]").removeAttr("data-5p-top-bottom data-30p-top-bottom"),e("[data-vc-parallax]").each(function(){var a,c,d,f,g,h,i;b=!0,"on"===e(this).data("vcParallaxOFade")&&e(this).children().attr("data-5p-top-bottom","opacity:0;").attr("data-30p-top-bottom","opacity:1;"),c=100*e(this).data("vcParallax"),g=e("<div />").addClass("vc_parallax-inner").appendTo(e(this)),g.height(c+"%"),h=e(this).data("vcParallaxImage"),i=vcExtractYoutubeId(h),i?insertYoutubeVideoAsBackground(g,i):"undefined"!=typeof h&&g.css("background-image","url("+h+")"),a=c-100,d=-a,f=0,g.attr("data-bottom-top","top: "+d+"%;").attr("data-top-bottom","top: "+f+"%;")}),!(!b||!window.skrollr)&&(a={forceHeight:!1,smoothScrolling:!1,mobileCheck:function(){return!1}},window.vcParallaxSkroll=skrollr.init(a),window.vcParallaxSkroll)}function c(){var a=e(".vc_row-o-full-height:first");if(a.length){var b,c,d,f;b=e(window),c=b.height(),d=a.offset().top,d<c&&(f=100-d/(c/100),a.css("min-height",f+"vh"))}e(document).trigger("vc-full-height-row",a)}function d(){var a=window.navigator.userAgent,b=a.indexOf("MSIE ");(b>0||navigator.userAgent.match(/Trident.*rv\:11\./))&&e(".vc_row-o-full-height").each(function(){"flex"===e(this).css("display")&&e(this).wrap('<div class="vc_ie-flexbox-fixer"></div>')})}var e=window.jQuery;e(window).off("resize.vcRowBehaviour").on("resize.vcRowBehaviour",a).on("resize.vcRowBehaviour",c),a(),c(),d(),vc_initVideoBackgrounds(),b()}),"function"!=typeof window.vc_gridBehaviour&&(window.vc_gridBehaviour=function(){jQuery.fn.vcGrid&&jQuery("[data-vc-grid]").vcGrid()}),"function"!=typeof window.getColumnsCount&&(window.getColumnsCount=function(a){for(var b=!1,c=1;!1===b;){if(a.hasClass("columns_count_"+c))return b=!0,c;c++}});var screen_size=getSizeName();"function"!=typeof window.wpb_prepare_tab_content&&(window.wpb_prepare_tab_content=function(a,b){var c,d,e=b.panel||b.newPanel,f=e.find(".vc_pie_chart:not(.vc_ready)"),g=e.find(".vc_round-chart"),h=e.find(".vc_line-chart"),i=e.find('[data-ride="vc_carousel"]');if(vc_carouselBehaviour(),vc_plugin_flexslider(e),b.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&b.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var a=jQuery(this).data("vcGrid");a&&a.gridBuilder&&a.gridBuilder.setMasonry&&a.gridBuilder.setMasonry()}),e.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&e.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var a=jQuery(this).data("vcGrid");a&&a.gridBuilder&&a.gridBuilder.setMasonry&&a.gridBuilder.setMasonry()}),f.length&&jQuery.fn.vcChat&&f.vcChat(),g.length&&jQuery.fn.vcRoundChart&&g.vcRoundChart({reload:!1}),h.length&&jQuery.fn.vcLineChart&&h.vcLineChart({reload:!1}),i.length&&jQuery.fn.carousel&&i.carousel("resizeAction"),c=e.find(".isotope, .wpb_image_grid_ul"),d=e.find(".wpb_gmaps_widget"),0<c.length&&c.isotope("layout"),d.length&&!d.is(".map_ready")){var j=d.find("iframe");j.attr("src",j.attr("src")),d.addClass("map_ready")}e.parents(".isotope").length&&e.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}),"function"!=typeof window.vc_googleMapsPointer,jQuery(document).ready(function(a){window.vc_js()});