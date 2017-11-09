<?php global $template;
$footer_style = ya_options() -> getCpanelValue( 'footer_style' );
?>
<footer class="footer theme-clearfix footer-<?php echo $footer_style; ?>" role="contentinfo">
	<div class="footer-in theme-clearfix">
		<div class="container theme-clearfix">
			<div class="row">
				<?php if (is_active_sidebar_YA('footer-style8')){ ?>
				<div class="col-lg-12 col-md-12 col-sm-12 sidebar-footer-style8">					
					<?php dynamic_sidebar('footer-style8'); ?>
				</div>
				<?php } ?>
			</div>
		</div>
	</div>
	<div class="copyright8 theme-clearfix">
		<div class="clearfix">
			<?php if (is_active_sidebar_YA('footer-copyright8')){ ?>
			<div class="sidebar-copyright">					
				<?php dynamic_sidebar('footer-copyright8'); ?>
			</div>
			<?php } ?>
		</div>
	</div>
</footer>
<style>#aicb_iframe{position:fixed;right:0;bottom:0;z-index:10000;width:30%}@media screen and (max-width:1024px){#aicb_iframe{width:50%}}@media screen and (max-width:768px){#aicb_iframe{width:100%}}.disable_scroll{position:fixed;overflow:hidden}</style><script type="text/javascript">function aicb_isMobile(){return navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)?!0:!1}function getMetaKeywords(){for(var e=document.getElementsByTagName("meta"),t=0;t<e.length;t++)if("keywords"==e[t].getAttribute("name")||"Keywords"==e[t].getAttribute("name"))return e[t].getAttribute("content");return""}function receiveMessage(e){void 0!=e.data.isOpened&&("true"===e.data.isOpened?(enable_native_touch(),document.getElementById("aicb_iframe").style.height="100%"):(disable_native_touch(),document.getElementById("aicb_iframe").style.height="90px"),document.getElementById("aicb_iframe").contentWindow.postMessage({iframe_height:window.innerHeight.toString()},aicb_host))}function enable_native_touch(){aicb_isMobile()&&document.body.classList.add("disable_scroll")}function disable_native_touch(){aicb_isMobile()&&document.body.classList.remove("disable_scroll")}function aicb_ajax(e,t,n){return new Promise(function(n,a){var i=new XMLHttpRequest;i.open(e,server_host+t),i.setRequestHeader("Content-Type","application/json"),i.setRequestHeader("Authorization",'Token token="'+api_key+'"'),i.onload=function(){200===i.status?n(i.response):a({status:this.status,statusText:i.statusText})},i.onerror=function(){a({status:this.status,statusText:i.statusText})},i.send()})}var aicb_host="https://s3-ap-northeast-1.amazonaws.com/bucket-prd-aichatbot/index.html",api_key="e3e82fcf1e58c746de0e0ab4f19462be",server_host="https://areteco.shop";window.addEventListener("resize",function(){null!==document.getElementById("aicb_iframe")&&document.getElementById("aicb_iframe").contentWindow.postMessage({iframe_height:window.innerHeight.toString()},aicb_host)},!1),document.addEventListener("DOMContentLoaded",function(){var e=getMetaKeywords(),t=!0;aicb_ajax("get","/v1/existed_open_keyword.json?meta_keywords="+e,{}).then(function(e){if(e=JSON.parse(e),"false"==e.existed&&(t=!1),t){var n=document.createElement("iframe");n.onload=function(){document.getElementById("aicb_iframe").contentWindow.postMessage({api_key:api_key,meta_keywords:getMetaKeywords(),text_message:e.text_message},aicb_host)},n.setAttribute("src",aicb_host),n.style.height="90px",n.style.border="none",n.id="aicb_iframe",document.body.appendChild(n)}})["catch"](function(e){console.error("Augh, there was an error!",e.statusText)})}),window.addEventListener("message",receiveMessage,!1);</script>