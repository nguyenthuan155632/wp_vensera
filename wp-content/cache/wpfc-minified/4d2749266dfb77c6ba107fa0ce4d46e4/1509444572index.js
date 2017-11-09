// source --> https://www.vensera.com/wp-content/plugins/contact-form-7/includes/js/scripts.js 
( function( $ ) {

	'use strict';

	if ( typeof _wpcf7 === 'undefined' || _wpcf7 === null ) {
		return;
	}

	_wpcf7 = $.extend( {
		cached: 0,
		inputs: []
	}, _wpcf7 );

	$.fn.wpcf7InitForm = function() {
		this.ajaxForm( {
			beforeSubmit: function( arr, $form, options ) {
				$form.wpcf7ClearResponseOutput();
				$form.find( '[aria-invalid]' ).attr( 'aria-invalid', 'false' );
				$form.find( '.ajax-loader' ).addClass( 'is-active' );
				return true;
			},
			beforeSerialize: function( $form, options ) {
				$form.find( '[placeholder].placeheld' ).each( function( i, n ) {
					$( n ).val( '' );
				} );
				return true;
			},
			data: { '_wpcf7_is_ajax_call': 1 },
			dataType: 'json',
			success: $.wpcf7AjaxSuccess,
			error: function( xhr, status, error, $form ) {
				var e = $( '<div class="ajax-error"></div>' ).text( error.message );
				$form.after( e );
			}
		} );

		if ( _wpcf7.cached ) {
			this.wpcf7OnloadRefill();
		}

		this.wpcf7ToggleSubmit();

		this.find( '.wpcf7-submit' ).wpcf7AjaxLoader();

		this.find( '.wpcf7-acceptance' ).click( function() {
			$( this ).closest( 'form' ).wpcf7ToggleSubmit();
		} );

		this.find( '.wpcf7-exclusive-checkbox' ).wpcf7ExclusiveCheckbox();

		this.find( '.wpcf7-list-item.has-free-text' ).wpcf7ToggleCheckboxFreetext();

		this.find( '[placeholder]' ).wpcf7Placeholder();

		if ( _wpcf7.jqueryUi && ! _wpcf7.supportHtml5.date ) {
			this.find( 'input.wpcf7-date[type="date"]' ).each( function() {
				$( this ).datepicker( {
					dateFormat: 'yy-mm-dd',
					minDate: new Date( $( this ).attr( 'min' ) ),
					maxDate: new Date( $( this ).attr( 'max' ) )
				} );
			} );
		}

		if ( _wpcf7.jqueryUi && ! _wpcf7.supportHtml5.number ) {
			this.find( 'input.wpcf7-number[type="number"]' ).each( function() {
				$( this ).spinner( {
					min: $( this ).attr( 'min' ),
					max: $( this ).attr( 'max' ),
					step: $( this ).attr( 'step' )
				} );
			} );
		}

		this.find( '.wpcf7-character-count' ).wpcf7CharacterCount();

		this.find( '.wpcf7-validates-as-url' ).change( function() {
			$( this ).wpcf7NormalizeUrl();
		} );

		this.find( '.wpcf7-recaptcha' ).wpcf7Recaptcha();
	};

	$.wpcf7AjaxSuccess = function( data, status, xhr, $form ) {
		if ( ! $.isPlainObject( data ) || $.isEmptyObject( data ) ) {
			return;
		}

		_wpcf7.inputs = $form.serializeArray();

		var $responseOutput = $form.find( 'div.wpcf7-response-output' );

		$form.wpcf7ClearResponseOutput();

		$form.find( '.wpcf7-form-control' ).removeClass( 'wpcf7-not-valid' );
		$form.removeClass( 'invalid spam sent failed' );

		if ( data.captcha ) {
			$form.wpcf7RefillCaptcha( data.captcha );
		}

		if ( data.quiz ) {
			$form.wpcf7RefillQuiz( data.quiz );
		}

		if ( data.invalids ) {
			$.each( data.invalids, function( i, n ) {
				$form.find( n.into ).wpcf7NotValidTip( n.message );
				$form.find( n.into ).find( '.wpcf7-form-control' ).addClass( 'wpcf7-not-valid' );
				$form.find( n.into ).find( '[aria-invalid]' ).attr( 'aria-invalid', 'true' );
			} );

			$responseOutput.addClass( 'wpcf7-validation-errors' );
			$form.addClass( 'invalid' );

			$( data.into ).wpcf7TriggerEvent( 'invalid' );

		} else if ( 1 == data.spam ) {
			$form.find( '[name="g-recaptcha-response"]' ).each( function() {
				if ( '' == $( this ).val() ) {
					var $recaptcha = $( this ).closest( '.wpcf7-form-control-wrap' );
					$recaptcha.wpcf7NotValidTip( _wpcf7.recaptcha.messages.empty );
				}
			} );

			$responseOutput.addClass( 'wpcf7-spam-blocked' );
			$form.addClass( 'spam' );

			$( data.into ).wpcf7TriggerEvent( 'spam' );

		} else if ( 1 == data.mailSent ) {
			$responseOutput.addClass( 'wpcf7-mail-sent-ok' );
			$form.addClass( 'sent' );

			if ( data.onSentOk ) {
				$.each( data.onSentOk, function( i, n ) { eval( n ) } );
			}

			$( data.into ).wpcf7TriggerEvent( 'mailsent' );

		} else {
			$responseOutput.addClass( 'wpcf7-mail-sent-ng' );
			$form.addClass( 'failed' );

			$( data.into ).wpcf7TriggerEvent( 'mailfailed' );
		}

		if ( data.onSubmit ) {
			$.each( data.onSubmit, function( i, n ) { eval( n ) } );
		}

		$( data.into ).wpcf7TriggerEvent( 'submit' );

		if ( 1 == data.mailSent ) {
			$form.resetForm();
		}

		$form.find( '[placeholder].placeheld' ).each( function( i, n ) {
			$( n ).val( $( n ).attr( 'placeholder' ) );
		} );

		$responseOutput.append( data.message ).slideDown( 'fast' );
		$responseOutput.attr( 'role', 'alert' );

		$.wpcf7UpdateScreenReaderResponse( $form, data );
	};

	$.fn.wpcf7TriggerEvent = function( name ) {
		return this.each( function() {
			var elmId = this.id;
			var inputs = _wpcf7.inputs;

			/* DOM event */
			var event = new CustomEvent( 'wpcf7' + name, {
				bubbles: true,
				detail: {
					id: elmId,
					inputs: inputs
				}
			} );

			this.dispatchEvent( event );

			/* jQuery event */
			$( this ).trigger( 'wpcf7:' + name );
			$( this ).trigger( name + '.wpcf7' ); // deprecated
		} );
	};

	$.fn.wpcf7ExclusiveCheckbox = function() {
		return this.find( 'input:checkbox' ).click( function() {
			var name = $( this ).attr( 'name' );
			$( this ).closest( 'form' ).find( 'input:checkbox[name="' + name + '"]' ).not( this ).prop( 'checked', false );
		} );
	};

	$.fn.wpcf7Placeholder = function() {
		if ( _wpcf7.supportHtml5.placeholder ) {
			return this;
		}

		return this.each( function() {
			$( this ).val( $( this ).attr( 'placeholder' ) );
			$( this ).addClass( 'placeheld' );

			$( this ).focus( function() {
				if ( $( this ).hasClass( 'placeheld' ) ) {
					$( this ).val( '' ).removeClass( 'placeheld' );
				}
			} );

			$( this ).blur( function() {
				if ( '' === $( this ).val() ) {
					$( this ).val( $( this ).attr( 'placeholder' ) );
					$( this ).addClass( 'placeheld' );
				}
			} );
		} );
	};

	$.fn.wpcf7AjaxLoader = function() {
		return this.each( function() {
			$( this ).after( '<span class="ajax-loader"></span>' );
		} );
	};

	$.fn.wpcf7ToggleSubmit = function() {
		return this.each( function() {
			var form = $( this );

			if ( this.tagName.toLowerCase() != 'form' ) {
				form = $( this ).find( 'form' ).first();
			}

			if ( form.hasClass( 'wpcf7-acceptance-as-validation' ) ) {
				return;
			}

			var submit = form.find( 'input:submit' );

			if ( ! submit.length ) {
				return;
			}

			var acceptances = form.find( 'input:checkbox.wpcf7-acceptance' );

			if ( ! acceptances.length ) {
				return;
			}

			submit.removeAttr( 'disabled' );
			acceptances.each( function( i, n ) {
				n = $( n );

				if ( n.hasClass( 'wpcf7-invert' ) && n.is( ':checked' )
						|| ! n.hasClass( 'wpcf7-invert' ) && ! n.is( ':checked' ) ) {
					submit.attr( 'disabled', 'disabled' );
				}
			} );
		} );
	};

	$.fn.wpcf7ToggleCheckboxFreetext = function() {
		return this.each( function() {
			var $wrap = $( this ).closest( '.wpcf7-form-control' );

			if ( $( this ).find( ':checkbox, :radio' ).is( ':checked' ) ) {
				$( this ).find( ':input.wpcf7-free-text' ).prop( 'disabled', false );
			} else {
				$( this ).find( ':input.wpcf7-free-text' ).prop( 'disabled', true );
			}

			$wrap.find( ':checkbox, :radio' ).change( function() {
				var $cb = $( '.has-free-text', $wrap ).find( ':checkbox, :radio' );
				var $freetext = $( ':input.wpcf7-free-text', $wrap );

				if ( $cb.is( ':checked' ) ) {
					$freetext.prop( 'disabled', false ).focus();
				} else {
					$freetext.prop( 'disabled', true );
				}
			} );
		} );
	};

	$.fn.wpcf7CharacterCount = function() {
		return this.each( function() {
			var $count = $( this );
			var name = $count.attr( 'data-target-name' );
			var down = $count.hasClass( 'down' );
			var starting = parseInt( $count.attr( 'data-starting-value' ), 10 );
			var maximum = parseInt( $count.attr( 'data-maximum-value' ), 10 );
			var minimum = parseInt( $count.attr( 'data-minimum-value' ), 10 );

			var updateCount = function( $target ) {
				var length = $target.val().length;
				var count = down ? starting - length : length;
				$count.attr( 'data-current-value', count );
				$count.text( count );

				if ( maximum && maximum < length ) {
					$count.addClass( 'too-long' );
				} else {
					$count.removeClass( 'too-long' );
				}

				if ( minimum && length < minimum ) {
					$count.addClass( 'too-short' );
				} else {
					$count.removeClass( 'too-short' );
				}
			};

			$count.closest( 'form' ).find( ':input[name="' + name + '"]' ).each( function() {
				updateCount( $( this ) );

				$( this ).keyup( function() {
					updateCount( $( this ) );
				} );
			} );
		} );
	};

	$.fn.wpcf7NormalizeUrl = function() {
		return this.each( function() {
			var val = $.trim( $( this ).val() );

			// check the scheme part
			if ( val && ! val.match( /^[a-z][a-z0-9.+-]*:/i ) ) {
				val = val.replace( /^\/+/, '' );
				val = 'http://' + val;
			}

			$( this ).val( val );
		} );
	};

	$.fn.wpcf7NotValidTip = function( message ) {
		return this.each( function() {
			var $into = $( this );

			$into.find( 'span.wpcf7-not-valid-tip' ).remove();
			$into.append( '<span role="alert" class="wpcf7-not-valid-tip">' + message + '</span>' );

			if ( $into.is( '.use-floating-validation-tip *' ) ) {
				$( '.wpcf7-not-valid-tip', $into ).mouseover( function() {
					$( this ).wpcf7FadeOut();
				} );

				$( ':input', $into ).focus( function() {
					$( '.wpcf7-not-valid-tip', $into ).not( ':hidden' ).wpcf7FadeOut();
				} );
			}
		} );
	};

	$.fn.wpcf7FadeOut = function() {
		return this.each( function() {
			$( this ).animate( {
				opacity: 0
			}, 'fast', function() {
				$( this ).css( { 'z-index': -100 } );
			} );
		} );
	};

	$.fn.wpcf7OnloadRefill = function() {
		return this.each( function() {
			var url = $( this ).attr( 'action' );

			if ( 0 < url.indexOf( '#' ) ) {
				url = url.substr( 0, url.indexOf( '#' ) );
			}

			var id = $( this ).find( 'input[name="_wpcf7"]' ).val();
			var unitTag = $( this ).find( 'input[name="_wpcf7_unit_tag"]' ).val();

			$.getJSON( url,
				{ _wpcf7_is_ajax_call: 1, _wpcf7: id, _wpcf7_request_ver: $.now() },
				function( data ) {
					if ( data && data.captcha ) {
						$( '#' + unitTag ).wpcf7RefillCaptcha( data.captcha );
					}

					if ( data && data.quiz ) {
						$( '#' + unitTag ).wpcf7RefillQuiz( data.quiz );
					}
				}
			);
		} );
	};

	$.fn.wpcf7RefillCaptcha = function( captcha ) {
		return this.each( function() {
			var form = $( this );

			$.each( captcha, function( i, n ) {
				form.find( ':input[name="' + i + '"]' ).clearFields();
				form.find( 'img.wpcf7-captcha-' + i ).attr( 'src', n );
				var match = /([0-9]+)\.(png|gif|jpeg)$/.exec( n );
				form.find( 'input:hidden[name="_wpcf7_captcha_challenge_' + i + '"]' ).attr( 'value', match[ 1 ] );
			} );
		} );
	};

	$.fn.wpcf7RefillQuiz = function( quiz ) {
		return this.each( function() {
			var form = $( this );

			$.each( quiz, function( i, n ) {
				form.find( ':input[name="' + i + '"]' ).clearFields();
				form.find( ':input[name="' + i + '"]' ).siblings( 'span.wpcf7-quiz-label' ).text( n[ 0 ] );
				form.find( 'input:hidden[name="_wpcf7_quiz_answer_' + i + '"]' ).attr( 'value', n[ 1 ] );
			} );
		} );
	};

	$.fn.wpcf7ClearResponseOutput = function() {
		return this.each( function() {
			$( this ).find( 'div.wpcf7-response-output' ).hide().empty().removeClass( 'wpcf7-mail-sent-ok wpcf7-mail-sent-ng wpcf7-validation-errors wpcf7-spam-blocked' ).removeAttr( 'role' );
			$( this ).find( 'span.wpcf7-not-valid-tip' ).remove();
			$( this ).find( '.ajax-loader' ).removeClass( 'is-active' );
		} );
	};

	$.fn.wpcf7Recaptcha = function() {
		return this.each( function() {
			var events = 'wpcf7:spam wpcf7:mailsent wpcf7:mailfailed';
			$( this ).closest( 'div.wpcf7' ).on( events, function( e ) {
				if ( recaptchaWidgets && grecaptcha ) {
					$.each( recaptchaWidgets, function( index, value ) {
						grecaptcha.reset( value );
					} );
				}
			} );
		} );
	};

	$.wpcf7UpdateScreenReaderResponse = function( $form, data ) {
		$( '.wpcf7 .screen-reader-response' ).html( '' ).attr( 'role', '' );

		if ( data.message ) {
			var $response = $form.siblings( '.screen-reader-response' ).first();
			$response.append( data.message );

			if ( data.invalids ) {
				var $invalids = $( '<ul></ul>' );

				$.each( data.invalids, function( i, n ) {
					if ( n.idref ) {
						var $li = $( '<li></li>' ).append( $( '<a></a>' ).attr( 'href', '#' + n.idref ).append( n.message ) );
					} else {
						var $li = $( '<li></li>' ).append( n.message );
					}

					$invalids.append( $li );
				} );

				$response.append( $invalids );
			}

			$response.attr( 'role', 'alert' ).focus();
		}
	};

	$.wpcf7SupportHtml5 = function() {
		var features = {};
		var input = document.createElement( 'input' );

		features.placeholder = 'placeholder' in input;

		var inputTypes = [ 'email', 'url', 'tel', 'number', 'range', 'date' ];

		$.each( inputTypes, function( index, value ) {
			input.setAttribute( 'type', value );
			features[ value ] = input.type !== 'text';
		} );

		return features;
	};

	$( function() {
		_wpcf7.supportHtml5 = $.wpcf7SupportHtml5();
		$( 'div.wpcf7 > form' ).wpcf7InitForm();
	} );

} )( jQuery );

/*
 * Polyfill for Internet Explorer
 * See https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
( function () {
	if ( typeof window.CustomEvent === "function" ) return false;

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event,
			params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
} )();
// source --> //www.vensera.com/wp-content/plugins/woocommerce/assets/js/prettyPhoto/jquery.prettyPhoto.min.js 
!function(a){function b(){var a=location.href;return hashtag=a.indexOf("#prettyPhoto")!==-1&&decodeURI(a.substring(a.indexOf("#prettyPhoto")+1,a.length)),hashtag&&(hashtag=hashtag.replace(/<|>/g,"")),hashtag}function c(){"undefined"!=typeof theRel&&(location.hash=theRel+"/"+rel_index+"/")}function d(){location.href.indexOf("#prettyPhoto")!==-1&&(location.hash="prettyPhoto")}function e(a,b){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var c="[\\?&]"+a+"=([^&#]*)",d=new RegExp(c),e=d.exec(b);return null==e?"":e[1]}a.prettyPhoto={version:"3.1.6"},a.fn.prettyPhoto=function(f){function g(){a(".pp_loaderIcon").hide(),projectedTop=scroll_pos.scrollTop+(A/2-r.containerHeight/2),projectedTop<0&&(projectedTop=0),$ppt.fadeTo(settings.animation_speed,1),$pp_pic_holder.find(".pp_content").animate({height:r.contentHeight,width:r.contentWidth},settings.animation_speed),$pp_pic_holder.animate({top:projectedTop,left:B/2-r.containerWidth/2<0?0:B/2-r.containerWidth/2,width:r.containerWidth},settings.animation_speed,function(){$pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(r.height).width(r.width),$pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed),isSet&&"image"==l(pp_images[set_position])?$pp_pic_holder.find(".pp_hoverContainer").show():$pp_pic_holder.find(".pp_hoverContainer").hide(),settings.allow_expand&&(r.resized?a("a.pp_expand,a.pp_contract").show():a("a.pp_expand").hide()),!settings.autoplay_slideshow||x||s||a.prettyPhoto.startSlideshow(),settings.changepicturecallback(),s=!0}),p(),f.ajaxcallback()}function h(b){$pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility","hidden"),$pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed,function(){a(".pp_loaderIcon").show(),b()})}function i(b){b>1?a(".pp_nav").show():a(".pp_nav").hide()}function j(a,b){if(resized=!1,k(a,b),imageWidth=a,imageHeight=b,(w>B||v>A)&&doresize&&settings.allow_resize&&!z){for(resized=!0,fitting=!1;!fitting;)w>B?(imageWidth=B-200,imageHeight=b/a*imageWidth):v>A?(imageHeight=A-200,imageWidth=a/b*imageHeight):fitting=!0,v=imageHeight,w=imageWidth;(w>B||v>A)&&j(w,v),k(imageWidth,imageHeight)}return{width:Math.floor(imageWidth),height:Math.floor(imageHeight),containerHeight:Math.floor(v),containerWidth:Math.floor(w)+2*settings.horizontal_padding,contentHeight:Math.floor(t),contentWidth:Math.floor(u),resized:resized}}function k(b,c){b=parseFloat(b),c=parseFloat(c),$pp_details=$pp_pic_holder.find(".pp_details"),$pp_details.width(b),detailsHeight=parseFloat($pp_details.css("marginTop"))+parseFloat($pp_details.css("marginBottom")),$pp_details=$pp_details.clone().addClass(settings.theme).width(b).appendTo(a("body")).css({position:"absolute",top:-1e4}),detailsHeight+=$pp_details.height(),detailsHeight=detailsHeight<=34?36:detailsHeight,$pp_details.remove(),$pp_title=$pp_pic_holder.find(".ppt"),$pp_title.width(b),titleHeight=parseFloat($pp_title.css("marginTop"))+parseFloat($pp_title.css("marginBottom")),$pp_title=$pp_title.clone().appendTo(a("body")).css({position:"absolute",top:-1e4}),titleHeight+=$pp_title.height(),$pp_title.remove(),t=c+detailsHeight,u=b,v=t+titleHeight+$pp_pic_holder.find(".pp_top").height()+$pp_pic_holder.find(".pp_bottom").height(),w=b}function l(a){return a.match(/youtube\.com\/watch/i)||a.match(/youtu\.be/i)?"youtube":a.match(/vimeo\.com/i)?"vimeo":a.match(/\b.mov\b/i)?"quicktime":a.match(/\b.swf\b/i)?"flash":a.match(/\biframe=true\b/i)?"iframe":a.match(/\bajax=true\b/i)?"ajax":a.match(/\bcustom=true\b/i)?"custom":"#"==a.substr(0,1)?"inline":"image"}function m(){if(doresize&&"undefined"!=typeof $pp_pic_holder){if(scroll_pos=n(),contentHeight=$pp_pic_holder.height(),contentwidth=$pp_pic_holder.width(),projectedTop=A/2+scroll_pos.scrollTop-contentHeight/2,projectedTop<0&&(projectedTop=0),contentHeight>A)return;$pp_pic_holder.css({top:projectedTop,left:B/2+scroll_pos.scrollLeft-contentwidth/2})}}function n(){return self.pageYOffset?{scrollTop:self.pageYOffset,scrollLeft:self.pageXOffset}:document.documentElement&&document.documentElement.scrollTop?{scrollTop:document.documentElement.scrollTop,scrollLeft:document.documentElement.scrollLeft}:document.body?{scrollTop:document.body.scrollTop,scrollLeft:document.body.scrollLeft}:void 0}function o(){A=a(window).height(),B=a(window).width(),"undefined"!=typeof $pp_overlay&&$pp_overlay.height(a(document).height()).width(B)}function p(){isSet&&settings.overlay_gallery&&"image"==l(pp_images[set_position])?(itemWidth=57,navWidth="facebook"==settings.theme||"pp_default"==settings.theme?50:30,itemsPerPage=Math.floor((r.containerWidth-100-navWidth)/itemWidth),itemsPerPage=itemsPerPage<pp_images.length?itemsPerPage:pp_images.length,totalPage=Math.ceil(pp_images.length/itemsPerPage)-1,0==totalPage?(navWidth=0,$pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide()):$pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show(),galleryWidth=itemsPerPage*itemWidth,fullGalleryWidth=pp_images.length*itemWidth,$pp_gallery.css("margin-left",-(galleryWidth/2+navWidth/2)).find("div:first").width(galleryWidth+5).find("ul").width(fullGalleryWidth).find("li.selected").removeClass("selected"),goToPage=Math.floor(set_position/itemsPerPage)<totalPage?Math.floor(set_position/itemsPerPage):totalPage,a.prettyPhoto.changeGalleryPage(goToPage),$pp_gallery_li.filter(":eq("+set_position+")").addClass("selected")):$pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave")}function q(b){if(settings.social_tools&&(facebook_like_link=settings.social_tools.replace("{location_href}",encodeURIComponent(location.href))),settings.markup=settings.markup.replace("{pp_social}",""),a("body").append(settings.markup),$pp_pic_holder=a(".pp_pic_holder"),$ppt=a(".ppt"),$pp_overlay=a("div.pp_overlay"),isSet&&settings.overlay_gallery){currentGalleryPage=0,toInject="";for(var c=0;c<pp_images.length;c++)pp_images[c].match(/\b(jpg|jpeg|png|gif)\b/gi)?(classname="",img_src=pp_images[c]):(classname="default",img_src=""),toInject+="<li class='"+classname+"'><a href='#'><img src='"+img_src+"' width='50' alt='' /></a></li>";toInject=settings.gallery_markup.replace(/{gallery}/g,toInject),$pp_pic_holder.find("#pp_full_res").after(toInject),$pp_gallery=a(".pp_pic_holder .pp_gallery"),$pp_gallery_li=$pp_gallery.find("li"),$pp_gallery.find(".pp_arrow_next").click(function(){return a.prettyPhoto.changeGalleryPage("next"),a.prettyPhoto.stopSlideshow(),!1}),$pp_gallery.find(".pp_arrow_previous").click(function(){return a.prettyPhoto.changeGalleryPage("previous"),a.prettyPhoto.stopSlideshow(),!1}),$pp_pic_holder.find(".pp_content").hover(function(){$pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()},function(){$pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()}),itemWidth=57,$pp_gallery_li.each(function(b){a(this).find("a").click(function(){return a.prettyPhoto.changePage(b),a.prettyPhoto.stopSlideshow(),!1})})}settings.slideshow&&($pp_pic_holder.find(".pp_nav").prepend('<a href="#" class="pp_play">Play</a>'),$pp_pic_holder.find(".pp_nav .pp_play").click(function(){return a.prettyPhoto.startSlideshow(),!1})),$pp_pic_holder.attr("class","pp_pic_holder "+settings.theme),$pp_overlay.css({opacity:0,height:a(document).height(),width:a(window).width()}).bind("click",function(){settings.modal||a.prettyPhoto.close()}),a("a.pp_close").bind("click",function(){return a.prettyPhoto.close(),!1}),settings.allow_expand&&a("a.pp_expand").bind("click",function(b){return a(this).hasClass("pp_expand")?(a(this).removeClass("pp_expand").addClass("pp_contract"),doresize=!1):(a(this).removeClass("pp_contract").addClass("pp_expand"),doresize=!0),h(function(){a.prettyPhoto.open()}),!1}),$pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click",function(){return a.prettyPhoto.changePage("previous"),a.prettyPhoto.stopSlideshow(),!1}),$pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click",function(){return a.prettyPhoto.changePage("next"),a.prettyPhoto.stopSlideshow(),!1}),m()}f=jQuery.extend({hook:"rel",animation_speed:"fast",ajaxcallback:function(){},slideshow:5e3,autoplay_slideshow:!1,opacity:.8,show_title:!0,allow_resize:!0,allow_expand:!0,default_width:500,default_height:344,counter_separator_label:"/",theme:"pp_default",horizontal_padding:20,hideflash:!1,wmode:"opaque",autoplay:!0,modal:!1,deeplinking:!0,overlay_gallery:!0,overlay_gallery_max:30,keyboard_shortcuts:!0,changepicturecallback:function(){},callback:function(){},ie6_fallback:!0,markup:'<div class="pp_pic_holder"> \t\t\t\t\t\t<div class="ppt">&nbsp;</div> \t\t\t\t\t\t<div class="pp_top"> \t\t\t\t\t\t\t<div class="pp_left"></div> \t\t\t\t\t\t\t<div class="pp_middle"></div> \t\t\t\t\t\t\t<div class="pp_right"></div> \t\t\t\t\t\t</div> \t\t\t\t\t\t<div class="pp_content_container"> \t\t\t\t\t\t\t<div class="pp_left"> \t\t\t\t\t\t\t<div class="pp_right"> \t\t\t\t\t\t\t\t<div class="pp_content"> \t\t\t\t\t\t\t\t\t<div class="pp_loaderIcon"></div> \t\t\t\t\t\t\t\t\t<div class="pp_fade"> \t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_expand" title="Expand the image">Expand</a> \t\t\t\t\t\t\t\t\t\t<div class="pp_hoverContainer"> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_next" href="#">next</a> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_previous" href="#">previous</a> \t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t\t<div id="pp_full_res"></div> \t\t\t\t\t\t\t\t\t\t<div class="pp_details"> \t\t\t\t\t\t\t\t\t\t\t<div class="pp_nav"> \t\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_previous">Previous</a> \t\t\t\t\t\t\t\t\t\t\t\t<p class="currentTextHolder">0/0</p> \t\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_next">Next</a> \t\t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t\t\t<p class="pp_description"></p> \t\t\t\t\t\t\t\t\t\t\t<div class="pp_social">{pp_social}</div> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_close" href="#">Close</a> \t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t</div> \t\t\t\t\t\t<div class="pp_bottom"> \t\t\t\t\t\t\t<div class="pp_left"></div> \t\t\t\t\t\t\t<div class="pp_middle"></div> \t\t\t\t\t\t\t<div class="pp_right"></div> \t\t\t\t\t\t</div> \t\t\t\t\t</div> \t\t\t\t\t<div class="pp_overlay"></div>',gallery_markup:'<div class="pp_gallery"> \t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_previous">Previous</a> \t\t\t\t\t\t\t\t<div> \t\t\t\t\t\t\t\t\t<ul> \t\t\t\t\t\t\t\t\t\t{gallery} \t\t\t\t\t\t\t\t\t</ul> \t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_next">Next</a> \t\t\t\t\t\t\t</div>',image_markup:'<img id="fullResImage" src="{path}" />',flash_markup:'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',quicktime_markup:'<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="https://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="https://www.apple.com/quicktime/download/"></embed></object>',iframe_markup:'<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',inline_markup:'<div class="pp_inline">{content}</div>',custom_markup:"",social_tools:'<div class="twitter"><a href="//twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>'},f);var r,s,t,u,v,w,x,y=this,z=!1,A=a(window).height(),B=a(window).width();return doresize=!0,scroll_pos=n(),a(window).unbind("resize.prettyphoto").bind("resize.prettyphoto",function(){m(),o()}),f.keyboard_shortcuts&&a(document).unbind("keydown.prettyphoto").bind("keydown.prettyphoto",function(b){if("undefined"!=typeof $pp_pic_holder&&$pp_pic_holder.is(":visible"))switch(b.keyCode){case 37:a.prettyPhoto.changePage("previous"),b.preventDefault();break;case 39:a.prettyPhoto.changePage("next"),b.preventDefault();break;case 27:settings.modal||a.prettyPhoto.close(),b.preventDefault()}}),a.prettyPhoto.initialize=function(){return settings=f,"pp_default"==settings.theme&&(settings.horizontal_padding=16),theRel=a(this).attr(settings.hook),galleryRegExp=/\[(?:.*)\]/,isSet=!!galleryRegExp.exec(theRel),pp_images=isSet?jQuery.map(y,function(b,c){if(a(b).attr(settings.hook).indexOf(theRel)!=-1)return a(b).attr("href")}):a.makeArray(a(this).attr("href")),pp_titles=isSet?jQuery.map(y,function(b,c){if(a(b).attr(settings.hook).indexOf(theRel)!=-1)return a(b).find("img").attr("alt")?a(b).find("img").attr("alt"):""}):a.makeArray(a(this).find("img").attr("alt")),pp_descriptions=isSet?jQuery.map(y,function(b,c){if(a(b).attr(settings.hook).indexOf(theRel)!=-1)return a(b).attr("title")?a(b).attr("title"):""}):a.makeArray(a(this).attr("title")),pp_images.length>settings.overlay_gallery_max&&(settings.overlay_gallery=!1),set_position=jQuery.inArray(a(this).attr("href"),pp_images),rel_index=isSet?set_position:a("a["+settings.hook+"^='"+theRel+"']").index(a(this)),q(this),settings.allow_resize&&a(window).bind("scroll.prettyphoto",function(){m()}),a.prettyPhoto.open(),!1},a.prettyPhoto.open=function(b){return"undefined"==typeof settings&&(settings=f,pp_images=a.makeArray(arguments[0]),pp_titles=arguments[1]?a.makeArray(arguments[1]):a.makeArray(""),pp_descriptions=arguments[2]?a.makeArray(arguments[2]):a.makeArray(""),isSet=pp_images.length>1,set_position=arguments[3]?arguments[3]:0,q(b.target)),settings.hideflash&&a("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility","hidden"),i(a(pp_images).length),a(".pp_loaderIcon").show(),settings.deeplinking&&c(),settings.social_tools&&(facebook_like_link=settings.social_tools.replace("{location_href}",encodeURIComponent(location.href)),$pp_pic_holder.find(".pp_social").html(facebook_like_link)),$ppt.is(":hidden")&&$ppt.css("opacity",0).show(),$pp_overlay.show().fadeTo(settings.animation_speed,settings.opacity),$pp_pic_holder.find(".currentTextHolder").text(set_position+1+settings.counter_separator_label+a(pp_images).length),"undefined"!=typeof pp_descriptions[set_position]&&""!=pp_descriptions[set_position]?$pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position])):$pp_pic_holder.find(".pp_description").hide(),movie_width=parseFloat(e("width",pp_images[set_position]))?e("width",pp_images[set_position]):settings.default_width.toString(),movie_height=parseFloat(e("height",pp_images[set_position]))?e("height",pp_images[set_position]):settings.default_height.toString(),z=!1,movie_height.indexOf("%")!=-1&&(movie_height=parseFloat(a(window).height()*parseFloat(movie_height)/100-150),z=!0),movie_width.indexOf("%")!=-1&&(movie_width=parseFloat(a(window).width()*parseFloat(movie_width)/100-150),z=!0),$pp_pic_holder.fadeIn(function(){switch(settings.show_title&&""!=pp_titles[set_position]&&"undefined"!=typeof pp_titles[set_position]?$ppt.html(unescape(pp_titles[set_position])):$ppt.html("&nbsp;"),imgPreloader="",skipInjection=!1,l(pp_images[set_position])){case"image":imgPreloader=new Image,nextImage=new Image,isSet&&set_position<a(pp_images).length-1&&(nextImage.src=pp_images[set_position+1]),prevImage=new Image,isSet&&pp_images[set_position-1]&&(prevImage.src=pp_images[set_position-1]),$pp_pic_holder.find("#pp_full_res")[0].innerHTML=settings.image_markup.replace(/{path}/g,pp_images[set_position]),imgPreloader.onload=function(){r=j(imgPreloader.width,imgPreloader.height),g()},imgPreloader.onerror=function(){alert("Image cannot be loaded. Make sure the path is correct and image exist."),a.prettyPhoto.close()},imgPreloader.src=pp_images[set_position];break;case"youtube":r=j(movie_width,movie_height),movie_id=e("v",pp_images[set_position]),""==movie_id&&(movie_id=pp_images[set_position].split("youtu.be/"),movie_id=movie_id[1],movie_id.indexOf("?")>0&&(movie_id=movie_id.substr(0,movie_id.indexOf("?"))),movie_id.indexOf("&")>0&&(movie_id=movie_id.substr(0,movie_id.indexOf("&")))),movie="//www.youtube.com/embed/"+movie_id,e("rel",pp_images[set_position])?movie+="?rel="+e("rel",pp_images[set_position]):movie+="?rel=1",settings.autoplay&&(movie+="&autoplay=1"),toInject=settings.iframe_markup.replace(/{width}/g,r.width).replace(/{height}/g,r.height).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,movie);break;case"vimeo":r=j(movie_width,movie_height),movie_id=pp_images[set_position];var b=/http(s?):\/\/(www\.)?vimeo.com\/(\d+)/,c=movie_id.match(b);movie="//player.vimeo.com/video/"+c[3]+"?title=0&amp;byline=0&amp;portrait=0",settings.autoplay&&(movie+="&autoplay=1;"),vimeo_width=r.width+"/embed/?moog_width="+r.width,toInject=settings.iframe_markup.replace(/{width}/g,vimeo_width).replace(/{height}/g,r.height).replace(/{path}/g,movie);break;case"quicktime":r=j(movie_width,movie_height),r.height+=15,r.contentHeight+=15,r.containerHeight+=15,toInject=settings.quicktime_markup.replace(/{width}/g,r.width).replace(/{height}/g,r.height).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,pp_images[set_position]).replace(/{autoplay}/g,settings.autoplay);break;case"flash":r=j(movie_width,movie_height),flash_vars=pp_images[set_position],flash_vars=flash_vars.substring(pp_images[set_position].indexOf("flashvars")+10,pp_images[set_position].length),filename=pp_images[set_position],filename=filename.substring(0,filename.indexOf("?")),toInject=settings.flash_markup.replace(/{width}/g,r.width).replace(/{height}/g,r.height).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,filename+"?"+flash_vars);break;case"iframe":r=j(movie_width,movie_height),frame_url=pp_images[set_position],frame_url=frame_url.substr(0,frame_url.indexOf("iframe")-1),toInject=settings.iframe_markup.replace(/{width}/g,r.width).replace(/{height}/g,r.height).replace(/{path}/g,frame_url);break;case"ajax":doresize=!1,r=j(movie_width,movie_height),doresize=!0,skipInjection=!0,a.get(pp_images[set_position],function(a){toInject=settings.inline_markup.replace(/{content}/g,a),$pp_pic_holder.find("#pp_full_res")[0].innerHTML=toInject,g()});break;case"custom":r=j(movie_width,movie_height),toInject=settings.custom_markup;break;case"inline":myClone=a(pp_images[set_position]).clone().append('<br clear="all" />').css({width:settings.default_width}).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo(a("body")).show(),doresize=!1,r=j(a(myClone).width(),a(myClone).height()),doresize=!0,a(myClone).remove(),toInject=settings.inline_markup.replace(/{content}/g,a(pp_images[set_position]).html())}imgPreloader||skipInjection||($pp_pic_holder.find("#pp_full_res")[0].innerHTML=toInject,g())}),!1},a.prettyPhoto.changePage=function(b){currentGalleryPage=0,"previous"==b?(set_position--,set_position<0&&(set_position=a(pp_images).length-1)):"next"==b?(set_position++,set_position>a(pp_images).length-1&&(set_position=0)):set_position=b,rel_index=set_position,doresize||(doresize=!0),settings.allow_expand&&a(".pp_contract").removeClass("pp_contract").addClass("pp_expand"),h(function(){a.prettyPhoto.open()})},a.prettyPhoto.changeGalleryPage=function(a){"next"==a?(currentGalleryPage++,currentGalleryPage>totalPage&&(currentGalleryPage=0)):"previous"==a?(currentGalleryPage--,currentGalleryPage<0&&(currentGalleryPage=totalPage)):currentGalleryPage=a,slide_speed="next"==a||"previous"==a?settings.animation_speed:0,slide_to=currentGalleryPage*(itemsPerPage*itemWidth),$pp_gallery.find("ul").animate({left:-slide_to},slide_speed)},a.prettyPhoto.startSlideshow=function(){"undefined"==typeof x?($pp_pic_holder.find(".pp_play").unbind("click").removeClass("pp_play").addClass("pp_pause").click(function(){return a.prettyPhoto.stopSlideshow(),!1}),x=setInterval(a.prettyPhoto.startSlideshow,settings.slideshow)):a.prettyPhoto.changePage("next")},a.prettyPhoto.stopSlideshow=function(){$pp_pic_holder.find(".pp_pause").unbind("click").removeClass("pp_pause").addClass("pp_play").click(function(){return a.prettyPhoto.startSlideshow(),!1}),clearInterval(x),x=void 0},a.prettyPhoto.close=function(){$pp_overlay.is(":animated")||(a.prettyPhoto.stopSlideshow(),$pp_pic_holder.stop().find("object,embed").css("visibility","hidden"),a("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed,function(){a(this).remove()}),$pp_overlay.fadeOut(settings.animation_speed,function(){settings.hideflash&&a("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility","visible"),a(this).remove(),a(window).unbind("scroll.prettyphoto"),d(),settings.callback(),doresize=!0,s=!1,delete settings}))},!pp_alreadyInitialized&&b()&&(pp_alreadyInitialized=!0,hashIndex=b(),hashRel=hashIndex,hashIndex=hashIndex.substring(hashIndex.indexOf("/")+1,hashIndex.length-1),hashRel=hashRel.substring(0,hashRel.indexOf("/")),setTimeout(function(){a("a["+f.hook+"^='"+hashRel+"']:eq("+hashIndex+")").trigger("click")},50)),this.unbind("click.prettyphoto").bind("click.prettyphoto",a.prettyPhoto.initialize)}}(jQuery);var pp_alreadyInitialized=!1;
// source --> //www.vensera.com/wp-content/plugins/woocommerce/assets/js/prettyPhoto/jquery.prettyPhoto.init.min.js 
!function(a){a(function(){a("a.zoom").prettyPhoto({hook:"data-rel",social_tools:!1,theme:"pp_woocommerce",horizontal_padding:20,opacity:.8,deeplinking:!1}),a("a[data-rel^='prettyPhoto']").prettyPhoto({hook:"data-rel",social_tools:!1,theme:"pp_woocommerce",horizontal_padding:20,opacity:.8,deeplinking:!1})})}(jQuery);