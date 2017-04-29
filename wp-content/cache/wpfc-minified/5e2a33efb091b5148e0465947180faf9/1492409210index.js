// source --> https://www.vensera.com/wp-content/themes/sw-maxshop/js/ya_circle_skillbar.js 

jQuery(function($){
	"use strict";
	var $ya_sk_id = ya_circle_skillbar.sk_id;
	$( document ).ready(function() {
		jQuery('.ya-skill-circle').waypoint(function() {
				$(this).circliful();
			}, {
				triggerOnce: true,
				offset: 'bottom-in-view'
			});	
    })
           
});