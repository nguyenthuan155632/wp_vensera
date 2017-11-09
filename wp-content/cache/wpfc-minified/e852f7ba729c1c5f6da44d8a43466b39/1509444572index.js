// source --> https://www.vensera.com/wp-content/plugins/yith-woocommerce-compare/assets/js/woocompare.min.js 
jQuery(document).ready(function(a){function b(a,b){a=escape(a),b=escape(b);var c=document.location.search,d=a+"="+b,e=new RegExp("(&|\\?)"+a+"=[^&]*");return c=c.replace(e,"$1"+d),RegExp.$1||(c+=(c.length>0?"&":"?")+d),c}a(document).on("click",".product a.compare:not(.added)",function(b){b.preventDefault();var c=a(this),d={action:yith_woocompare.actionadd,id:c.data("product_id"),context:"frontend"},e=a(".yith-woocompare-widget ul.products-list");"undefined"!=typeof a.fn.block&&(c.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),e.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}})),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionadd),data:d,dataType:"json",success:function(b){"undefined"!=typeof a.fn.block&&(c.unblock(),e.unblock()),c.addClass("added").attr("href",b.table_url).text(yith_woocompare.added_label),e.html(b.widget_table),"yes"==yith_woocompare.auto_open&&a("body").trigger("yith_woocompare_open_popup",{response:b.table_url,button:c})}})}),a(document).on("click",".product a.compare.added",function(b){b.preventDefault();var c=this.href;"undefined"!=typeof c&&a("body").trigger("yith_woocompare_open_popup",{response:c,button:a(this)})}),a("body").on("yith_woocompare_open_popup",function(b,c){var d=c.response;if(a(window).width()>=768)a.colorbox({href:d,iframe:!0,width:"90%",height:"90%",onClosed:function(){var b=a(".yith-woocompare-widget ul.products-list"),c={action:yith_woocompare.actionview,context:"frontend"};"undefined"!=typeof a.fn.block&&b.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionview),data:c,success:function(c){"undefined"!=typeof a.fn.block&&b.unblock().html(c),b.html(c)}})}}),a(window).resize(function(){a.colorbox.resize({width:"90%",height:"90%"})});else{var e=d.split("?"),f="iframe";if(e.length>=2){for(var g=encodeURIComponent(f)+"=",h=e[1].split(/[&;]/g),i=h.length;i-- >0;)h[i].lastIndexOf(g,0)!==-1&&h.splice(i,1);d=e[0]+"?"+h.join("&")}window.open(d,yith_woocompare.table_title)}}),a(document).on("click",".remove a",function(b){b.preventDefault();var c=a(this),d={action:yith_woocompare.actionremove,id:c.data("product_id"),context:"frontend"};a("td.product_"+d.id+", th.product_"+d.id);"undefined"!=typeof a.fn.block&&c.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionremove),data:d,dataType:"html",success:function(b){var d=a(b).filter("table.compare-list");a("body > table.compare-list").replaceWith(d),a('.compare[data-product_id="'+c.data("product_id")+'"]',window.parent.document).removeClass("added").html(yith_woocompare.button_text),a(window).trigger("yith_woocompare_product_removed")}})}),a(".yith-woocompare-open a, a.yith-woocompare-open").on("click",function(c){c.preventDefault(),a("body").trigger("yith_woocompare_open_popup",{response:b("action",yith_woocompare.actionview)+"&iframe=true"})}),a(".yith-woocompare-widget").on("click","a.compare",function(b){b.preventDefault(),a("body").trigger("yith_woocompare_open_popup",{response:a(this).attr("href")})}).on("click","li a.remove, a.clear-all",function(b){b.preventDefault();var c=a(".yith-woocompare-widget .products-list").data("lang"),d=a(this),e=d.data("product_id"),f={action:yith_woocompare.actionremove,id:e,context:"frontend",responseType:"product_list",lang:c},g=d.parents(".yith-woocompare-widget").find("ul.products-list");"undefined"!=typeof a.fn.block&&g.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionremove),data:f,dataType:"html",success:function(b){"all"==e?a(".compare.added").removeClass("added").html(yith_woocompare.button_text):a('.compare[data-product_id="'+e+'"]').removeClass("added").html(yith_woocompare.button_text),g.html(b),"undefined"!=typeof a.fn.block&&g.unblock()}})})});
// source --> https://www.vensera.com/wp-content/plugins/yith-woocommerce-compare/assets/js/jquery.colorbox-min.js 
/*!
	Colorbox v1.5.10 - 2014-06-26
	jQuery lightbox and modal window plugin
	(c) 2014 Jack Moore - http://www.jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(t,e,i){function n(i,n,o){var r=e.createElement(i);return n&&(r.id=Z+n),o&&(r.style.cssText=o),t(r)}function o(){return i.innerHeight?i.innerHeight:t(i).height()}function r(e,i){i!==Object(i)&&(i={}),this.cache={},this.el=e,this.value=function(e){var n;return void 0===this.cache[e]&&(n=t(this.el).attr("data-cbox-"+e),void 0!==n?this.cache[e]=n:void 0!==i[e]?this.cache[e]=i[e]:void 0!==X[e]&&(this.cache[e]=X[e])),this.cache[e]},this.get=function(e){var i=this.value(e);return t.isFunction(i)?i.call(this.el,this):i}}function h(t){var e=W.length,i=(z+t)%e;return 0>i?e+i:i}function a(t,e){return Math.round((/%/.test(t)?("x"===e?E.width():o())/100:1)*parseInt(t,10))}function s(t,e){return t.get("photo")||t.get("photoRegex").test(e)}function l(t,e){return t.get("retinaUrl")&&i.devicePixelRatio>1?e.replace(t.get("photoRegex"),t.get("retinaSuffix")):e}function d(t){"contains"in y[0]&&!y[0].contains(t.target)&&t.target!==v[0]&&(t.stopPropagation(),y.focus())}function c(t){c.str!==t&&(y.add(v).removeClass(c.str).addClass(t),c.str=t)}function g(e){z=0,e&&e!==!1&&"nofollow"!==e?(W=t("."+te).filter(function(){var i=t.data(this,Y),n=new r(this,i);return n.get("rel")===e}),z=W.index(_.el),-1===z&&(W=W.add(_.el),z=W.length-1)):W=t(_.el)}function u(i){t(e).trigger(i),ae.triggerHandler(i)}function f(i){var o;if(!G){if(o=t(i).data(Y),_=new r(i,o),g(_.get("rel")),!$){$=q=!0,c(_.get("className")),y.css({visibility:"hidden",display:"block",opacity:""}),L=n(se,"LoadedContent","width:0; height:0; overflow:hidden; visibility:hidden"),b.css({width:"",height:""}).append(L),D=T.height()+k.height()+b.outerHeight(!0)-b.height(),j=C.width()+H.width()+b.outerWidth(!0)-b.width(),A=L.outerHeight(!0),N=L.outerWidth(!0);var h=a(_.get("initialWidth"),"x"),s=a(_.get("initialHeight"),"y"),l=_.get("maxWidth"),f=_.get("maxHeight");_.w=(l!==!1?Math.min(h,a(l,"x")):h)-N-j,_.h=(f!==!1?Math.min(s,a(f,"y")):s)-A-D,L.css({width:"",height:_.h}),J.position(),u(ee),_.get("onOpen"),O.add(I).hide(),y.focus(),_.get("trapFocus")&&e.addEventListener&&(e.addEventListener("focus",d,!0),ae.one(re,function(){e.removeEventListener("focus",d,!0)})),_.get("returnFocus")&&ae.one(re,function(){t(_.el).focus()})}v.css({opacity:parseFloat(_.get("opacity"))||"",cursor:_.get("overlayClose")?"pointer":"",visibility:"visible"}).show(),_.get("closeButton")?B.html(_.get("close")).appendTo(b):B.appendTo("<div/>"),w()}}function p(){!y&&e.body&&(V=!1,E=t(i),y=n(se).attr({id:Y,"class":t.support.opacity===!1?Z+"IE":"",role:"dialog",tabindex:"-1"}).hide(),v=n(se,"Overlay").hide(),S=t([n(se,"LoadingOverlay")[0],n(se,"LoadingGraphic")[0]]),x=n(se,"Wrapper"),b=n(se,"Content").append(I=n(se,"Title"),R=n(se,"Current"),P=t('<button type="button"/>').attr({id:Z+"Previous"}),K=t('<button type="button"/>').attr({id:Z+"Next"}),F=n("button","Slideshow"),S),B=t('<button type="button"/>').attr({id:Z+"Close"}),x.append(n(se).append(n(se,"TopLeft"),T=n(se,"TopCenter"),n(se,"TopRight")),n(se,!1,"clear:left").append(C=n(se,"MiddleLeft"),b,H=n(se,"MiddleRight")),n(se,!1,"clear:left").append(n(se,"BottomLeft"),k=n(se,"BottomCenter"),n(se,"BottomRight"))).find("div div").css({"float":"left"}),M=n(se,!1,"position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),O=K.add(P).add(R).add(F),t(e.body).append(v,y.append(x,M)))}function m(){function i(t){t.which>1||t.shiftKey||t.altKey||t.metaKey||t.ctrlKey||(t.preventDefault(),f(this))}return y?(V||(V=!0,K.click(function(){J.next()}),P.click(function(){J.prev()}),B.click(function(){J.close()}),v.click(function(){_.get("overlayClose")&&J.close()}),t(e).bind("keydown."+Z,function(t){var e=t.keyCode;$&&_.get("escKey")&&27===e&&(t.preventDefault(),J.close()),$&&_.get("arrowKey")&&W[1]&&!t.altKey&&(37===e?(t.preventDefault(),P.click()):39===e&&(t.preventDefault(),K.click()))}),t.isFunction(t.fn.on)?t(e).on("click."+Z,"."+te,i):t("."+te).live("click."+Z,i)),!0):!1}function w(){var e,o,r,h=J.prep,d=++le;if(q=!0,U=!1,u(he),u(ie),_.get("onLoad"),_.h=_.get("height")?a(_.get("height"),"y")-A-D:_.get("innerHeight")&&a(_.get("innerHeight"),"y"),_.w=_.get("width")?a(_.get("width"),"x")-N-j:_.get("innerWidth")&&a(_.get("innerWidth"),"x"),_.mw=_.w,_.mh=_.h,_.get("maxWidth")&&(_.mw=a(_.get("maxWidth"),"x")-N-j,_.mw=_.w&&_.w<_.mw?_.w:_.mw),_.get("maxHeight")&&(_.mh=a(_.get("maxHeight"),"y")-A-D,_.mh=_.h&&_.h<_.mh?_.h:_.mh),e=_.get("href"),Q=setTimeout(function(){S.show()},100),_.get("inline")){var c=t(e);r=t("<div>").hide().insertBefore(c),ae.one(he,function(){r.replaceWith(c)}),h(c)}else _.get("iframe")?h(" "):_.get("html")?h(_.get("html")):s(_,e)?(e=l(_,e),U=new Image,t(U).addClass(Z+"Photo").bind("error",function(){h(n(se,"Error").html(_.get("imgError")))}).one("load",function(){d===le&&setTimeout(function(){var e;t.each(["alt","longdesc","aria-describedby"],function(e,i){var n=t(_.el).attr(i)||t(_.el).attr("data-"+i);n&&U.setAttribute(i,n)}),_.get("retinaImage")&&i.devicePixelRatio>1&&(U.height=U.height/i.devicePixelRatio,U.width=U.width/i.devicePixelRatio),_.get("scalePhotos")&&(o=function(){U.height-=U.height*e,U.width-=U.width*e},_.mw&&U.width>_.mw&&(e=(U.width-_.mw)/U.width,o()),_.mh&&U.height>_.mh&&(e=(U.height-_.mh)/U.height,o())),_.h&&(U.style.marginTop=Math.max(_.mh-U.height,0)/2+"px"),W[1]&&(_.get("loop")||W[z+1])&&(U.style.cursor="pointer",U.onclick=function(){J.next()}),U.style.width=U.width+"px",U.style.height=U.height+"px",h(U)},1)}),U.src=e):e&&M.load(e,_.get("data"),function(e,i){d===le&&h("error"===i?n(se,"Error").html(_.get("xhrError")):t(this).contents())})}var v,y,x,b,T,C,H,k,W,E,L,M,S,I,R,F,K,P,B,O,_,D,j,A,N,z,U,$,q,G,Q,J,V,X={html:!1,photo:!1,iframe:!1,inline:!1,transition:"elastic",speed:300,fadeOut:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,opacity:.9,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0,closeButton:!0,fastIframe:!0,open:!1,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,rel:function(){return this.rel},href:function(){return t(this).attr("href")},title:function(){return this.title}},Y="colorbox",Z="cbox",te=Z+"Element",ee=Z+"_open",ie=Z+"_load",ne=Z+"_complete",oe=Z+"_cleanup",re=Z+"_closed",he=Z+"_purge",ae=t("<a/>"),se="div",le=0,de={},ce=function(){function t(){clearTimeout(h)}function e(){(_.get("loop")||W[z+1])&&(t(),h=setTimeout(J.next,_.get("slideshowSpeed")))}function i(){F.html(_.get("slideshowStop")).unbind(s).one(s,n),ae.bind(ne,e).bind(ie,t),y.removeClass(a+"off").addClass(a+"on")}function n(){t(),ae.unbind(ne,e).unbind(ie,t),F.html(_.get("slideshowStart")).unbind(s).one(s,function(){J.next(),i()}),y.removeClass(a+"on").addClass(a+"off")}function o(){r=!1,F.hide(),t(),ae.unbind(ne,e).unbind(ie,t),y.removeClass(a+"off "+a+"on")}var r,h,a=Z+"Slideshow_",s="click."+Z;return function(){r?_.get("slideshow")||(ae.unbind(oe,o),o()):_.get("slideshow")&&W[1]&&(r=!0,ae.one(oe,o),_.get("slideshowAuto")?i():n(),F.show())}}();t[Y]||(t(p),J=t.fn[Y]=t[Y]=function(e,i){var n,o=this;if(e=e||{},t.isFunction(o))o=t("<a/>"),e.open=!0;else if(!o[0])return o;return o[0]?(p(),m()&&(i&&(e.onComplete=i),o.each(function(){var i=t.data(this,Y)||{};t.data(this,Y,t.extend(i,e))}).addClass(te),n=new r(o[0],e),n.get("open")&&f(o[0])),o):o},J.position=function(e,i){function n(){T[0].style.width=k[0].style.width=b[0].style.width=parseInt(y[0].style.width,10)-j+"px",b[0].style.height=C[0].style.height=H[0].style.height=parseInt(y[0].style.height,10)-D+"px"}var r,h,s,l=0,d=0,c=y.offset();if(E.unbind("resize."+Z),y.css({top:-9e4,left:-9e4}),h=E.scrollTop(),s=E.scrollLeft(),_.get("fixed")?(c.top-=h,c.left-=s,y.css({position:"fixed"})):(l=h,d=s,y.css({position:"absolute"})),d+=_.get("right")!==!1?Math.max(E.width()-_.w-N-j-a(_.get("right"),"x"),0):_.get("left")!==!1?a(_.get("left"),"x"):Math.round(Math.max(E.width()-_.w-N-j,0)/2),l+=_.get("bottom")!==!1?Math.max(o()-_.h-A-D-a(_.get("bottom"),"y"),0):_.get("top")!==!1?a(_.get("top"),"y"):Math.round(Math.max(o()-_.h-A-D,0)/2),y.css({top:c.top,left:c.left,visibility:"visible"}),x[0].style.width=x[0].style.height="9999px",r={width:_.w+N+j,height:_.h+A+D,top:l,left:d},e){var g=0;t.each(r,function(t){return r[t]!==de[t]?(g=e,void 0):void 0}),e=g}de=r,e||y.css(r),y.dequeue().animate(r,{duration:e||0,complete:function(){n(),q=!1,x[0].style.width=_.w+N+j+"px",x[0].style.height=_.h+A+D+"px",_.get("reposition")&&setTimeout(function(){E.bind("resize."+Z,J.position)},1),i&&i()},step:n})},J.resize=function(t){var e;$&&(t=t||{},t.width&&(_.w=a(t.width,"x")-N-j),t.innerWidth&&(_.w=a(t.innerWidth,"x")),L.css({width:_.w}),t.height&&(_.h=a(t.height,"y")-A-D),t.innerHeight&&(_.h=a(t.innerHeight,"y")),t.innerHeight||t.height||(e=L.scrollTop(),L.css({height:"auto"}),_.h=L.height()),L.css({height:_.h}),e&&L.scrollTop(e),J.position("none"===_.get("transition")?0:_.get("speed")))},J.prep=function(i){function o(){return _.w=_.w||L.width(),_.w=_.mw&&_.mw<_.w?_.mw:_.w,_.w}function a(){return _.h=_.h||L.height(),_.h=_.mh&&_.mh<_.h?_.mh:_.h,_.h}if($){var d,g="none"===_.get("transition")?0:_.get("speed");L.remove(),L=n(se,"LoadedContent").append(i),L.hide().appendTo(M.show()).css({width:o(),overflow:_.get("scrolling")?"auto":"hidden"}).css({height:a()}).prependTo(b),M.hide(),t(U).css({"float":"none"}),c(_.get("className")),d=function(){function i(){t.support.opacity===!1&&y[0].style.removeAttribute("filter")}var n,o,a=W.length;$&&(o=function(){clearTimeout(Q),S.hide(),u(ne),_.get("onComplete")},I.html(_.get("title")).show(),L.show(),a>1?("string"==typeof _.get("current")&&R.html(_.get("current").replace("{current}",z+1).replace("{total}",a)).show(),K[_.get("loop")||a-1>z?"show":"hide"]().html(_.get("next")),P[_.get("loop")||z?"show":"hide"]().html(_.get("previous")),ce(),_.get("preloading")&&t.each([h(-1),h(1)],function(){var i,n=W[this],o=new r(n,t.data(n,Y)),h=o.get("href");h&&s(o,h)&&(h=l(o,h),i=e.createElement("img"),i.src=h)})):O.hide(),_.get("iframe")?(n=e.createElement("iframe"),"frameBorder"in n&&(n.frameBorder=0),"allowTransparency"in n&&(n.allowTransparency="true"),_.get("scrolling")||(n.scrolling="no"),t(n).attr({src:_.get("href"),name:(new Date).getTime(),"class":Z+"Iframe",allowFullScreen:!0}).one("load",o).appendTo(L),ae.one(he,function(){n.src="//about:blank"}),_.get("fastIframe")&&t(n).trigger("load")):o(),"fade"===_.get("transition")?y.fadeTo(g,1,i):i())},"fade"===_.get("transition")?y.fadeTo(g,0,function(){J.position(0,d)}):J.position(g,d)}},J.next=function(){!q&&W[1]&&(_.get("loop")||W[z+1])&&(z=h(1),f(W[z]))},J.prev=function(){!q&&W[1]&&(_.get("loop")||z)&&(z=h(-1),f(W[z]))},J.close=function(){$&&!G&&(G=!0,$=!1,u(oe),_.get("onCleanup"),E.unbind("."+Z),v.fadeTo(_.get("fadeOut")||0,0),y.stop().fadeTo(_.get("fadeOut")||0,0,function(){y.hide(),v.hide(),u(he),L.remove(),setTimeout(function(){G=!1,u(re),_.get("onClosed")},1)}))},J.remove=function(){y&&(y.stop(),t[Y].close(),y.stop(!1,!0).remove(),v.remove(),G=!1,y=null,t("."+te).removeData(Y).removeClass(te),t(e).unbind("click."+Z).unbind("keydown."+Z))},J.element=function(){return t(_.el)},J.settings=X)})(jQuery,document,window);
// source --> https://www.vensera.com/wp-content/plugins/yith-woocommerce-wishlist/assets/js/jquery.selectBox.min.js 
/**
 * jQuery SelectBox
 *
 * v1.2.0
 * github.com/marcj/jquery-selectBox
 */
(function(a){var b=this.SelectBox=function(c,d){if(c instanceof jQuery){if(c.length>0){c=c[0]}else{return}}this.typeTimer=null;this.typeSearch="";this.isMac=navigator.platform.match(/mac/i);d="object"===typeof d?d:{};this.selectElement=c;if(!d.mobile&&navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i)){return false}if("select"!==c.tagName.toLowerCase()){return false}this.init(d)};b.prototype.version="1.2.0";b.prototype.init=function(o){var j=a(this.selectElement);if(j.data("selectBox-control")){return false}var f=a('<a class="selectBox" />'),h=j.attr("multiple")||parseInt(j.attr("size"))>1,d=o||{},c=parseInt(j.prop("tabindex"))||0,m=this;f.width(j.outerWidth()).addClass(j.attr("class")).attr("title",j.attr("title")||"").attr("tabindex",c).css("display","inline-block").bind("focus.selectBox",function(){if(this!==document.activeElement&&document.body!==document.activeElement){a(document.activeElement).blur()}if(f.hasClass("selectBox-active")){return}f.addClass("selectBox-active");j.trigger("focus")}).bind("blur.selectBox",function(){if(!f.hasClass("selectBox-active")){return}f.removeClass("selectBox-active");j.trigger("blur")});if(!a(window).data("selectBox-bindings")){a(window).data("selectBox-bindings",true).bind("scroll.selectBox",this.hideMenus).bind("resize.selectBox",this.hideMenus)}if(j.attr("disabled")){f.addClass("selectBox-disabled")}j.bind("click.selectBox",function(p){f.focus();p.preventDefault()});if(h){o=this.getOptions("inline");f.append(o).data("selectBox-options",o).addClass("selectBox-inline selectBox-menuShowing").bind("keydown.selectBox",function(p){m.handleKeyDown(p)}).bind("keypress.selectBox",function(p){m.handleKeyPress(p)}).bind("mousedown.selectBox",function(p){if(1!==p.which){return}if(a(p.target).is("A.selectBox-inline")){p.preventDefault()}if(!f.hasClass("selectBox-focus")){f.focus()}}).insertAfter(j);if(!j[0].style.height){var n=j.attr("size")?parseInt(j.attr("size")):5;var e=f.clone().removeAttr("id").css({position:"absolute",top:"-9999em"}).show().appendTo("body");e.find(".selectBox-options").html("<li><a>\u00A0</a></li>");var l=parseInt(e.find(".selectBox-options A:first").html("&nbsp;").outerHeight());e.remove();f.height(l*n)}this.disableSelection(f)}else{var i=a('<span class="selectBox-label" />'),k=a('<span class="selectBox-arrow" />');i.attr("class",this.getLabelClass()).text(this.getLabelText());o=this.getOptions("dropdown");o.appendTo("BODY");f.data("selectBox-options",o).addClass("selectBox-dropdown").append(i).append(k).bind("mousedown.selectBox",function(p){if(1===p.which){if(f.hasClass("selectBox-menuShowing")){m.hideMenus()}else{p.stopPropagation();o.data("selectBox-down-at-x",p.screenX).data("selectBox-down-at-y",p.screenY);m.showMenu()}}}).bind("keydown.selectBox",function(p){m.handleKeyDown(p)}).bind("keypress.selectBox",function(p){m.handleKeyPress(p)}).bind("open.selectBox",function(q,p){if(p&&p._selectBox===true){return}m.showMenu()}).bind("close.selectBox",function(q,p){if(p&&p._selectBox===true){return}m.hideMenus()}).insertAfter(j);var g=f.width()-k.outerWidth()-parseInt(i.css("paddingLeft"))||0-parseInt(i.css("paddingRight"))||0;i.width(g);this.disableSelection(f)}j.addClass("selectBox").data("selectBox-control",f).data("selectBox-settings",d).hide()};b.prototype.getOptions=function(j){var f;var c=a(this.selectElement);var e=this;var d=function(i,k){i.children("OPTION, OPTGROUP").each(function(){if(a(this).is("OPTION")){if(a(this).length>0){e.generateOptions(a(this),k)}else{k.append("<li>\u00A0</li>")}}else{var l=a('<li class="selectBox-optgroup" />');l.text(a(this).attr("label"));k.append(l);k=d(a(this),k)}});return k};switch(j){case"inline":f=a('<ul class="selectBox-options" />');f=d(c,f);f.find("A").bind("mouseover.selectBox",function(i){e.addHover(a(this).parent())}).bind("mouseout.selectBox",function(i){e.removeHover(a(this).parent())}).bind("mousedown.selectBox",function(i){if(1!==i.which){return}i.preventDefault();if(!c.selectBox("control").hasClass("selectBox-active")){c.selectBox("control").focus()}}).bind("mouseup.selectBox",function(i){if(1!==i.which){return}e.hideMenus();e.selectOption(a(this).parent(),i)});this.disableSelection(f);return f;case"dropdown":f=a('<ul class="selectBox-dropdown-menu selectBox-options" />');f=d(c,f);f.data("selectBox-select",c).css("display","none").appendTo("BODY").find("A").bind("mousedown.selectBox",function(i){if(i.which===1){i.preventDefault();if(i.screenX===f.data("selectBox-down-at-x")&&i.screenY===f.data("selectBox-down-at-y")){f.removeData("selectBox-down-at-x").removeData("selectBox-down-at-y");e.hideMenus()}}}).bind("mouseup.selectBox",function(i){if(1!==i.which){return}if(i.screenX===f.data("selectBox-down-at-x")&&i.screenY===f.data("selectBox-down-at-y")){return}else{f.removeData("selectBox-down-at-x").removeData("selectBox-down-at-y")}e.selectOption(a(this).parent());e.hideMenus()}).bind("mouseover.selectBox",function(i){e.addHover(a(this).parent())}).bind("mouseout.selectBox",function(i){e.removeHover(a(this).parent())});var h=c.attr("class")||"";if(""!==h){h=h.split(" ");for(var g in h){f.addClass(h[g]+"-selectBox-dropdown-menu")}}this.disableSelection(f);return f}};b.prototype.getLabelClass=function(){var c=a(this.selectElement).find("OPTION:selected");return("selectBox-label "+(c.attr("class")||"")).replace(/\s+$/,"")};b.prototype.getLabelText=function(){var c=a(this.selectElement).find("OPTION:selected");return c.text()||"\u00A0"};b.prototype.setLabel=function(){var c=a(this.selectElement);var d=c.data("selectBox-control");if(!d){return}d.find(".selectBox-label").attr("class",this.getLabelClass()).text(this.getLabelText())};b.prototype.destroy=function(){var c=a(this.selectElement);var e=c.data("selectBox-control");if(!e){return}var d=e.data("selectBox-options");d.remove();e.remove();c.removeClass("selectBox").removeData("selectBox-control").data("selectBox-control",null).removeData("selectBox-settings").data("selectBox-settings",null).show()};b.prototype.refresh=function(){var c=a(this.selectElement),e=c.data("selectBox-control"),f=e.hasClass("selectBox-dropdown"),d=e.hasClass("selectBox-menuShowing");c.selectBox("options",c.html());if(f&&d){this.showMenu()}};b.prototype.showMenu=function(){var e=this,d=a(this.selectElement),j=d.data("selectBox-control"),h=d.data("selectBox-settings"),f=j.data("selectBox-options");if(j.hasClass("selectBox-disabled")){return false}this.hideMenus();var g=parseInt(j.css("borderBottomWidth"))||0;f.width(j.innerWidth()).css({top:j.offset().top+j.outerHeight()-g,left:j.offset().left});if(d.triggerHandler("beforeopen")){return false}var i=function(){d.triggerHandler("open",{_selectBox:true})};switch(h.menuTransition){case"fade":f.fadeIn(h.menuSpeed,i);break;case"slide":f.slideDown(h.menuSpeed,i);break;default:f.show(h.menuSpeed,i);break}if(!h.menuSpeed){i()}var c=f.find(".selectBox-selected:first");this.keepOptionInView(c,true);this.addHover(c);j.addClass("selectBox-menuShowing");a(document).bind("mousedown.selectBox",function(k){if(1===k.which){if(a(k.target).parents().andSelf().hasClass("selectBox-options")){return}e.hideMenus()}})};b.prototype.hideMenus=function(){if(a(".selectBox-dropdown-menu:visible").length===0){return}a(document).unbind("mousedown.selectBox");a(".selectBox-dropdown-menu").each(function(){var d=a(this),c=d.data("selectBox-select"),g=c.data("selectBox-control"),e=c.data("selectBox-settings");if(c.triggerHandler("beforeclose")){return false}var f=function(){c.triggerHandler("close",{_selectBox:true})};if(e){switch(e.menuTransition){case"fade":d.fadeOut(e.menuSpeed,f);break;case"slide":d.slideUp(e.menuSpeed,f);break;default:d.hide(e.menuSpeed,f);break}if(!e.menuSpeed){f()}g.removeClass("selectBox-menuShowing")}else{a(this).hide();a(this).triggerHandler("close",{_selectBox:true});a(this).removeClass("selectBox-menuShowing")}})};b.prototype.selectOption=function(d,j){var c=a(this.selectElement);d=a(d);var k=c.data("selectBox-control"),h=c.data("selectBox-settings");if(k.hasClass("selectBox-disabled")){return false}if(0===d.length||d.hasClass("selectBox-disabled")){return false}if(c.attr("multiple")){if(j.shiftKey&&k.data("selectBox-last-selected")){d.toggleClass("selectBox-selected");var e;if(d.index()>k.data("selectBox-last-selected").index()){e=d.siblings().slice(k.data("selectBox-last-selected").index(),d.index())}else{e=d.siblings().slice(d.index(),k.data("selectBox-last-selected").index())}e=e.not(".selectBox-optgroup, .selectBox-disabled");if(d.hasClass("selectBox-selected")){e.addClass("selectBox-selected")}else{e.removeClass("selectBox-selected")}}else{if((this.isMac&&j.metaKey)||(!this.isMac&&j.ctrlKey)){d.toggleClass("selectBox-selected")}else{d.siblings().removeClass("selectBox-selected");d.addClass("selectBox-selected")}}}else{d.siblings().removeClass("selectBox-selected");d.addClass("selectBox-selected")}if(k.hasClass("selectBox-dropdown")){k.find(".selectBox-label").text(d.text())}var f=0,g=[];if(c.attr("multiple")){k.find(".selectBox-selected A").each(function(){g[f++]=a(this).attr("rel")})}else{g=d.find("A").attr("rel")}k.data("selectBox-last-selected",d);if(c.val()!==g){c.val(g);this.setLabel();c.trigger("change")}return true};b.prototype.addHover=function(d){d=a(d);var c=a(this.selectElement),f=c.data("selectBox-control"),e=f.data("selectBox-options");e.find(".selectBox-hover").removeClass("selectBox-hover");d.addClass("selectBox-hover")};b.prototype.getSelectElement=function(){return this.selectElement};b.prototype.removeHover=function(d){d=a(d);var c=a(this.selectElement),f=c.data("selectBox-control"),e=f.data("selectBox-options");e.find(".selectBox-hover").removeClass("selectBox-hover")};b.prototype.keepOptionInView=function(e,d){if(!e||e.length===0){return}var c=a(this.selectElement),j=c.data("selectBox-control"),g=j.data("selectBox-options"),h=j.hasClass("selectBox-dropdown")?g:g.parent(),i=parseInt(e.offset().top-h.position().top),f=parseInt(i+e.outerHeight());if(d){h.scrollTop(e.offset().top-h.offset().top+h.scrollTop()-(h.height()/2))}else{if(i<0){h.scrollTop(e.offset().top-h.offset().top+h.scrollTop())}if(f>h.height()){h.scrollTop((e.offset().top+e.outerHeight())-h.offset().top+h.scrollTop()-h.height())}}};b.prototype.handleKeyDown=function(c){var k=a(this.selectElement),g=k.data("selectBox-control"),l=g.data("selectBox-options"),e=k.data("selectBox-settings"),f=0,h=0;if(g.hasClass("selectBox-disabled")){return}switch(c.keyCode){case 8:c.preventDefault();this.typeSearch="";break;case 9:case 27:this.hideMenus();this.removeHover();break;case 13:if(g.hasClass("selectBox-menuShowing")){this.selectOption(l.find("LI.selectBox-hover:first"),c);if(g.hasClass("selectBox-dropdown")){this.hideMenus()}}else{this.showMenu()}break;case 38:case 37:c.preventDefault();if(g.hasClass("selectBox-menuShowing")){var d=l.find(".selectBox-hover").prev("LI");f=l.find("LI:not(.selectBox-optgroup)").length;h=0;while(d.length===0||d.hasClass("selectBox-disabled")||d.hasClass("selectBox-optgroup")){d=d.prev("LI");if(d.length===0){if(e.loopOptions){d=l.find("LI:last")}else{d=l.find("LI:first")}}if(++h>=f){break}}this.addHover(d);this.selectOption(d,c);this.keepOptionInView(d)}else{this.showMenu()}break;case 40:case 39:c.preventDefault();if(g.hasClass("selectBox-menuShowing")){var j=l.find(".selectBox-hover").next("LI");f=l.find("LI:not(.selectBox-optgroup)").length;h=0;while(0===j.length||j.hasClass("selectBox-disabled")||j.hasClass("selectBox-optgroup")){j=j.next("LI");if(j.length===0){if(e.loopOptions){j=l.find("LI:first")}else{j=l.find("LI:last")}}if(++h>=f){break}}this.addHover(j);this.selectOption(j,c);this.keepOptionInView(j)}else{this.showMenu()}break}};b.prototype.handleKeyPress=function(e){var c=a(this.selectElement),f=c.data("selectBox-control"),d=f.data("selectBox-options");if(f.hasClass("selectBox-disabled")){return}switch(e.keyCode){case 9:case 27:case 13:case 38:case 37:case 40:case 39:break;default:if(!f.hasClass("selectBox-menuShowing")){this.showMenu()}e.preventDefault();clearTimeout(this.typeTimer);this.typeSearch+=String.fromCharCode(e.charCode||e.keyCode);d.find("A").each(function(){if(a(this).text().substr(0,this.typeSearch.length).toLowerCase()===this.typeSearch.toLowerCase()){this.addHover(a(this).parent());this.selectOption(a(this).parent(),e);this.keepOptionInView(a(this).parent());return false}});this.typeTimer=setTimeout(function(){this.typeSearch=""},1000);break}};b.prototype.enable=function(){var c=a(this.selectElement);c.prop("disabled",false);var d=c.data("selectBox-control");if(!d){return}d.removeClass("selectBox-disabled")};b.prototype.disable=function(){var c=a(this.selectElement);c.prop("disabled",true);var d=c.data("selectBox-control");if(!d){return}d.addClass("selectBox-disabled")};b.prototype.setValue=function(f){var c=a(this.selectElement);c.val(f);f=c.val();if(null===f){f=c.children().first().val();c.val(f)}var g=c.data("selectBox-control");if(!g){return}var e=c.data("selectBox-settings"),d=g.data("selectBox-options");this.setLabel();d.find(".selectBox-selected").removeClass("selectBox-selected");d.find("A").each(function(){if(typeof(f)==="object"){for(var h=0;h<f.length;h++){if(a(this).attr("rel")==f[h]){a(this).parent().addClass("selectBox-selected")}}}else{if(a(this).attr("rel")==f){a(this).parent().addClass("selectBox-selected")}}});if(e.change){e.change.call(c)}};b.prototype.setOptions=function(m){var l=a(this.selectElement),f=l.data("selectBox-control"),d=l.data("selectBox-settings"),k;switch(typeof(m)){case"string":l.html(m);break;case"object":l.html("");for(var g in m){if(m[g]===null){continue}if(typeof(m[g])==="object"){var c=a('<optgroup label="'+g+'" />');for(var e in m[g]){c.append('<option value="'+e+'">'+m[g][e]+"</option>")}l.append(c)}else{var h=a('<option value="'+g+'">'+m[g]+"</option>");l.append(h)}}break}if(!f){return}f.data("selectBox-options").remove();k=f.hasClass("selectBox-dropdown")?"dropdown":"inline";m=this.getOptions(k);f.data("selectBox-options",m);switch(k){case"inline":f.append(m);break;case"dropdown":this.setLabel();a("BODY").append(m);break}};b.prototype.disableSelection=function(c){a(c).css("MozUserSelect","none").bind("selectstart",function(d){d.preventDefault()})};b.prototype.generateOptions=function(e,f){var c=a("<li />"),d=a("<a />");c.addClass(e.attr("class"));c.data(e.data());d.attr("rel",e.val()).text(e.text());c.append(d);if(e.attr("disabled")){c.addClass("selectBox-disabled")}if(e.attr("selected")){c.addClass("selectBox-selected")}f.append(c)};a.extend(a.fn,{selectBox:function(e,c){var d;switch(e){case"control":return a(this).data("selectBox-control");case"settings":if(!c){return a(this).data("selectBox-settings")}a(this).each(function(){a(this).data("selectBox-settings",a.extend(true,a(this).data("selectBox-settings"),c))});break;case"options":if(undefined===c){return a(this).data("selectBox-control").data("selectBox-options")}a(this).each(function(){if(d=a(this).data("selectBox")){d.setOptions(c)}});break;case"value":if(undefined===c){return a(this).val()}a(this).each(function(){if(d=a(this).data("selectBox")){d.setValue(c)}});break;case"refresh":a(this).each(function(){if(d=a(this).data("selectBox")){d.refresh()}});break;case"enable":a(this).each(function(){if(d=a(this).data("selectBox")){d.enable(this)}});break;case"disable":a(this).each(function(){if(d=a(this).data("selectBox")){d.disable()}});break;case"destroy":a(this).each(function(){if(d=a(this).data("selectBox")){d.destroy();a(this).data("selectBox",null)}});break;case"instance":return a(this).data("selectBox");default:a(this).each(function(g,f){if(!a(f).data("selectBox")){a(f).data("selectBox",new b(f,e))}});break}return a(this)}})})(jQuery);