// source --> https://www.vensera.com/wp-content/plugins/yith-woocommerce-compare/assets/js/woocompare.min.js 
jQuery(document).ready(function(a){function b(a,b){a=escape(a),b=escape(b);var c=document.location.search,d=a+"="+b,e=new RegExp("(&|\\?)"+a+"=[^&]*");return c=c.replace(e,"$1"+d),RegExp.$1||(c+=(c.length>0?"&":"?")+d),c}a(document).on("click",".product a.compare:not(.added)",function(b){b.preventDefault();var c=a(this),d={action:yith_woocompare.actionadd,id:c.data("product_id"),context:"frontend"},e=a(".yith-woocompare-widget ul.products-list");"undefined"!=typeof a.fn.block&&(c.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),e.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}})),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionadd),data:d,dataType:"json",success:function(b){"undefined"!=typeof a.fn.block&&(c.unblock(),e.unblock()),c.addClass("added").attr("href",b.table_url).text(yith_woocompare.added_label),e.html(b.widget_table),"yes"==yith_woocompare.auto_open&&a("body").trigger("yith_woocompare_open_popup",{response:b.table_url,button:c})}})}),a(document).on("click",".product a.compare.added",function(b){b.preventDefault();var c=this.href;"undefined"!=typeof c&&a("body").trigger("yith_woocompare_open_popup",{response:c,button:a(this)})}),a("body").on("yith_woocompare_open_popup",function(b,c){var d=c.response;if(a(window).width()>=768)a.colorbox({href:d,iframe:!0,width:"90%",height:"90%",onClosed:function(){var b=a(".yith-woocompare-widget ul.products-list"),c={action:yith_woocompare.actionview,context:"frontend"};"undefined"!=typeof a.fn.block&&b.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionview),data:c,success:function(c){"undefined"!=typeof a.fn.block&&b.unblock().html(c),b.html(c)}})}}),a(window).resize(function(){a.colorbox.resize({width:"90%",height:"90%"})});else{var e=d.split("?"),f="iframe";if(e.length>=2){for(var g=encodeURIComponent(f)+"=",h=e[1].split(/[&;]/g),i=h.length;i-- >0;)h[i].lastIndexOf(g,0)!==-1&&h.splice(i,1);d=e[0]+"?"+h.join("&")}window.open(d,yith_woocompare.table_title)}}),a(document).on("click",".remove a",function(b){b.preventDefault();var c=a(this),d={action:yith_woocompare.actionremove,id:c.data("product_id"),context:"frontend"};a("td.product_"+d.id+", th.product_"+d.id);"undefined"!=typeof a.fn.block&&c.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionremove),data:d,dataType:"html",success:function(b){var d=a(b).filter("table.compare-list");a("body > table.compare-list").replaceWith(d),a('.compare[data-product_id="'+c.data("product_id")+'"]',window.parent.document).removeClass("added").html(yith_woocompare.button_text),a(window).trigger("yith_woocompare_product_removed")}})}),a(".yith-woocompare-open a, a.yith-woocompare-open").on("click",function(c){c.preventDefault(),a("body").trigger("yith_woocompare_open_popup",{response:b("action",yith_woocompare.actionview)+"&iframe=true"})}),a(".yith-woocompare-widget").on("click","a.compare",function(b){b.preventDefault(),a("body").trigger("yith_woocompare_open_popup",{response:a(this).attr("href")})}).on("click","li a.remove, a.clear-all",function(b){b.preventDefault();var c=a(".yith-woocompare-widget .products-list").data("lang"),d=a(this),e=d.data("product_id"),f={action:yith_woocompare.actionremove,id:e,context:"frontend",responseType:"product_list",lang:c},g=d.parents(".yith-woocompare-widget").find("ul.products-list");"undefined"!=typeof a.fn.block&&g.block({message:null,overlayCSS:{background:"#fff url("+yith_woocompare.loader+") no-repeat center",backgroundSize:"16px 16px",opacity:.6}}),a.ajax({type:"post",url:yith_woocompare.ajaxurl.toString().replace("%%endpoint%%",yith_woocompare.actionremove),data:f,dataType:"html",success:function(b){"all"==e?a(".compare.added").removeClass("added").html(yith_woocompare.button_text):a('.compare[data-product_id="'+e+'"]').removeClass("added").html(yith_woocompare.button_text),g.html(b),"undefined"!=typeof a.fn.block&&g.unblock()}})})});