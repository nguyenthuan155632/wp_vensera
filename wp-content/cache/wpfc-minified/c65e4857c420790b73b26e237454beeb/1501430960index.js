// source --> https://www.vensera.com/wp-content/plugins/wp-live-chat-support/js/wplc_u.js 
/*
 * Cookie Status
 * 
 * 1 - complete - user has left site
 * 2 - pending - user waiting for chat to be answered by admin
 * 3 - active chat - user and admin are chatting
 * 4 - deleted
 * 5 - browsing - no data has been inputted
 * 6 - requesting chat - admin has requested a chat with user
 * 7 - timed out - visitor has timed out 
 * 8 - complete but now browsing again
 * 9 - user closed chat before starting chat
 * 10 - user minimized active chat
 * 11 - user moved on to another page (session variable is different)
 * 12 - user has not been answered after sending chat request and is still active
 * 
 */
var wplc_is_chat_open = false;
var wplc_online = false;
var wplc_agent_name = "";
var msg_history = new Array();
var wplc_is_minimized = false; /* global to hold whether or not the chat box is minimized */

var wplc_retry_interval = null;

var wplc_run = true;

var wplc_server = null;
wplc_server = new WPLCServer();

var wplc_server_last_loop_data = null;

var wplc_shown_welcome = false;

var wplc_current_agent = false;



jQuery(document).ready(function() {        
    var wplc_session_variable = new Date().getTime();
    var wplc_cid;
    var wplc_check_hide_cookie;
    var wplc_chat_status = "";
    var wplc_cookie_name = "";
    var wplc_cookie_email = "";
    var wplc_init_chat_box_check = true;
    var wplc_cid = null;
    
    var initial_data = {};
    var wplc_fist_run = true; 
    var wplc_long_poll_delay = 1500;

    /* preload the images */
    wplc_preload();

    wplc_cid = Cookies.get('wplc_cid');
    
    if(typeof wplc_cid === 'undefined'){
        wplc_cid = null;
    } else {
        wplc_cid = Cookies.get('wplc_cid');
    }
    
    wplc_check_hide_cookie = Cookies.get('wplc_hide');
    wplc_check_minimize_cookie = Cookies.get('wplc_minimize');
    wplc_chat_status = Cookies.get('wplc_chat_status');
    wplc_cookie_name = Cookies.get('wplc_name');
    wplc_cookie_email = Cookies.get('wplc_email');
    // Always start on 5 - ajax will then return chat status if active
    
    Cookies.set('wplc_chat_status', 5, { expires: 1, path: '/' });
    wplc_chat_status = 5;
    //if (typeof wplc_chat_status !== "undefined" && parseInt(wplc_chat_status) === 3) { } else {
        
    //}

    var data = {
        action: 'wplc_get_chat_box',
        security: wplc_nonce,
        cid: wplc_cid
    };

    jQuery.ajax({
        url: wplc_ajaxurl_site,
        data:data,
        type:"POST",
        success: function(response) {
            /* inject html */
            if(response){
                if (response === "0") { if (window.console) { console.log('WP Live Chat Support Return Error'); } wplc_run = false;  return; }
                response = JSON.parse(response);
                 
                 
                jQuery( "body" ).append( response['cbox']);

                wplc_listenForScrollEvent(jQuery("#wplc_chatbox"));

                if( typeof wplc_cookie_name == 'undefined' || typeof wplc_cookie_email == 'undefined' ){

                    var wplc_cookie_name =  jQuery( jQuery.parseHTML( response['cbox'] ) ).find( "#wplc_name" ).val(); 
                    var wplc_cookie_email =  jQuery( jQuery.parseHTML( response['cbox'] ) ).find( "#wplc_email" ).val(); 

                }
                


                /* is an agent online? */
                if (response['online'] === false) {
                    wplc_run = false;
                    wplc_online = false;
                } else {
                    wplc_online = true;
                }

                

                if (wplc_filter_run_override !== "1" || wplc_online === false) { wplc_run = false; } else { /* we can run */ }

                
                /* has this user been assigned an agent? */
                if (typeof response['type'] === "undefined") {
                    wplc_shown_welcome = false;
                } else {
                    if (response['type'] === "returning") {
                        wplc_shown_welcome = true;
                        /* set the agent vars so we can access them on the fly */
                        if (typeof response['agent_data'] !== "undefined") { 
                            wplc_current_agent = response['agent_data'];
                        }
                    } else {
                        wplc_shown_welcome = false;
                    }
                    
                }


                /*Support mobile loggin*/
                var wplc_mobile_check = false;
                if(typeof wplc_is_mobile !== "undefined" && (wplc_is_mobile === "true" || wplc_is_mobile === true)){
                    wplc_mobile_check = true;
                }

                /* start long polling */
                var data = {
                    action: 'wplc_call_to_server_visitor',
                    security: wplc_nonce,
                    cid:wplc_cid,
                    wplc_name: wplc_cookie_name,
                    wplc_email: wplc_cookie_email,
                    status:wplc_chat_status,
                    wplcsession:wplc_session_variable,
                    wplc_is_mobile: wplc_mobile_check,
                    wplc_extra_data:wplc_extra_data
                };

                if(wplc_server.browserIsSocketReady()){
                    data.socket = true;
                }

                initial_data = data;
                // ajax long polling function
                if (wplc_filter_run_override !== "1" || wplc_online === false) { 
                    wplc_call_to_server_chat(data,true,true);
                } else { 
                    wplc_call_to_server_chat(data,true,false);
                }
                
                if(wplc_cid !== null   && wplc_init_chat_box_check == true && wplc_init_chat_box !== false){
                    wplc_init_chat_box(wplc_cid,wplc_chat_status);
                }
             
                
            }

        }

    });

    /**
     * Preload images from the localized variable
     * @return void
     */
    function wplc_preload() {
        var images = [];
        if (typeof wplc_preload_images !== "undefined" && typeof wplc_preload_images === "object" ) {
            var wplc_i = 0;
            for (var key in wplc_preload_images) {
                images[wplc_i] = new Image();
                images[wplc_i].src = wplc_preload_images[key];
                wplc_i++;
            }
        }
    }


    /**
     * Detect if the chatbox is being scrolled.
     *
     * This had to be created as jQuery does not allow the scroll event to bubble up the DOM tree.
     * 
     * Thank you Bikal Basnet (https://stackoverflow.com/questions/16505182/bind-scroll-event-to-dynamic-div)
     * 
     * @param  object el The element in question
     */
    function wplc_listenForScrollEvent(el) {
        el.on("scroll", function(){
            el.trigger("wplc-custom-scroll");
        })

    }

    /**
     * This instantly sends the user the welcome message (i.e. to wait for any agent and start typing so long)
     * 
     * 
     */
    function wplc_send_welcome_message() {
        if(wplc_welcome_msg !== "" && !wplc_shown_welcome){
            message_class = "wplc_system_notification wplc-color-4";
            var concatenated_message = "<span class='" + message_class + "'>";
            concatenated_message += wplc_welcome_msg;
            concatenated_message += "</span>";

            if(typeof niftyFormatParser !== "undefined"){
                jQuery("#wplc_chatbox").append(niftyFormatParser(concatenated_message));
            } else{
                jQuery("#wplc_chatbox").append(concatenated_message);
            }
            wplc_scroll_to_bottom();
            
            wplc_shown_welcome = true;
        } 

    }

    /**
     * Scrolls the chat box to the bottom
     * 
     */
    function wplc_scroll_to_bottom() {
        var height = jQuery('#wplc_chatbox')[0].scrollHeight;
        jQuery('#wplc_chatbox').scrollTop(height);
    }
    function wplc_user_message_receiver(data){
        if(typeof wplc_loop_response_handler !== "undefined" && typeof wplc_loop_response_handler === "function"){
            wplc_loop_response_handler(data, wplc_server_last_loop_data);
            data = JSON.parse(data);
            if(typeof data['status'] !== "undefined"){ 
                delete wplc_server_last_loop_data.status;
            }

            if(data.keep_alive === true){
                setTimeout(function(){
                    wplc_server_last_loop_data.status = wplc_chat_status;
                    wplc_call_to_server_chat(wplc_server_last_loop_data);
                },100);
            }
        }
    }
    
    function wplc_user_retry_handler(data){
        var tstatus = Cookies.get("wplc_chat_status");

        if (tstatus !== "undefined") {
            if(tstatus !== 8 || tstatus !== 1){
                wplc_retry_interval = setTimeout(function(){
                    
                    wplc_server.prepareTransport(function(){
                        //Transport ready...
                        wplc_server_last_loop_data.status = parseInt(tstatus); //Set to existing status
                        wplc_call_to_server_chat(wplc_server_last_loop_data);
                    }, wplc_user_message_receiver, wplc_user_retry_handler, wplc_log_connection_error);


                },500);
            }

        }
    }

    function wplc_call_to_server_chat(data,first_run,short_poll) {


        if (typeof first_run === "undefined") { first_run = false; };
        if (typeof short_poll === "undefined") { short_poll = false; };
        data.first_run = first_run;
        data.short_poll = short_poll;

        if(typeof Cookies.get('wplc_name') !== "undefined"){
            data.msg_from_print = Cookies.get('wplc_name');
        }
  
        wplc_server_last_loop_data = data;

        wplc_server.send(wplc_ajaxurl, data, "POST", 120000,
            function(response) {
                wplc_long_poll_delay = 1500;
                wplc_loop_response_handler(response, data);
            },
            function(jqXHR, exception) {
                wplc_long_poll_delay = 5000;

                if (jqXHR.status == 404) {
                    wplc_log_connection_error('Error: Requested page not found. [404]');
        			wplc_run = false;
                } else if (jqXHR.status == 500) {
                    wplc_log_connection_error('Error: Internal Server Error [500].'); 
                    wplc_log_connection_error('Retrying in 5 seconds...');
		            wplc_run = true;
                } else if (exception === 'parsererror') {
                    wplc_log_connection_error('Error: Requested JSON parse failed.'); 
		            wplc_run = false;
                } else if (exception === 'abort') {
                    wplc_log_connection_error('Error: Ajax request aborted.');
		            wplc_run = false;
                } else {
                    wplc_log_connection_error('Error: Uncaught Error.\n' + jqXHR.responseText); 
                    wplc_log_connection_error('Retrying in 5 seconds...');
		            wplc_run = true;
                }                    
            },
            function(response){
                if (wplc_run) {
                    if(wplc_server.isInSocketMode() === false && wplc_server.isPreparingSocketMode() === false){
                        setTimeout(function() { 
                            wplc_call_to_server_chat(data,false,false); 
                        }, wplc_long_poll_delay);
                    } else if ((wplc_server.isInSocketMode() === false && wplc_server.isPreparingSocketMode() === true) && (typeof wplc_transport_prepared !== "undefined" && wplc_transport_prepared === false)) {
                        /* Allows for initiate chat to work on the node server */
                        if (typeof wplc_use_node_server !== "undefined" && wplc_use_node_server === "true") {
                            /* do not run this if using not the node jedi */
                            setTimeout(function() { 
                                wplc_call_to_server_chat(data,false,true); 
                            }, 7500);
                        }
                    } else {
                        if(typeof response !== "undefined" && typeof response.responseText !== "undefined" && response.responseText !== ""){
                            var response_data = JSON.parse(response.responseText);
                            if (typeof wplc_transport_prepared !== "undefined") {
                                if(wplc_transport_prepared !== true && (parseInt(response_data.status) === 3 || parseInt(response_data.status) === 2)){
                                    //Transport is unprepared and the user has returned to the page with a status 3/2
                                    wplc_server.prepareTransport(function(){
                                        wplc_call_to_server_chat(data,false,false); 
                                    }, wplc_user_message_receiver, wplc_user_retry_handler, wplc_log_connection_error);
                                }
                            }
                        }
                    }
                }
            }           
        );
        
    };  

    function wplc_loop_response_handler(response, data){
        if(response){
            if (response === "0") { if (window.console) { console.log('WP Live Chat Support Return Error'); } wplc_run = false;  return; }
            if (typeof response !== "object") {
                response = JSON.parse(response);    
            }

            data['action_2'] = "";            
            if(typeof response['wplc_name'] !== "undefined"){ data['wplc_name'] = response['wplc_name']; /* Cookies.set('wplc_name', response['wplc_name'], { expires: 1, path: '/' });*/ }
            if(typeof response['wplc_email'] !== "undefined"){ data['wplc_email'] = response['wplc_email']; /* Cookies.set('wplc_email', response['wplc_email'], { expires: 1, path: '/' }); */ }
            if(typeof response['cid'] !== "undefined"){ data['cid'] = response['cid']; Cookies.set('wplc_cid', response['cid'], { expires: 1, path: '/' }); }
            if(typeof response['aname'] !== "undefined") { wplc_agent_name = response['aname']; }
            if(typeof response['cid'] !== "undefined" && wplc_cid !== jQuery.trim(response['cid'])){ wplc_cid = jQuery.trim(response['cid']);  jQuery("#wplc_cid").val(wplc_cid); }
            if(typeof response['status'] !== "undefined" && parseInt(wplc_chat_status) !== parseInt(response['status'])){ 
                wplc_chat_status = response['status']; 
                Cookies.set('wplc_chat_status', null, { path: '/' }); 
                Cookies.set('wplc_chat_status', wplc_chat_status, { expires: 1, path: '/' }); 
            }
            
            /* Trigger for handling responses */
            jQuery.event.trigger({type: "wplc_user_chat_loop",response:response});

            /* Process status changes */
            if(data['status'] == response['status']){
                
                if(data['status'] == 5 && wplc_init_chat_box_check === true && wplc_init_chat_box !== false){ // open chat box on load
                    wplc_init_chat_box(data['cid'], data['status']);
                } 
                if((response['status'] == 3 || response['status'] == 2) && response['data'] != null){ // if active and data is returned      
                    wplc_run = true;
                    var wplc_new_message_sound = false;
                    if (typeof response['data'] === "object") {

                        for (var index in response['data']) {
                            if(typeof response['data'][index] !== "object"){
                                if (typeof msg_history[index] === "undefined") {
                                    //Not from node
                                    /* we dont have this message */
                                    msg_history[index] = true;
                                    
                                    msg_to_parse = response['data'][index].wplcStripSlashes();

                                    if(typeof niftyFormatParser !== "undefined"){
                                        jQuery("#wplc_chatbox").append(niftyFormatParser(msg_to_parse));
                                    } else{

                                        jQuery("#wplc_chatbox").append(response['data'][index].wplcStripSlashes());
                                    }

                                    wplc_new_message_sound = true;
                                
                                } else {
                                    /* we already have this message */
                                }
                            } else {
                                var the_message = response['data'][index];
                                the_message.mid = index;
                                wplc_push_message_to_chatbox(the_message,'u', function() {
                                    wplc_scroll_to_bottom();    
                                });

                                            
                            }
                        }
                    }   
                    else {
                        /* backwards compatibility - response['data'] is a string */
                        if(typeof niftyFormatParser !== "undefined"){
                            jQuery("#wplc_chatbox").append(niftyFormatParser(response['data'].wplcStripSlashes()));
                        } else{
                            jQuery("#wplc_chatbox").append(response['data'].wplcStripSlashes());
                            
                        }
                        wplc_new_message_sound = true;
                    }
                    
                    if(wplc_new_message_sound){
                        wplc_scroll_to_bottom();
                        if (typeof wplc_enable_ding !== 'undefined' && wplc_enable_ding === "1") {
                            new Audio(wplc_plugin_url+'/wp-live-chat-support/ding.mp3').play();                            
                        }
                    } 
                }

            } else {
                data['status'] = wplc_chat_status;
                Cookies.set('wplc_chat_status', wplc_chat_status, { expires: 1, path: '/' });
                if(response['status'] == 0 || response['status'] == 12){ // no answer from admin
                    jQuery("#wp-live-chat-3").hide();
                    if (typeof response['data'] !== "undefined") {
                        jQuery("#wplc_chatbox").append(response['data'].wplcStripSlashes()+"<hr />");
                    }
                    
                }
                else if(response['status'] == 8){ // chat has been ended by admin
                    wplc_run = false;

                    document.getElementById('wplc_chatmsg').disabled = true;
                    wplc_shown_welcome = false;

                    the_message = {};
                    the_message.originates = 0;
                    the_message.msg = wplc_error_messages.chat_ended_by_operator;
                    the_message.other = {};
                    var wplc_d = new Date();
                    the_message.other.datetime = Math.round( wplc_d.getTime() / 1000 );

                    wplc_push_message_to_chatbox(the_message,'u', function() {
                        wplc_scroll_to_bottom();    
                    });
                    

                    /*
                    if(typeof response['data'] === "object") {
                        for (var index in response['data']) {
                            if(typeof response['data'][index] === "object"){

                                var the_message = response['data'][index];
                                if(typeof the_message.originates !== "undefined"){
                                    var message_class = "";
                                    var message_content = "";

                                    if (parseInt(the_message.originates) === 0){
                                        //System Notification
                                        message_class = "wplc_system_notification wplc-color-4";
                                        message_content = the_message.msg;
                                        if(message_content !== ""){
                                            var concatenated_message = "<span class='" + message_class + "'>";
                                            concatenated_message += message_content;
                                            concatenated_message += "</span>";

                                            if(typeof niftyFormatParser !== "undefined"){
                                                jQuery("#wplc_chatbox").append(niftyFormatParser(concatenated_message));
                                            } else{
                                                jQuery("#wplc_chatbox").append(concatenated_message);
                                            }
                                        } 
                                    }
                                }
                            }
                        }
                    } else {
                        //Backwards Compat
                        jQuery("#wplc_chatbox").append("<em>"+response['data']+"</em><br />");
                    }*/


                    


                    jQuery.event.trigger({type: "wplc_end_chat"});
                    
               }
                else if(parseInt(response['status']) == 11){ /* use moved on to another page (perhaps in another tab so close this instance */
                    jQuery("#wp-live-chat").css({ "display" : "none" });
                    wplc_run = false;
                }
                else if(parseInt(response['status']) == 3 || parseInt(response['status']) == 2 || parseInt(response['status']) == 10){ // re-initialize chat
                    wplc_run = true;
                    if(parseInt(response['status']) == 3) { // only if not minimized open aswell
                        /* HERE NODE */

                        if (typeof wplc_use_node_server !== "undefined" && wplc_use_node_server === "true") {
                            /* do not run this if using not the node jedi */

                            if (typeof wplc_transport_prepared !== "undefined" && wplc_transport_prepared === false) {
                               wplc_server.prepareTransport(function(){
                                    wplc_call_to_server_chat(wplc_server_last_loop_data,false,false); 
                                }, wplc_user_message_receiver, wplc_user_retry_handler, wplc_log_connection_error);
                            }
                        }
                        if (!wplc_is_minimized) {
                            if (!wplc_is_chat_open) {
                                wplc_cbox_animation();
                                setTimeout(function() {
                                    open_chat(0);
                                },1500);
                            }
                        }


                        if(jQuery('#wp-live-chat').hasClass('wplc_left') === true || jQuery('#wp-live-chat').hasClass('wplc_right') === true){
                            //jQuery('#wp-live-chat').height("400px");
                        }
                    }
                    if(parseInt(response['status']) == 10) { // only if not minimized open aswell
                        wplc_run = true;
                        open_chat(0);
                        
                    }
                    if(response['data'] != null){ // append messages to chat area
                        if (typeof response['data'] === "object") {

                            for (var index in response['data']) {
                                wplc_new_message_sound = false;
                                if(typeof response['data'][index] !== "object"){

                                    if (typeof msg_history[index] === "undefined") {
                                        /* we dont have this message */
                                        msg_history[index] = true;
                                        if(typeof niftyFormatParser !== "undefined"){
                                            jQuery("#wplc_chatbox").append(niftyFormatParser(response['data'][index].wplcStripSlashes()));
                                        } else{
                                            jQuery("#wplc_chatbox").append(response['data'][index].wplcStripSlashes());
                                        }

                                        wplc_new_message_sound = true;
                                    } else {
                                            /* we already have this message */
                                    }
                                } else {
                                    var the_message = response['data'][index];
                                    the_message.mid = index;
                                    wplc_push_message_to_chatbox(the_message,'u', function() {
                                        wplc_scroll_to_bottom();    
                                    });
                                    
                                          
                                }

                                if(wplc_new_message_sound){
                                    if (response['alert']) {
                                        jQuery('#wplc-chat-alert').addClass('is-active');
                                    }
                                    wplc_scroll_to_bottom();
                                    if (typeof wplc_enable_ding !== 'undefined' && wplc_enable_ding === "1") {
                                        new Audio(wplc_plugin_url+'/wp-live-chat-support/ding.mp3').play();                            
                                    }
                                }
                            }
                        }   
                        else {
                            /* backwards compatibility - response['data'] is a string */
                            if(typeof niftyFormatParser !== "undefined"){
                                jQuery("#wplc_chatbox").append(niftyFormatParser(response['data'].wplcStripSlashes()));
                            } else{
                                jQuery("#wplc_chatbox").append(response['data'].wplcStripSlashes());
                                
                            }
                        }

                        if(response['data']){
                            wplc_scroll_to_bottom();
                            
                        } 
                    }
                }
            }  
        }
    }

    

    function wplc_log_connection_error(error){
        if (window.console) { console.log(error); }

        jQuery("#wplc_chatbox").append("<small>" + error + "</small><br>");
        wplc_scroll_to_bottom();
    }

    function wplc_display_error(error) {

        the_message = {};
        the_message.originates = 2;
        the_message.msg = error;
        the_message.other = {};
        var wplc_d = new Date();
        the_message.other.datetime = Math.round( wplc_d.getTime() / 1000 );
        wplc_push_message_to_chatbox(the_message,'u', function() {
            wplc_scroll_to_bottom();    
        });



    }
    
    function wplc_init_chat_box(cid, status){

        
        if(wplc_chat_status == 9 && wplc_check_hide_cookie == "yes"){
            
        } else if (wplc_chat_status === 3) {
            wplc_cbox_animation();
        } else {
            if(wplc_check_hide_cookie != "yes"){
                wplc_dc = setTimeout(function (){
                    wplc_cbox_animation();
                }, parseInt(window.wplc_delay));
            }
        }
        wplc_init_chat_box = false;
    }

    function wplc_cbox_animation() {
        /*
         * 1- Slide Up 
         * 2- Slide Across (Left/Right) 
         * 3- Slide Down 
         * 4- Fade In 
         */
        

        var wplc_window_id = jQuery("#wp-live-chat");

        var wplc_theme_chosen = jQuery(wplc_window_id).attr('wplc_animation');

        switch(wplc_theme_chosen){
            case 'none':
                jQuery(wplc_window_id).css('display', 'block');
                break;
            case 'animation-1':
                // Slide Up
                jQuery(wplc_window_id).animate({'marginBottom' : '0px'}, 1000);
                break;
            case 'animation-2-bl':
                // Slide Accross from left
                jQuery(wplc_window_id).animate({'left' : '20px'}, 1000);
                break;
            case 'animation-2-br':
                // Slide Accross from right
                jQuery(wplc_window_id).animate({'right' : '20px'}, 1000);
                break;
            case 'animation-2-l':
                // Slide Accross from left
                jQuery(wplc_window_id).animate({"left" : '0px'}, 1000);
                break;
            case 'animation-2-r':

                // Slide Accross from right
                jQuery(wplc_window_id).animate({'right' : '0px'}, 1000);
                break;
            case 'animation-3':
                // Fade In
                jQuery(wplc_window_id).fadeIn('slow');
            case 'animation-4':
                jQuery(wplc_window_id).css('display', 'block');
                break;
            default:
                jQuery(wplc_window_id).css('display', 'block');
                break;
        }
                       
        //jQuery("#wp-live-chat").css({ "display" : "block" });
        if(jQuery("#wp-live-chat").attr('wplc-auto-pop-up') === "1"){

            open_chat(0);
        }

        jQuery.event.trigger({type: "wplc_animation_done"});
    }


    function wplc_sound(source,volume,loop) {
        this.source=source;
        this.volume=volume;
        this.loop=loop;
        var son;
        this.son=son;
        this.finish=false;
        this.stop=function()
        {
            document.body.removeChild(this.son);
        }
        this.start=function()
        {
            if(this.finish)return false;
            this.son=document.createElement("embed");
            this.son.setAttribute("src",this.source);
            this.son.setAttribute("hidden","true");
            this.son.setAttribute("volume",this.volume);
            this.son.setAttribute("autostart","true");
            this.son.setAttribute("loop",this.loop);
            document.body.appendChild(this.son);
        }
        this.remove=function()
        {
            document.body.removeChild(this.son);
            this.finish=true;
        }
        this.init=function(volume,loop)
        {
            this.finish=false;
            this.volume=volume;
            this.loop=loop;
        }
    }
    
    
     
    //placeholder text fix for IE
    jQuery('#wp-live-chat [placeholder]').focus(function() {
        var input = jQuery(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = jQuery(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();
        
   
        /* minimize chat window */
        jQuery("body").on("click", "#wp-live-chat-minimize", function() {
            
            jQuery.event.trigger({type: "wplc_minimize_chat"});
            
            
        });


         /* close chat window */
        jQuery("body").on("click", "#wp-live-chat-close", function() {
            
            jQuery("#wp-live-chat").hide();
            jQuery("#wp-live-chat-1").hide();
            jQuery("#wp-live-chat-2").hide();
            jQuery("#wp-live-chat-3").hide();
            jQuery("#wp-live-chat-4").hide();
            jQuery("#wplc_social_holder").hide();
            jQuery("#nifty_ratings_holder").hide();
            jQuery("#wp-live-chat-react").hide();
            jQuery("#wp-live-chat-minimize").hide();
            if (typeof wplc_hide_chat !== "undefined" && wplc_hide_chat !== "" && wplc_hide_chat !== null) { Cookies.set('wplc_hide', wplc_hide_chat , { expires: 1, path: '/' });  } else {
                var wplc_expire_date = new Date();
                var minutes = 2;
                wplc_expire_date.setTime(wplc_expire_date.getTime() + (minutes * 60 * 1000));
                Cookies.set('wplc_hide', "yes" , { expires: wplc_expire_date , path: '/' });
            }
            var data = {
                action: 'wplc_user_close_chat',
                security: wplc_nonce,
                cid: wplc_cid,
                status: wplc_chat_status
            };
            jQuery.post(wplc_ajaxurl, data, function(response) {


            });            
        });  
        //open chat window function
         
        function open_chat(force){
            jQuery.event.trigger({type: "wplc_open_chat_1"});


            
            wplc_chat_status = Cookies.get('wplc_chat_status');

            /**
             *  double check we have a cookie. If not, set to 5 so that the chat box can atleast restart
             *  https://github.com/CodeCabin/wp-live-chat-support/issues/313
            */
            if( wplc_chat_status == null || wplc_chat_status == 'null' ){
                 Cookies.set('wplc_chat_status', 5, { expires: 1, path: '/' });
                 wplc_chat_status = 5;
            }


            if (parseInt(wplc_chat_status) == 3 || parseInt(wplc_chat_status) == 2 || parseInt(wplc_chat_status) == 0 || parseInt(wplc_chat_status) == 12) {

                jQuery.event.trigger({type: "wplc_open_chat_2", wplc_online: wplc_online});

                Cookies.set('wplc_had_chat', true, { path: '/' });


                wplc_send_welcome_message();

                if (parseInt(wplc_chat_status) == 0 || parseInt( wplc_chat_status ) == 11 || parseInt(wplc_chat_status) == 12) {
                    /* user was a missed chat, now lets change them back to "pending" */
                    wplc_chat_status = 2;
                }
                if(typeof wplc_start_chat_pro_custom_fields_filter !== "undefined" && typeof wplc_start_chat_pro_custom_fields_filter === "function"){
                    wplc_extra_data = wplc_start_chat_pro_custom_fields_filter(wplc_extra_data);
                }
            
                if (wplc_online) {
                    var data = {
                        action: 'wplc_user_maximize_chat',
                        security: wplc_nonce,
                        cid: wplc_cid,
                        chat_status : parseInt(wplc_chat_status),
                        wplc_extra_data:wplc_extra_data
                    };
                    jQuery.post(wplc_ajaxurl, data, function(response) {
                        
                            //log("user maximized chat success");
                    });
                }
                
            }
            else if (parseInt(wplc_chat_status) == 10) {
                    jQuery("#wp-live-chat-minimize").trigger("click");
                
            }
            
            else if (wplc_chat_status == 5 || wplc_chat_status == 9 || wplc_chat_status == 8){                
                if(jQuery("#wp-live-chat-2").is(":visible") === false && jQuery("#wp-live-chat-4").is(":visible") === false){
                    jQuery("#wp-live-chat-2").show();    
                    jQuery("#wp-live-chat-2-inner").show();         
                    var wplc_visitor_name = Cookies.get('wplc_name');           
                    if(Cookies.get('wplc_email') !== "no email set" && typeof wplc_visitor_name !== "undefined"){
                        jQuery("#wplc_name").val(Cookies.get('wplc_name'));
                        jQuery("#wplc_email").val(Cookies.get('wplc_email'));
                    }
                    jQuery("#wp-live-chat-header").addClass("active");
                }
            }
            /*else if (wplc_chat_status == 2){
                jQuery("#wp-live-chat-3").show();
            } */
            else if(wplc_chat_status == 1){
                jQuery("#wp-live-chat-4").show();
                jQuery("#wplc_social_holder").show();
                jQuery("#nifty_ratings_holder").show();
                jQuery.event.trigger({type: "wplc_animation_done"});
                jQuery("#wplc_chatbox").append(wplc_error_messages.chat_ended_by_operator+"<br />");
                wplc_scroll_to_bottom();
                jQuery("#wp-live-chat-minimize").hide();
                document.getElementById('wplc_chatmsg').disabled = true;
            }   

            wplc_is_chat_open = true;

               

            
        }

        //allows for a class to open chat window now
        jQuery("body").on("click", ".wp-live-chat-now", function() {
            open_chat(0);
        });
        
        jQuery(document).on("wplc_minimize_chat", function() {
            wplc_is_minimized = true;

            Cookies.set('wplc_minimize', "yes", { expires: 1, path: '/' });
            wplc_chat_status = Cookies.get('wplc_chat_status');
            
            if(typeof wplc_start_chat_pro_custom_fields_filter !== "undefined" && typeof wplc_start_chat_pro_custom_fields_filter === "function"){
                wplc_extra_data = wplc_start_chat_pro_custom_fields_filter(wplc_extra_data);
            }

            if(wplc_chat_status != 5 && wplc_chat_status != 10 && wplc_chat_status != 9 && wplc_chat_status != 8){
                if (wplc_online) {
                    var data = {
                        action: 'wplc_user_minimize_chat',
                        security: wplc_nonce,
                        cid: wplc_cid,
                        wplc_extra_data:wplc_extra_data
                    };
                    
                    jQuery.post(wplc_ajaxurl, data, function(response) {

                    });
                }
            }

            if (typeof wplc_enable_ga !== "undefined" && wplc_enable_ga === '1' && wplc_online) {
                if (typeof ga !== "undefined") {
                    ga('send', {
                      hitType: 'event',
                      eventCategory: 'WP_Live_Chat_Support',
                      eventAction: 'Event',
                      eventLabel: 'Minimize Chat'
                    });
                }
            }
        });
        jQuery(document).on("wplc_start_chat", function() {
            if (typeof wplc_enable_ga !== "undefined" && wplc_enable_ga === '1') {
                if (typeof ga !== "undefined") {
                    ga('send', {
                      hitType: 'event',
                      eventCategory: 'WP_Live_Chat_Support',
                      eventAction: 'Event',
                      eventLabel: 'Start Chat'
                    });
                }
            }
        });        
        jQuery(document).on("wplc_open_chat_1", function() {
            if (typeof wplc_enable_ga !== "undefined" && wplc_enable_ga === '1') {
                if (typeof ga !== "undefined") {
                    ga('send', {
                      hitType: 'event',
                      eventCategory: 'WP_Live_Chat_Support',
                      eventAction: 'Event',
                      eventLabel: 'Start Chat - Step 1'
                    });
                }
            }
        });        
        jQuery(document).on("wplc_open_chat_2", function() {
            if (typeof wplc_enable_ga !== "undefined" && wplc_enable_ga === '1') {
                if (typeof ga !== "undefined") {
                    ga('send', {
                      hitType: 'event',
                      eventCategory: 'WP_Live_Chat_Support',
                      eventAction: 'Event',
                      eventLabel: 'Start Chat - Step 2'
                    });
                }
            }
        });        

        jQuery(document).on("wplc_agent_joined", function(e) {
            var temail = '';
            var tname = '';
            var taid = '';
            var ta_tagline = '';
            var ta_bio = '';

            if (typeof e.ndata.other.email !== "undefined") { temail = e.ndata.other.email; }
            if (typeof e.ndata.other.name !== "undefined") { tname = e.ndata.other.name; }
            if (typeof e.ndata.other.aid !== "undefined") { taid = e.ndata.other.aid; }
            if (typeof e.ndata.other.agent_tagline !== "undefined") { ta_tagline = e.ndata.other.agent_tagline; }
            if (typeof e.ndata.other.agent_bio !== "undefined") { ta_bio = e.ndata.other.agent_bio; }
            wplc_current_agent = e.ndata.other;

            jQuery(".wplc_no_answer").remove();

            jQuery(".admin_chat_name").html(tname);
            wplc_node_pair_name = tname;
            wplc_agent_name = tname;
        });
       

        jQuery("body").on("click", "#wplc_start_chat_btn", function() {
            var wplc_name = jQuery("#wplc_name").val();
            var wplc_email = jQuery("#wplc_email").val(); 
            
            if (wplc_name.length <= 0) { alert(wplc_error_messages.valid_name); return false; }
            if (wplc_email.length <= 0) { alert(wplc_error_messages.valid_email); return false; }

            if(jQuery("#wplc_email").attr('wplc_hide') !== "1"){
                var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,12}$/i;
                
                //var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                if (!testEmail.test(wplc_email)){
                    alert(wplc_error_messages.valid_email); return false;
                }
            }
            document.getElementById('wplc_chatmsg').disabled = false;

            /* start the long polling */
            wplc_run = true;

            wplc_send_welcome_message();
            wplc_scroll_to_bottom();
            
            /*
            if (wplc_filter_run_override === "1" || wplc_online === false) { } else {
                initial_data.status = 2;
                // force the loop to start only now, as we are not using the initiate extension
                wplc_call_to_server_chat(initial_data,false,false);
            }*/

            jQuery.event.trigger({type: "wplc_start_chat"});
           
            
            var date = new Date();
            date.setTime(date.getTime() + (2 * 60 * 1000));
            
            wplc_cid = Cookies.get('wplc_cid');

            if(typeof wplc_start_chat_pro_custom_fields_filter !== "undefined" && typeof wplc_start_chat_pro_custom_fields_filter === "function"){
                wplc_extra_data = wplc_start_chat_pro_custom_fields_filter(wplc_extra_data);
            }
            
            if (typeof wplc_cid !== "undefined" && wplc_cid !== null) { 
                /* we've already recorded a cookie for this person */
                var data = {
                        action: 'wplc_start_chat',
                        security: wplc_nonce,
                        name: wplc_name,
                        email: wplc_email,
                        cid: wplc_cid,
                        wplcsession: wplc_session_variable,
                        wplc_extra_data:wplc_extra_data                        
                };

                if(typeof wplc_start_chat_pro_data !== "undefined" && typeof wplc_start_chat_pro_data === "function"){
                    data = wplc_start_chat_pro_data(data);
                }   
            } else { // no cookie recorded yet for this visitor
                var data = {
                        action: 'wplc_start_chat',
                        security: wplc_nonce,
                        name: wplc_name,
                        email: wplc_email,
                        wplcsession: wplc_session_variable,
                        wplc_extra_data:wplc_extra_data                        
                };
                
                if(typeof wplc_start_chat_pro_data !== "undefined" && typeof wplc_start_chat_pro_data === "function"){
                    data = wplc_start_chat_pro_data(data);
                }   
            }

            Cookies.set('wplc_name', wplc_name, { path: '/' } );
            Cookies.set('wplc_email', wplc_email, { path: '/' } );

            wplc_server.send(wplc_ajaxurl, data, "POST", 120000, 
                function(response){
                    wplc_chat_status = 2;
                    Cookies.set('wplc_chat_status', 2, { expires: date, path: '/' });
                    wplc_cid = jQuery.trim(response);

                    //All sorted, let's check for message transport mode
                    wplc_server.prepareTransport(function(){
                        //Transport ready...
                        wplc_server_last_loop_data.status = 2; //Set to waiting
                        if (wplc_filter_run_override === "1" || wplc_online === false) {  } else {
                            wplc_call_to_server_chat(wplc_server_last_loop_data);
                        }
                    }, wplc_user_message_receiver, wplc_user_retry_handler, wplc_log_connection_error);
                },
                function(){
                    //Fails
                },
                function(response, wplc_send_data){
                    //Complete
                    if (typeof wplc_send_data !== "undefined" && typeof wplc_send_data['action'] !== "undefined" && wplc_send_data['action'] == 'wplc_start_chat') {
                        /* we got here because the short poll  (when disabling the initiate chat feature) comes back on the "complete" callback. This check makes sure we restart the longpoll */
                        wplc_chat_status = 2;
                        Cookies.set('wplc_chat_status', 2, { expires: date, path: '/' });
                        wplc_cid = jQuery.trim(response);

                        //All sorted, let's check for message transport mode
                        wplc_server.prepareTransport(function(){
                            //Transport ready...
                            wplc_server_last_loop_data.status = 2; //Set to waiting
                            if (wplc_filter_run_override === "1" || wplc_online === false) {  } else {
                                wplc_call_to_server_chat(wplc_server_last_loop_data);
                            }
                        }, wplc_user_message_receiver, wplc_user_retry_handler, wplc_log_connection_error);
                    }
                    
                }
            );
        });


        jQuery("body").on("click", "#wplc_na_msg_btn", function() {
            var wplc_name = jQuery("#wplc_name").val();
            var wplc_email = jQuery("#wplc_email").val();
            var wplc_msg = jQuery("#wplc_message").val();
            var wplc_domain = jQuery("#wplc_domain_offline").val();
            var ip_address = jQuery("#wplc_ip_address").val();
            
            if (wplc_name.length <= 0) { alert(wplc_error_messages.valid_name); return false; }
            if (wplc_email.length <= 0) { alert(wplc_error_messages.valid_email); return false; }
            var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,12}$/i;
            if (!testEmail.test(wplc_email)){
                alert(wplc_error_messages.valid_email); return false;
            }
            if (wplc_msg.length <= 0) { alert(wplc_error_messages.empty_message); return false; }
            jQuery("#wp-live-chat-2-info").hide();
            jQuery("#wplc_message_div").html(wplc_offline_msg);

            wplc_cid = Cookies.get('wplc_cid');
                            
            var data = {
                    action: 'wplc_user_send_offline_message',
                    security: wplc_nonce,
                    cid: wplc_cid,
                    name: wplc_name,
                    email: wplc_email,
                    msg: wplc_msg,
                    ip: ip_address,
                    domain: wplc_domain,
                    wplc_extra_data:wplc_extra_data
            };
            
            jQuery.post(wplc_ajaxurl_site, data, function(response) {
                jQuery("#wplc_message_div").html(wplc_offline_msg3);
            });
            if (typeof wplc_enable_ga !== "undefined" && wplc_enable_ga === '1') {
                if (typeof ga !== "undefined") {
                    ga('send', {
                      hitType: 'event',
                      eventCategory: 'WP_Live_Chat_Support',
                      eventAction: 'Event',
                      eventLabel: 'User Send Offline Message'
                    });
                }
            }
        });
        

        function wplc_strip(str) {
            str=str.replace(/<br>/gi, "\n");
            str=str.replace(/<p.*>/gi, "\n");
            str=str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1) ");
            str=str.replace(/<(?:.|\s)*?>/g, "");

            str=str.replace('iframe', "");    
            str=str.replace('src', "");    
            str=str.replace('href', "");  
            str=str.replace('<', "");  
            str=str.replace('>', "");  

            /* remove the last carriage return from the text area output */
            str=str.replace(/\n$/, "")

            return str;
        }


        jQuery("body").on("keyup","#wplc_chatmsg", function(event){
            if(event.keyCode === 13){
                jQuery("#wplc_send_msg").trigger("click");
            }
        });
        jQuery("body").on("click", "#wplc_send_msg", function() {
            var wplc_cid = jQuery("#wplc_cid").val();
            if (wplc_cid.length < 1) {
                /* failover for wplc_cid */
                var wplc_cid = Cookies.get('wplc_cid');
            }
            var wplc_chat = wplc_strip(document.getElementById('wplc_chatmsg').value);

            if(wplc_chat !== ""){
                var wplc_name = jQuery("#wplc_name").val();
                if (typeof wplc_name == "undefined" || wplc_name == null || wplc_name == "") {
                    wplc_name = Cookies.get('wplc_name');
                }
                if (typeof wplc_name == "undefined") {
                    wplc_name = 'Guest';
                }

                var wplc_email = jQuery("#wplc_email").val();
                if (typeof wplc_email == "undefined" || wplc_email == null || wplc_email == "") {
                    wplc_email = Cookies.get('wplc_email');
                }
                if (typeof wplc_email == "undefined") {
                    wplc_email = '';
                }


                

                /*Nifty format Parse*/
                var wplc_chat_parsed = wplc_chat;
                
                //if(typeof niftyFormatParser !== "undefined"){
                //    wplc_chat_parsed = niftyFormatParser(wplc_chat_parsed);
                //}
            
                if( typeof wplc_display_name !== 'undefined' ){
                    /**
                     * We're still using the old options
                     */
                    if(wplc_display_name == 'display'){
                        if (wplc_gravatar_image.length > 1) {
                            jQuery("#wplc_chatbox").append("<span class='wplc-user-message wplc-color-bg-1 wplc-color-2 wplc-color-border-1'>"+wplc_gravatar_image+" <strong>"+wplc_name+"</strong>: "+wplc_chat_parsed+"</span><br /><div class='wplc-clear-float-message'></div>");
                        } else {
                            jQuery("#wplc_chatbox").append("<span class='wplc-user-message wplc-color-bg-1 wplc-color-2 wplc-color-border-1'><img src='//www.gravatar.com/avatar/"+md5(wplc_email)+"?s=30' class='wplc-user-message-avatar' \/> <strong>"+wplc_name+"</strong>: "+wplc_chat_parsed+"</span><br /><div class='wplc-clear-float-message'></div>");
                        }
                    } else {
                        jQuery("#wplc_chatbox").append("<span class='wplc-user-message wplc-color-bg-1 wplc-color-2 wplc-color-border-1'>"+wplc_chat_parsed+"</span><div class='wplc-clear-float-message'></div>");
                    }
                } else {
                    the_message = {};
                    the_message.originates = 2;
                    the_message.msg = wplc_chat_parsed;
                    the_message.other = {};
                    var wplc_d = new Date();
                    the_message.other.datetime = Math.round( wplc_d.getTime() / 1000 );
                    wplc_push_message_to_chatbox(the_message,'u', function() {
                        wplc_scroll_to_bottom();    
                    });

                   
                }
                
                wplc_scroll_to_bottom();
                

                var data = {
                        action: 'wplc_user_send_msg',
                        security: wplc_nonce,
                        cid: wplc_cid,
                        msg: wplc_chat_parsed,
                        wplc_extra_data:wplc_extra_data
                };
               
                wplc_server.sendMessage(wplc_ajaxurl, data, "POST", 120000, 
                    function(){
                        //Success
                        wplc_server.asyncStorage(wplc_ajaxurl, data, 120000);
                    }, function(){
                        //Fail
                    }, function(){
                        //Complete
                    }
                );
                
                if (typeof wplc_enable_ga !== "undefined" && wplc_enable_ga === '1') {
                    if (typeof ga !== "undefined") {
                        ga('send', {
                          hitType: 'event',
                          eventCategory: 'WP_Live_Chat_Support',
                          eventAction: 'Event',
                          eventLabel: 'User Send Message'
                        });
                    }
                }
            }

            jQuery("#wplc_chatmsg").val('');


        });   

        jQuery(document).on("wplc_open_chat", function (event) {
            /* what is the current status? */
            wplc_chat_status = Cookies.get('wplc_chat_status');            
            if( typeof wplc_chat_status === 'undefined' ){
                Cookies.set('wplc_chat_status', 5, { expires: 1, path: '/' });
            }
            var wplc_tmp_checker = wplc_pre_open_check_status(status, function() {
                open_chat();
            });
        }); 

        jQuery(document).on("wplc_end_chat", function(){
            /* Clear Cookies */
            Cookies.remove('wplc_chat_status');
            Cookies.remove('wplc_cid');
            //Cookies.remove('wplc_name');
            //Cookies.remove('wplc_email');

            /* Close ports if applicable*/
            wplc_server.forceClosePort();

            /* Check if we should redirect */
            if(typeof wplc_redirect_thank_you !== "undefined" && wplc_redirect_thank_you !== null && wplc_redirect_thank_you !== ""){
                window.location = wplc_redirect_thank_you;
            }
        });

        function wplc_pre_open_check_status(status, callback) {
            if (typeof wplc_chat_status !== 'undefined' && ( typeof wplc_chat_status.length !== 'undefined' && wplc_chat_status.length > 0 ) ) {
                if (parseInt(wplc_chat_status) === 10 || parseInt(wplc_chat_status) === 7) {
                    /* it was minimized or timedout, now we need to open it - set status to 3 (back to open chat) */
                    Cookies.set('wplc_chat_status', 3, { expires: 1, path: '/' });

                }
                if (parseInt(wplc_chat_status) === 0 || parseInt(wplc_chat_status) === 12) {
                    /* no answer from agent previously */
                    // Cookies.set('wplc_chat_status', 5, { expires: 1, path: '/' });                    
                }
                if (parseInt(wplc_chat_status) === 8) {
                    /* no answer from agent previously */
                    cnonsole.log("now setting it to 5");
                    Cookies.set('wplc_chat_status', 5, { expires: 1, path: '/' });                    
                }
               
            }
            callback();
        }

        if(typeof wplc_elem_trigger_id !== "undefined" && wplc_elem_trigger_id !== ""){
            var wplc_click_or_hover = 0;
            var wplc_class_or_id = 0;

            if(typeof wplc_elem_trigger_action !== "undefined" && wplc_elem_trigger_action !== ""){ wplc_click_or_hover = parseInt(wplc_elem_trigger_action); }
            if(typeof wplc_elem_trigger_type !== "undefined" && wplc_elem_trigger_type !== ""){ wplc_class_or_id = parseInt(wplc_elem_trigger_type); }
            
            jQuery( (wplc_class_or_id === 1 ? "#" : ".") + wplc_elem_trigger_id).on( (wplc_click_or_hover === 1 ? "mouseenter" : "click"), function(){
                open_chat(0);
            });
        }

    // Fix conflict with Responsive Lighbox plugin
    setTimeout(function () {
        if (jQuery('html').hasClass('nivo-lightbox-notouch') || jQuery('a[rel*="lightbox"]').length) {
            jQuery("body").on("keyup", function (event) {
                if (event.keyCode === 13) {
                    jQuery("#wplc_send_msg").trigger("click");
                }
            });
        }
    }, 5000);


});
// source --> https://www.vensera.com/wp-content/plugins/wp-live-chat-support/js/md5.js 
function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = wplc_ff(a, b, c, d, k[0], 7, -680876936);
d = wplc_ff(d, a, b, c, k[1], 12, -389564586);
c = wplc_ff(c, d, a, b, k[2], 17,  606105819);
b = wplc_ff(b, c, d, a, k[3], 22, -1044525330);
a = wplc_ff(a, b, c, d, k[4], 7, -176418897);
d = wplc_ff(d, a, b, c, k[5], 12,  1200080426);
c = wplc_ff(c, d, a, b, k[6], 17, -1473231341);
b = wplc_ff(b, c, d, a, k[7], 22, -45705983);
a = wplc_ff(a, b, c, d, k[8], 7,  1770035416);
d = wplc_ff(d, a, b, c, k[9], 12, -1958414417);
c = wplc_ff(c, d, a, b, k[10], 17, -42063);
b = wplc_ff(b, c, d, a, k[11], 22, -1990404162);
a = wplc_ff(a, b, c, d, k[12], 7,  1804603682);
d = wplc_ff(d, a, b, c, k[13], 12, -40341101);
c = wplc_ff(c, d, a, b, k[14], 17, -1502002290);
b = wplc_ff(b, c, d, a, k[15], 22,  1236535329);

a = wplc_gg(a, b, c, d, k[1], 5, -165796510);
d = wplc_gg(d, a, b, c, k[6], 9, -1069501632);
c = wplc_gg(c, d, a, b, k[11], 14,  643717713);
b = wplc_gg(b, c, d, a, k[0], 20, -373897302);
a = wplc_gg(a, b, c, d, k[5], 5, -701558691);
d = wplc_gg(d, a, b, c, k[10], 9,  38016083);
c = wplc_gg(c, d, a, b, k[15], 14, -660478335);
b = wplc_gg(b, c, d, a, k[4], 20, -405537848);
a = wplc_gg(a, b, c, d, k[9], 5,  568446438);
d = wplc_gg(d, a, b, c, k[14], 9, -1019803690);
c = wplc_gg(c, d, a, b, k[3], 14, -187363961);
b = wplc_gg(b, c, d, a, k[8], 20,  1163531501);
a = wplc_gg(a, b, c, d, k[13], 5, -1444681467);
d = wplc_gg(d, a, b, c, k[2], 9, -51403784);
c = wplc_gg(c, d, a, b, k[7], 14,  1735328473);
b = wplc_gg(b, c, d, a, k[12], 20, -1926607734);

a = wplc_hh(a, b, c, d, k[5], 4, -378558);
d = wplc_hh(d, a, b, c, k[8], 11, -2022574463);
c = wplc_hh(c, d, a, b, k[11], 16,  1839030562);
b = wplc_hh(b, c, d, a, k[14], 23, -35309556);
a = wplc_hh(a, b, c, d, k[1], 4, -1530992060);
d = wplc_hh(d, a, b, c, k[4], 11,  1272893353);
c = wplc_hh(c, d, a, b, k[7], 16, -155497632);
b = wplc_hh(b, c, d, a, k[10], 23, -1094730640);
a = wplc_hh(a, b, c, d, k[13], 4,  681279174);
d = wplc_hh(d, a, b, c, k[0], 11, -358537222);
c = wplc_hh(c, d, a, b, k[3], 16, -722521979);
b = wplc_hh(b, c, d, a, k[6], 23,  76029189);
a = wplc_hh(a, b, c, d, k[9], 4, -640364487);
d = wplc_hh(d, a, b, c, k[12], 11, -421815835);
c = wplc_hh(c, d, a, b, k[15], 16,  530742520);
b = wplc_hh(b, c, d, a, k[2], 23, -995338651);

a = wplc_ii(a, b, c, d, k[0], 6, -198630844);
d = wplc_ii(d, a, b, c, k[7], 10,  1126891415);
c = wplc_ii(c, d, a, b, k[14], 15, -1416354905);
b = wplc_ii(b, c, d, a, k[5], 21, -57434055);
a = wplc_ii(a, b, c, d, k[12], 6,  1700485571);
d = wplc_ii(d, a, b, c, k[3], 10, -1894986606);
c = wplc_ii(c, d, a, b, k[10], 15, -1051523);
b = wplc_ii(b, c, d, a, k[1], 21, -2054922799);
a = wplc_ii(a, b, c, d, k[8], 6,  1873313359);
d = wplc_ii(d, a, b, c, k[15], 10, -30611744);
c = wplc_ii(c, d, a, b, k[6], 15, -1560198380);
b = wplc_ii(b, c, d, a, k[13], 21,  1309151649);
a = wplc_ii(a, b, c, d, k[4], 6, -145523070);
d = wplc_ii(d, a, b, c, k[11], 10, -1120210379);
c = wplc_ii(c, d, a, b, k[2], 15,  718787259);
b = wplc_ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function wplc_cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function wplc_ff(a, b, c, d, x, s, t) {
return wplc_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function wplc_gg(a, b, c, d, x, s, t) {
return wplc_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function wplc_hh(a, b, c, d, x, s, t) {
return wplc_cmn(b ^ c ^ d, a, b, x, s, t);
}

function wplc_ii(a, b, c, d, x, s, t) {
return wplc_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function wplc_md51(s) {
txt = '';
var n = s.length,
state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) {
md5cycle(state, md5blk(s.substring(i-64, i)));
}
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++)
tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) {
md5cycle(state, tail);
for (i=0; i<16; i++) tail[i] = 0;
}
tail[14] = n*8;
md5cycle(state, tail);
return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
var md5blks = [], i; /* Andy King said do it this way. */
for (i=0; i<64; i+=4) {
md5blks[i>>2] = s.charCodeAt(i)
+ (s.charCodeAt(i+1) << 8)
+ (s.charCodeAt(i+2) << 16)
+ (s.charCodeAt(i+3) << 24);
}
return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function wplc_rhex(n)
{
var s='', j=0;
for(; j<4; j++)
s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
+ hex_chr[(n >> (j * 8)) & 0x0F];
return s;
}

function wplc_hex(x) {
for (var i=0; i<x.length; i++)
x[i] = wplc_rhex(x[i]);
return x.join('');
}

function md5(s) {
return wplc_hex(wplc_md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
return (a + b) & 0xFFFFFFFF;
}	

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
function add32(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF),
msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}
};
// source --> https://www.vensera.com/wp-content/plugins/wp-live-chat-support/js/themes/modern.js 


jQuery(document).on("wplc_minimize_chat", function( e ) {
    wplc_is_chat_open = false;
    jQuery('#wp-live-chat').height("");
    if(jQuery("#wp-live-chat").attr("original_pos") === "bottom_right"){
        jQuery("#wp-live-chat").css("left", "");
        jQuery("#wp-live-chat").css("bottom", "0");
        jQuery("#wp-live-chat").css("right", "20px");
    } else if(jQuery("#wp-live-chat").attr("original_pos") === "bottom_left"){
        jQuery("#wp-live-chat").css("left", "20px");
        jQuery("#wp-live-chat").css("bottom", "0");
        jQuery("#wp-live-chat").css("right", "");
    } else if(jQuery("#wp-live-chat").attr("original_pos") === "left"){
        jQuery("#wp-live-chat").css("left", "20px");
        jQuery("#wp-live-chat").css("bottom", "100px");
    } else if(jQuery("#wp-live-chat").attr("original_pos") === "right"){
        //jQuery("#wp-live-chat").css("left", "");
        //jQuery("#wp-live-chat").css("right", "0");
        //jQuery("#wp-live-chat").css("bottom", "100px");
        //jQuery("#wp-live-chat").css("width", "");
    }
    jQuery('#wp-live-chat').addClass("wplc_close");
    jQuery('#wp-live-chat').removeClass("wplc_open");
    //jQuery("#wp-live-chat").css(jQuery("#wp-live-chat").attr("original_pos"), "100px");
    jQuery("#wp-live-chat").css("top", "");
    jQuery("#wp-live-chat").css("height", "");
    jQuery("#wp-live-chat-1").show();
    jQuery("#wp-live-chat-1").css('cursor', 'pointer');
    jQuery("#wp-live-chat-2").hide();
    jQuery("#wp-live-chat-3").hide();
    jQuery("#wp-live-chat-4").hide();
    jQuery("#wplc_social_holder").hide();
    jQuery("#nifty_ratings_holder").hide();
    jQuery("#nifty_ratings_holder").hide();
    jQuery("#wp-live-chat-react").hide();
    jQuery("#wp-live-chat-minimize").hide();

    jQuery("#wp-live-chat-header").show();

});

jQuery(document).on("wplc_start_chat", function( e ) { 
	jQuery("#wp-live-chat-2-inner").hide("slow");
	/* changed in version 7 as we now allow users to start typing immediately */
    /* jQuery("#wp-live-chat-3").show(); */
    jQuery.event.trigger({type: "wplc_open_chat_1"});
    jQuery.event.trigger({type: "wplc_open_chat_2", wplc_online: wplc_online});

});

jQuery(document).on( "wplc_open_chat_1", function( e ) {
    jQuery('#wp-live-chat').removeClass("wplc_close");
    jQuery('#wp-live-chat').addClass("wplc_open");
    jQuery("#wp-live-chat-react").hide();
    
    //jQuery("#wp-live-chat-header").hide();
    
    Cookies.set('wplc_hide', "", { expires: 1, path: '/' });
    jQuery("#wp-live-chat-minimize").show();




});
jQuery(document).on("wplc_agent_joined", function(e) {

    var temail = '';
    var tname = '';
    var taid = '';
    var ta_tagline = '';
    var ta_bio = '';
    var ta_social_links = '';

    if (typeof e.ndata.other.email !== "undefined") { temail = e.ndata.other.email; }
    if (typeof e.ndata.other.name !== "undefined") { tname = e.ndata.other.name; }
    if (typeof e.ndata.other.aid !== "undefined") { taid = e.ndata.other.aid; }
    if (typeof e.ndata.other.agent_tagline !== "undefined") { ta_tagline = e.ndata.other.agent_tagline; }
    if (typeof e.ndata.other.agent_bio !== "undefined") { ta_bio = e.ndata.other.agent_bio; }
    if (typeof e.ndata.other.social_links !== "undefined") { ta_social_links = e.ndata.other.social_links; }


    jQuery(".wplc_no_answer").remove();

    jQuery(".admin_chat_name").html(tname);
    wplc_node_pair_name = tname;
    wplc_agent_name = tname;

    var timageurl = 'https://www.gravatar.com/avatar/'+temail;

    jQuery(".wplc_agent_info").html('');
    if ( ! jQuery( '#agent_grav_'+taid ).length ) {
      jQuery('<p/>', {
        'class': '',
        'style': 'text-align:center;',
        html: '<img class="img-thumbnail img-circle wplc_thumb32 wplc_agent_involved" style="max-width:inherit;" id="agent_grav_'+taid+'" title="'+tname+'" src="'+timageurl+'?s=40" /><br /><span class="wplc_agent_name wplc-color-2">'+tname+'</span>'+ta_tagline+ta_bio+ta_social_links
      }).appendTo('.wplc_agent_info');
    }
    var csst = "url(https://www.gravatar.com/avatar/20a6e5c8b75ce87f4896f46ed6f49832?s=60);";

    jQuery("#wplc_chatbox_header_bg").css('background-image', 'url('+timageurl+'?s=380)');
    jQuery("#wplc_chatbox").css("top",
       jQuery("#wplc_chatbox_header").height()+18+"px"
    );
});



jQuery(document).on("wplc_animation_done", function(e) {

    jQuery("#nifty_text_editor_holder").remove(); 
    jQuery("#wplc_msg_notice").remove();
    jQuery("#wp-live-chat-minimize").remove();

    jQuery("#wplc_logo").prependTo("#wplc_chatbox_header");





    if (jQuery("wplc_chatbox").hasClass("wplc-shrink")) {
        /**
         * The +18px is to compensate for the 18px of padding at the bottom of the header box
         */
        jQuery("#wplc_chatbox").css("top",
           jQuery("#wplc_chatbox_header").height()+18+"px"
        );
        jQuery("#wplc_logo").show();
    } else {
        /**
         * The +18px is to compensate for the 18px of padding at the bottom of the header box
         */
        jQuery("#wplc_chatbox").css("top",
            jQuery("#wplc_chatbox_header").height()+18+"px"
        ); 
        jQuery("#wplc_logo").hide();
    }
    jQuery("#wplc_chatbox").css("bottom", "0");
        


});
jQuery(document).on( "wplc_open_chat_2", function( e ) {
	jQuery("#wp-live-chat-1").hide();
	jQuery("#wp-live-chat-2-inner").hide();

	jQuery("#wp-live-chat-2").show();

    if(!jQuery("#wp-live-chat-header").hasClass("active")){
       jQuery("#wplc_chatmsg").focus();
    }

    jQuery("#wp-live-chat-header").addClass("active");

    wplc_chat_status = Cookies.get('wplc_chat_status');
    if (typeof e.wplc_online !== "undefined" && e.wplc_online === true) {
	   jQuery("#wp-live-chat-4").show();
       jQuery("#wplc_social_holder").show();
       jQuery("#nifty_ratings_holder").show();
       jQuery.event.trigger({type: "wplc_animation_done"});
       
       
    }

	jQuery("#wp-live-chat-3").hide();

	jQuery("#wp-live-chat-minimize").css("right","23px");
	Cookies.set('wplc_minimize', "", { expires: 1, path: '/' });



});



var wplc_leave_window_alone = false;

jQuery(document).ready(function() { 

    
    jQuery("body").on("mousewheel", "#wplc_chatbox", function(turn, delta){

        if (delta == 1) {
            /**
             * The +18px is to compensate for the 18px of padding at the bottom of the header box
             */
            jQuery("#wplc_chatbox_header").removeClass("wplc-shrink"); 
            jQuery("#wplc_chatbox").css("top",
                jQuery("#wplc_chatbox_header").height()+18+"px"
            );  
            jQuery("#wplc_logo").show();
      } 
          else {
            // going down



            /**
             * The +18px is to compensate for the 18px of padding at the bottom of the header box
             */
            jQuery("#wplc_chatbox_header").addClass("wplc-shrink"); 
            jQuery("#wplc_chatbox").css("top",
                jQuery("#wplc_chatbox_header").height()+18+"px"
            );    
            jQuery("#wplc_logo").hide();

        }

    });


	//opens chat when clicked on top bar
	jQuery("body").on("click", "#wp-live-chat-header", function() {
       
        
	});


    jQuery("body").on("click", ".wplc_retry_chat", function() {            
        jQuery("#wplc_chatbox").html("");
        jQuery("#wp-live-chat-4").fadeOut();
        Cookies.remove('wplc_chat_status');
        jQuery("#wp-live-chat-2-inner").fadeIn();
        wplc_shown_welcome = false;
    });


    jQuery("body").on("click", "#wp-live-chat-header", function(){
        //if (!wplc_is_chat_open) {

            if (jQuery(this).hasClass('active')) {
                jQuery("#wplc_hovercard").fadeOut("fast");
                jQuery("#wp-live-chat-2").fadeOut("fast");
                jQuery(this).removeClass('active');
                jQuery.event.trigger({type: "wplc_minimize_chat"});
                
            } else {
                jQuery("#wplc_hovercard").fadeIn('fast');
                jQuery(this).addClass('active');

                wplc_chat_status = Cookies.get('wplc_chat_status');
                if (parseInt(wplc_chat_status) == 3 || parseInt(wplc_chat_status) == 2 || parseInt(wplc_chat_status) == 0 || parseInt(wplc_chat_status) == 12 || parseInt(wplc_chat_status) == 10) {
                    jQuery("#speeching_button").click();
                }

            }


            
        //}
    });
    jQuery("body").on("click", "#wplc_hovercard_min", function() {
     jQuery("#wplc_hovercard").fadeOut('fast');
    });
    jQuery("body").on("click", "#speeching_button", function() {
        jQuery("#wplc_hovercard").fadeOut("fast");
        jQuery("#wplc-chat-alert").removeClass('is-active');
        wplc_is_chat_open = true;
        jQuery.event.trigger({type: "wplc_open_chat"});
        
    });
    jQuery("body").on("click", "#wp-live-chat-minimize", function() {

        jQuery("#wp-live-chat-header").removeClass('active');
    })



            


});

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
// source --> https://www.vensera.com/wp-content/plugins/wp-live-chat-support/js/jquery-cookie.js 
/*!
 * JavaScript Cookie v2.1.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		var _OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = _OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
					attributes.path    && '; path=' + attributes.path,
					attributes.domain  && '; domain=' + attributes.domain,
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var name = parts[0].replace(rdecode, decodeURIComponent);
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.get = api.set = api;
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
// source --> https://www.vensera.com/wp-content/plugins/revslider/public/assets/js/jquery.themepunch.tools.min.js 
/********************************************
	-	THEMEPUNCH TOOLS Ver. 1.0     -
	 Last Update of Tools 27.02.2015
*********************************************/


/*
* @fileOverview TouchSwipe - jQuery Plugin
* @version 1.6.9
*
* @author Matt Bryson http://www.github.com/mattbryson
* @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
* @see http://labs.skinkers.com/touchSwipe/
* @see http://plugins.jquery.com/project/touchSwipe
*
* Copyright (c) 2010 Matt Bryson
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/



(function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{a(jQuery)}}(function(f){var y="1.6.9",p="left",o="right",e="up",x="down",c="in",A="out",m="none",s="auto",l="swipe",t="pinch",B="tap",j="doubletap",b="longtap",z="hold",E="horizontal",u="vertical",i="all",r=10,g="start",k="move",h="end",q="cancel",a="ontouchstart" in window,v=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled,d=window.navigator.pointerEnabled||window.navigator.msPointerEnabled,C="TouchSwipe";var n={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:true};f.fn.swipetp=function(H){var G=f(this),F=G.data(C);if(F&&typeof H==="string"){if(F[H]){return F[H].apply(this,Array.prototype.slice.call(arguments,1))}else{f.error("Method "+H+" does not exist on jQuery.swipetp")}}else{if(!F&&(typeof H==="object"||!H)){return w.apply(this,arguments)}}return G};f.fn.swipetp.version=y;f.fn.swipetp.defaults=n;f.fn.swipetp.phases={PHASE_START:g,PHASE_MOVE:k,PHASE_END:h,PHASE_CANCEL:q};f.fn.swipetp.directions={LEFT:p,RIGHT:o,UP:e,DOWN:x,IN:c,OUT:A};f.fn.swipetp.pageScroll={NONE:m,HORIZONTAL:E,VERTICAL:u,AUTO:s};f.fn.swipetp.fingers={ONE:1,TWO:2,THREE:3,ALL:i};function w(F){if(F&&(F.allowPageScroll===undefined&&(F.swipe!==undefined||F.swipeStatus!==undefined))){F.allowPageScroll=m}if(F.click!==undefined&&F.tap===undefined){F.tap=F.click}if(!F){F={}}F=f.extend({},f.fn.swipetp.defaults,F);return this.each(function(){var H=f(this);var G=H.data(C);if(!G){G=new D(this,F);H.data(C,G)}})}function D(a5,aw){var aA=(a||d||!aw.fallbackToMouseEvents),K=aA?(d?(v?"MSPointerDown":"pointerdown"):"touchstart"):"mousedown",az=aA?(d?(v?"MSPointerMove":"pointermove"):"touchmove"):"mousemove",V=aA?(d?(v?"MSPointerUp":"pointerup"):"touchend"):"mouseup",T=aA?null:"mouseleave",aE=(d?(v?"MSPointerCancel":"pointercancel"):"touchcancel");var ah=0,aQ=null,ac=0,a2=0,a0=0,H=1,ar=0,aK=0,N=null;var aS=f(a5);var aa="start";var X=0;var aR=null;var U=0,a3=0,a6=0,ae=0,O=0;var aX=null,ag=null;try{aS.bind(K,aO);aS.bind(aE,ba)}catch(al){f.error("events not supported "+K+","+aE+" on jQuery.swipetp")}this.enable=function(){aS.bind(K,aO);aS.bind(aE,ba);return aS};this.disable=function(){aL();return aS};this.destroy=function(){aL();aS.data(C,null);aS=null};this.option=function(bd,bc){if(aw[bd]!==undefined){if(bc===undefined){return aw[bd]}else{aw[bd]=bc}}else{f.error("Option "+bd+" does not exist on jQuery.swipetp.options")}return null};function aO(be){if(aC()){return}if(f(be.target).closest(aw.excludedElements,aS).length>0){return}var bf=be.originalEvent?be.originalEvent:be;var bd,bg=bf.touches,bc=bg?bg[0]:bf;aa=g;if(bg){X=bg.length}else{be.preventDefault()}ah=0;aQ=null;aK=null;ac=0;a2=0;a0=0;H=1;ar=0;aR=ak();N=ab();S();if(!bg||(X===aw.fingers||aw.fingers===i)||aY()){aj(0,bc);U=au();if(X==2){aj(1,bg[1]);a2=a0=av(aR[0].start,aR[1].start)}if(aw.swipeStatus||aw.pinchStatus){bd=P(bf,aa)}}else{bd=false}if(bd===false){aa=q;P(bf,aa);return bd}else{if(aw.hold){ag=setTimeout(f.proxy(function(){aS.trigger("hold",[bf.target]);if(aw.hold){bd=aw.hold.call(aS,bf,bf.target)}},this),aw.longTapThreshold)}ap(true)}return null}function a4(bf){var bi=bf.originalEvent?bf.originalEvent:bf;if(aa===h||aa===q||an()){return}var be,bj=bi.touches,bd=bj?bj[0]:bi;var bg=aI(bd);a3=au();if(bj){X=bj.length}if(aw.hold){clearTimeout(ag)}aa=k;if(X==2){if(a2==0){aj(1,bj[1]);a2=a0=av(aR[0].start,aR[1].start)}else{aI(bj[1]);a0=av(aR[0].end,aR[1].end);aK=at(aR[0].end,aR[1].end)}H=a8(a2,a0);ar=Math.abs(a2-a0)}if((X===aw.fingers||aw.fingers===i)||!bj||aY()){aQ=aM(bg.start,bg.end);am(bf,aQ);ah=aT(bg.start,bg.end);ac=aN();aJ(aQ,ah);if(aw.swipeStatus||aw.pinchStatus){be=P(bi,aa)}if(!aw.triggerOnTouchEnd||aw.triggerOnTouchLeave){var bc=true;if(aw.triggerOnTouchLeave){var bh=aZ(this);bc=F(bg.end,bh)}if(!aw.triggerOnTouchEnd&&bc){aa=aD(k)}else{if(aw.triggerOnTouchLeave&&!bc){aa=aD(h)}}if(aa==q||aa==h){P(bi,aa)}}}else{aa=q;P(bi,aa)}if(be===false){aa=q;P(bi,aa)}}function M(bc){var bd=bc.originalEvent?bc.originalEvent:bc,be=bd.touches;if(be){if(be.length){G();return true}}if(an()){X=ae}a3=au();ac=aN();if(bb()||!ao()){aa=q;P(bd,aa)}else{if(aw.triggerOnTouchEnd||(aw.triggerOnTouchEnd==false&&aa===k)){bc.preventDefault();aa=h;P(bd,aa)}else{if(!aw.triggerOnTouchEnd&&a7()){aa=h;aG(bd,aa,B)}else{if(aa===k){aa=q;P(bd,aa)}}}}ap(false);return null}function ba(){X=0;a3=0;U=0;a2=0;a0=0;H=1;S();ap(false)}function L(bc){var bd=bc.originalEvent?bc.originalEvent:bc;if(aw.triggerOnTouchLeave){aa=aD(h);P(bd,aa)}}function aL(){aS.unbind(K,aO);aS.unbind(aE,ba);aS.unbind(az,a4);aS.unbind(V,M);if(T){aS.unbind(T,L)}ap(false)}function aD(bg){var bf=bg;var be=aB();var bd=ao();var bc=bb();if(!be||bc){bf=q}else{if(bd&&bg==k&&(!aw.triggerOnTouchEnd||aw.triggerOnTouchLeave)){bf=h}else{if(!bd&&bg==h&&aw.triggerOnTouchLeave){bf=q}}}return bf}function P(be,bc){var bd,bf=be.touches;if((J()||W())||(Q()||aY())){if(J()||W()){bd=aG(be,bc,l)}if((Q()||aY())&&bd!==false){bd=aG(be,bc,t)}}else{if(aH()&&bd!==false){bd=aG(be,bc,j)}else{if(aq()&&bd!==false){bd=aG(be,bc,b)}else{if(ai()&&bd!==false){bd=aG(be,bc,B)}}}}if(bc===q){ba(be)}if(bc===h){if(bf){if(!bf.length){ba(be)}}else{ba(be)}}return bd}function aG(bf,bc,be){var bd;if(be==l){aS.trigger("swipeStatus",[bc,aQ||null,ah||0,ac||0,X,aR]);if(aw.swipeStatus){bd=aw.swipeStatus.call(aS,bf,bc,aQ||null,ah||0,ac||0,X,aR);if(bd===false){return false}}if(bc==h&&aW()){aS.trigger("swipe",[aQ,ah,ac,X,aR]);if(aw.swipe){bd=aw.swipe.call(aS,bf,aQ,ah,ac,X,aR);if(bd===false){return false}}switch(aQ){case p:aS.trigger("swipeLeft",[aQ,ah,ac,X,aR]);if(aw.swipeLeft){bd=aw.swipeLeft.call(aS,bf,aQ,ah,ac,X,aR)}break;case o:aS.trigger("swipeRight",[aQ,ah,ac,X,aR]);if(aw.swipeRight){bd=aw.swipeRight.call(aS,bf,aQ,ah,ac,X,aR)}break;case e:aS.trigger("swipeUp",[aQ,ah,ac,X,aR]);if(aw.swipeUp){bd=aw.swipeUp.call(aS,bf,aQ,ah,ac,X,aR)}break;case x:aS.trigger("swipeDown",[aQ,ah,ac,X,aR]);if(aw.swipeDown){bd=aw.swipeDown.call(aS,bf,aQ,ah,ac,X,aR)}break}}}if(be==t){aS.trigger("pinchStatus",[bc,aK||null,ar||0,ac||0,X,H,aR]);if(aw.pinchStatus){bd=aw.pinchStatus.call(aS,bf,bc,aK||null,ar||0,ac||0,X,H,aR);if(bd===false){return false}}if(bc==h&&a9()){switch(aK){case c:aS.trigger("pinchIn",[aK||null,ar||0,ac||0,X,H,aR]);if(aw.pinchIn){bd=aw.pinchIn.call(aS,bf,aK||null,ar||0,ac||0,X,H,aR)}break;case A:aS.trigger("pinchOut",[aK||null,ar||0,ac||0,X,H,aR]);if(aw.pinchOut){bd=aw.pinchOut.call(aS,bf,aK||null,ar||0,ac||0,X,H,aR)}break}}}if(be==B){if(bc===q||bc===h){clearTimeout(aX);clearTimeout(ag);if(Z()&&!I()){O=au();aX=setTimeout(f.proxy(function(){O=null;aS.trigger("tap",[bf.target]);if(aw.tap){bd=aw.tap.call(aS,bf,bf.target)}},this),aw.doubleTapThreshold)}else{O=null;aS.trigger("tap",[bf.target]);if(aw.tap){bd=aw.tap.call(aS,bf,bf.target)}}}}else{if(be==j){if(bc===q||bc===h){clearTimeout(aX);O=null;aS.trigger("doubletap",[bf.target]);if(aw.doubleTap){bd=aw.doubleTap.call(aS,bf,bf.target)}}}else{if(be==b){if(bc===q||bc===h){clearTimeout(aX);O=null;aS.trigger("longtap",[bf.target]);if(aw.longTap){bd=aw.longTap.call(aS,bf,bf.target)}}}}}return bd}function ao(){var bc=true;if(aw.threshold!==null){bc=ah>=aw.threshold}return bc}function bb(){var bc=false;if(aw.cancelThreshold!==null&&aQ!==null){bc=(aU(aQ)-ah)>=aw.cancelThreshold}return bc}function af(){if(aw.pinchThreshold!==null){return ar>=aw.pinchThreshold}return true}function aB(){var bc;if(aw.maxTimeThreshold){if(ac>=aw.maxTimeThreshold){bc=false}else{bc=true}}else{bc=true}return bc}function am(bc,bd){if(aw.preventDefaultEvents===false){return}if(aw.allowPageScroll===m){bc.preventDefault()}else{var be=aw.allowPageScroll===s;switch(bd){case p:if((aw.swipeLeft&&be)||(!be&&aw.allowPageScroll!=E)){bc.preventDefault()}break;case o:if((aw.swipeRight&&be)||(!be&&aw.allowPageScroll!=E)){bc.preventDefault()}break;case e:if((aw.swipeUp&&be)||(!be&&aw.allowPageScroll!=u)){bc.preventDefault()}break;case x:if((aw.swipeDown&&be)||(!be&&aw.allowPageScroll!=u)){bc.preventDefault()}break}}}function a9(){var bd=aP();var bc=Y();var be=af();return bd&&bc&&be}function aY(){return !!(aw.pinchStatus||aw.pinchIn||aw.pinchOut)}function Q(){return !!(a9()&&aY())}function aW(){var bf=aB();var bh=ao();var be=aP();var bc=Y();var bd=bb();var bg=!bd&&bc&&be&&bh&&bf;return bg}function W(){return !!(aw.swipe||aw.swipeStatus||aw.swipeLeft||aw.swipeRight||aw.swipeUp||aw.swipeDown)}function J(){return !!(aW()&&W())}function aP(){return((X===aw.fingers||aw.fingers===i)||!a)}function Y(){return aR[0].end.x!==0}function a7(){return !!(aw.tap)}function Z(){return !!(aw.doubleTap)}function aV(){return !!(aw.longTap)}function R(){if(O==null){return false}var bc=au();return(Z()&&((bc-O)<=aw.doubleTapThreshold))}function I(){return R()}function ay(){return((X===1||!a)&&(isNaN(ah)||ah<aw.threshold))}function a1(){return((ac>aw.longTapThreshold)&&(ah<r))}function ai(){return !!(ay()&&a7())}function aH(){return !!(R()&&Z())}function aq(){return !!(a1()&&aV())}function G(){a6=au();ae=event.touches.length+1}function S(){a6=0;ae=0}function an(){var bc=false;if(a6){var bd=au()-a6;if(bd<=aw.fingerReleaseThreshold){bc=true}}return bc}function aC(){return !!(aS.data(C+"_intouch")===true)}function ap(bc){if(bc===true){aS.bind(az,a4);aS.bind(V,M);if(T){aS.bind(T,L)}}else{aS.unbind(az,a4,false);aS.unbind(V,M,false);if(T){aS.unbind(T,L,false)}}aS.data(C+"_intouch",bc===true)}function aj(bd,bc){var be=bc.identifier!==undefined?bc.identifier:0;aR[bd].identifier=be;aR[bd].start.x=aR[bd].end.x=bc.pageX||bc.clientX;aR[bd].start.y=aR[bd].end.y=bc.pageY||bc.clientY;return aR[bd]}function aI(bc){var be=bc.identifier!==undefined?bc.identifier:0;var bd=ad(be);bd.end.x=bc.pageX||bc.clientX;bd.end.y=bc.pageY||bc.clientY;return bd}function ad(bd){for(var bc=0;bc<aR.length;bc++){if(aR[bc].identifier==bd){return aR[bc]}}}function ak(){var bc=[];for(var bd=0;bd<=5;bd++){bc.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return bc}function aJ(bc,bd){bd=Math.max(bd,aU(bc));N[bc].distance=bd}function aU(bc){if(N[bc]){return N[bc].distance}return undefined}function ab(){var bc={};bc[p]=ax(p);bc[o]=ax(o);bc[e]=ax(e);bc[x]=ax(x);return bc}function ax(bc){return{direction:bc,distance:0}}function aN(){return a3-U}function av(bf,be){var bd=Math.abs(bf.x-be.x);var bc=Math.abs(bf.y-be.y);return Math.round(Math.sqrt(bd*bd+bc*bc))}function a8(bc,bd){var be=(bd/bc)*1;return be.toFixed(2)}function at(){if(H<1){return A}else{return c}}function aT(bd,bc){return Math.round(Math.sqrt(Math.pow(bc.x-bd.x,2)+Math.pow(bc.y-bd.y,2)))}function aF(bf,bd){var bc=bf.x-bd.x;var bh=bd.y-bf.y;var be=Math.atan2(bh,bc);var bg=Math.round(be*180/Math.PI);if(bg<0){bg=360-Math.abs(bg)}return bg}function aM(bd,bc){var be=aF(bd,bc);if((be<=45)&&(be>=0)){return p}else{if((be<=360)&&(be>=315)){return p}else{if((be>=135)&&(be<=225)){return o}else{if((be>45)&&(be<135)){return x}else{return e}}}}}function au(){var bc=new Date();return bc.getTime()}function aZ(bc){bc=f(bc);var be=bc.offset();var bd={left:be.left,right:be.left+bc.outerWidth(),top:be.top,bottom:be.top+bc.outerHeight()};return bd}function F(bc,bd){return(bc.x>bd.left&&bc.x<bd.right&&bc.y>bd.top&&bc.y<bd.bottom)}}}));

if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = console.groupCollapsed = function() {};
}

if (window.tplogs==true)
	try {
		console.groupCollapsed("ThemePunch GreenSocks Logs");
	} catch(e) { }


var oldgs = window.GreenSockGlobals;
	oldgs_queue = window._gsQueue;
	
var punchgs = window.GreenSockGlobals = {};

if (window.tplogs==true)
	try {
		console.info("Build GreenSock SandBox for ThemePunch Plugins");
		console.info("GreenSock TweenLite Engine Initalised by ThemePunch Plugin");
	} catch(e) {}


/* TWEEN LITE */
/*!
 * VERSION: 1.19.0
 * DATE: 2016-07-16
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
!function(a,b){"use strict";var c={},d=a.GreenSockGlobals=a.GreenSockGlobals||a;if(!d.TweenLite){var e,f,g,h,i,j=function(a){var b,c=a.split("."),e=d;for(b=0;b<c.length;b++)e[c[b]]=e=e[c[b]]||{};return e},k=j("com.greensock"),l=1e-10,m=function(a){var b,c=[],d=a.length;for(b=0;b!==d;c.push(a[b++]));return c},n=function(){},o=function(){var a=Object.prototype.toString,b=a.call([]);return function(c){return null!=c&&(c instanceof Array||"object"==typeof c&&!!c.push&&a.call(c)===b)}}(),p={},q=function(e,f,g,h){this.sc=p[e]?p[e].sc:[],p[e]=this,this.gsClass=null,this.func=g;var i=[];this.check=function(k){for(var l,m,n,o,r,s=f.length,t=s;--s>-1;)(l=p[f[s]]||new q(f[s],[])).gsClass?(i[s]=l.gsClass,t--):k&&l.sc.push(this);if(0===t&&g){if(m=("com.greensock."+e).split("."),n=m.pop(),o=j(m.join("."))[n]=this.gsClass=g.apply(g,i),h)if(d[n]=c[n]=o,r="undefined"!=typeof module&&module.exports,!r&&"function"==typeof define&&define.amd)define((a.GreenSockAMDPath?a.GreenSockAMDPath+"/":"")+e.split(".").pop(),[],function(){return o});else if(r)if(e===b){module.exports=c[b]=o;for(s in c)o[s]=c[s]}else c[b]&&(c[b][n]=o);for(s=0;s<this.sc.length;s++)this.sc[s].check()}},this.check(!0)},r=a._gsDefine=function(a,b,c,d){return new q(a,b,c,d)},s=k._class=function(a,b,c){return b=b||function(){},r(a,[],function(){return b},c),b};r.globals=d;var t=[0,0,1,1],u=s("easing.Ease",function(a,b,c,d){this._func=a,this._type=c||0,this._power=d||0,this._params=b?t.concat(b):t},!0),v=u.map={},w=u.register=function(a,b,c,d){for(var e,f,g,h,i=b.split(","),j=i.length,l=(c||"easeIn,easeOut,easeInOut").split(",");--j>-1;)for(f=i[j],e=d?s("easing."+f,null,!0):k.easing[f]||{},g=l.length;--g>-1;)h=l[g],v[f+"."+h]=v[h+f]=e[h]=a.getRatio?a:a[h]||new a};for(g=u.prototype,g._calcEnd=!1,g.getRatio=function(a){if(this._func)return this._params[0]=a,this._func.apply(null,this._params);var b=this._type,c=this._power,d=1===b?1-a:2===b?a:.5>a?2*a:2*(1-a);return 1===c?d*=d:2===c?d*=d*d:3===c?d*=d*d*d:4===c&&(d*=d*d*d*d),1===b?1-d:2===b?d:.5>a?d/2:1-d/2},e=["Linear","Quad","Cubic","Quart","Quint,Strong"],f=e.length;--f>-1;)g=e[f]+",Power"+f,w(new u(null,null,1,f),g,"easeOut",!0),w(new u(null,null,2,f),g,"easeIn"+(0===f?",easeNone":"")),w(new u(null,null,3,f),g,"easeInOut");v.linear=k.easing.Linear.easeIn,v.swing=k.easing.Quad.easeInOut;var x=s("events.EventDispatcher",function(a){this._listeners={},this._eventTarget=a||this});g=x.prototype,g.addEventListener=function(a,b,c,d,e){e=e||0;var f,g,j=this._listeners[a],k=0;for(this!==h||i||h.wake(),null==j&&(this._listeners[a]=j=[]),g=j.length;--g>-1;)f=j[g],f.c===b&&f.s===c?j.splice(g,1):0===k&&f.pr<e&&(k=g+1);j.splice(k,0,{c:b,s:c,up:d,pr:e})},g.removeEventListener=function(a,b){var c,d=this._listeners[a];if(d)for(c=d.length;--c>-1;)if(d[c].c===b)return void d.splice(c,1)},g.dispatchEvent=function(a){var b,c,d,e=this._listeners[a];if(e)for(b=e.length,b>1&&(e=e.slice(0)),c=this._eventTarget;--b>-1;)d=e[b],d&&(d.up?d.c.call(d.s||c,{type:a,target:c}):d.c.call(d.s||c))};var y=a.requestAnimationFrame,z=a.cancelAnimationFrame,A=Date.now||function(){return(new Date).getTime()},B=A();for(e=["ms","moz","webkit","o"],f=e.length;--f>-1&&!y;)y=a[e[f]+"RequestAnimationFrame"],z=a[e[f]+"CancelAnimationFrame"]||a[e[f]+"CancelRequestAnimationFrame"];s("Ticker",function(a,b){var c,d,e,f,g,j=this,k=A(),m=b!==!1&&y?"auto":!1,o=500,p=33,q="tick",r=function(a){var b,h,i=A()-B;i>o&&(k+=i-p),B+=i,j.time=(B-k)/1e3,b=j.time-g,(!c||b>0||a===!0)&&(j.frame++,g+=b+(b>=f?.004:f-b),h=!0),a!==!0&&(e=d(r)),h&&j.dispatchEvent(q)};x.call(j),j.time=j.frame=0,j.tick=function(){r(!0)},j.lagSmoothing=function(a,b){o=a||1/l,p=Math.min(b,o,0)},j.sleep=function(){null!=e&&(m&&z?z(e):clearTimeout(e),d=n,e=null,j===h&&(i=!1))},j.wake=function(a){null!==e?j.sleep():a?k+=-B+(B=A()):j.frame>10&&(B=A()-o+5),d=0===c?n:m&&y?y:function(a){return setTimeout(a,1e3*(g-j.time)+1|0)},j===h&&(i=!0),r(2)},j.fps=function(a){return arguments.length?(c=a,f=1/(c||60),g=this.time+f,void j.wake()):c},j.useRAF=function(a){return arguments.length?(j.sleep(),m=a,void j.fps(c)):m},j.fps(a),setTimeout(function(){"auto"===m&&j.frame<5&&"hidden"!==document.visibilityState&&j.useRAF(!1)},1500)}),g=k.Ticker.prototype=new k.events.EventDispatcher,g.constructor=k.Ticker;var C=s("core.Animation",function(a,b){if(this.vars=b=b||{},this._duration=this._totalDuration=a||0,this._delay=Number(b.delay)||0,this._timeScale=1,this._active=b.immediateRender===!0,this.data=b.data,this._reversed=b.reversed===!0,V){i||h.wake();var c=this.vars.useFrames?U:V;c.add(this,c._time),this.vars.paused&&this.paused(!0)}});h=C.ticker=new k.Ticker,g=C.prototype,g._dirty=g._gc=g._initted=g._paused=!1,g._totalTime=g._time=0,g._rawPrevTime=-1,g._next=g._last=g._onUpdate=g._timeline=g.timeline=null,g._paused=!1;var D=function(){i&&A()-B>2e3&&h.wake(),setTimeout(D,2e3)};D(),g.play=function(a,b){return null!=a&&this.seek(a,b),this.reversed(!1).paused(!1)},g.pause=function(a,b){return null!=a&&this.seek(a,b),this.paused(!0)},g.resume=function(a,b){return null!=a&&this.seek(a,b),this.paused(!1)},g.seek=function(a,b){return this.totalTime(Number(a),b!==!1)},g.restart=function(a,b){return this.reversed(!1).paused(!1).totalTime(a?-this._delay:0,b!==!1,!0)},g.reverse=function(a,b){return null!=a&&this.seek(a||this.totalDuration(),b),this.reversed(!0).paused(!1)},g.render=function(a,b,c){},g.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,(this._gc||!this.timeline)&&this._enabled(!0),this},g.isActive=function(){var a,b=this._timeline,c=this._startTime;return!b||!this._gc&&!this._paused&&b.isActive()&&(a=b.rawTime())>=c&&a<c+this.totalDuration()/this._timeScale},g._enabled=function(a,b){return i||h.wake(),this._gc=!a,this._active=this.isActive(),b!==!0&&(a&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!a&&this.timeline&&this._timeline._remove(this,!0)),!1},g._kill=function(a,b){return this._enabled(!1,!1)},g.kill=function(a,b){return this._kill(a,b),this},g._uncache=function(a){for(var b=a?this:this.timeline;b;)b._dirty=!0,b=b.timeline;return this},g._swapSelfInParams=function(a){for(var b=a.length,c=a.concat();--b>-1;)"{self}"===a[b]&&(c[b]=this);return c},g._callback=function(a){var b=this.vars,c=b[a],d=b[a+"Params"],e=b[a+"Scope"]||b.callbackScope||this,f=d?d.length:0;switch(f){case 0:c.call(e);break;case 1:c.call(e,d[0]);break;case 2:c.call(e,d[0],d[1]);break;default:c.apply(e,d)}},g.eventCallback=function(a,b,c,d){if("on"===(a||"").substr(0,2)){var e=this.vars;if(1===arguments.length)return e[a];null==b?delete e[a]:(e[a]=b,e[a+"Params"]=o(c)&&-1!==c.join("").indexOf("{self}")?this._swapSelfInParams(c):c,e[a+"Scope"]=d),"onUpdate"===a&&(this._onUpdate=b)}return this},g.delay=function(a){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+a-this._delay),this._delay=a,this):this._delay},g.duration=function(a){return arguments.length?(this._duration=this._totalDuration=a,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==a&&this.totalTime(this._totalTime*(a/this._duration),!0),this):(this._dirty=!1,this._duration)},g.totalDuration=function(a){return this._dirty=!1,arguments.length?this.duration(a):this._totalDuration},g.time=function(a,b){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(a>this._duration?this._duration:a,b)):this._time},g.totalTime=function(a,b,c){if(i||h.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>a&&!c&&(a+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var d=this._totalDuration,e=this._timeline;if(a>d&&!c&&(a=d),this._startTime=(this._paused?this._pauseTime:e._time)-(this._reversed?d-a:a)/this._timeScale,e._dirty||this._uncache(!1),e._timeline)for(;e._timeline;)e._timeline._time!==(e._startTime+e._totalTime)/e._timeScale&&e.totalTime(e._totalTime,!0),e=e._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==a||0===this._duration)&&(I.length&&X(),this.render(a,b,!1),I.length&&X())}return this},g.progress=g.totalProgress=function(a,b){var c=this.duration();return arguments.length?this.totalTime(c*a,b):c?this._time/c:this.ratio},g.startTime=function(a){return arguments.length?(a!==this._startTime&&(this._startTime=a,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,a-this._delay)),this):this._startTime},g.endTime=function(a){return this._startTime+(0!=a?this.totalDuration():this.duration())/this._timeScale},g.timeScale=function(a){if(!arguments.length)return this._timeScale;if(a=a||l,this._timeline&&this._timeline.smoothChildTiming){var b=this._pauseTime,c=b||0===b?b:this._timeline.totalTime();this._startTime=c-(c-this._startTime)*this._timeScale/a}return this._timeScale=a,this._uncache(!1)},g.reversed=function(a){return arguments.length?(a!=this._reversed&&(this._reversed=a,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},g.paused=function(a){if(!arguments.length)return this._paused;var b,c,d=this._timeline;return a!=this._paused&&d&&(i||a||h.wake(),b=d.rawTime(),c=b-this._pauseTime,!a&&d.smoothChildTiming&&(this._startTime+=c,this._uncache(!1)),this._pauseTime=a?b:null,this._paused=a,this._active=this.isActive(),!a&&0!==c&&this._initted&&this.duration()&&(b=d.smoothChildTiming?this._totalTime:(b-this._startTime)/this._timeScale,this.render(b,b===this._totalTime,!0))),this._gc&&!a&&this._enabled(!0,!1),this};var E=s("core.SimpleTimeline",function(a){C.call(this,0,a),this.autoRemoveChildren=this.smoothChildTiming=!0});g=E.prototype=new C,g.constructor=E,g.kill()._gc=!1,g._first=g._last=g._recent=null,g._sortChildren=!1,g.add=g.insert=function(a,b,c,d){var e,f;if(a._startTime=Number(b||0)+a._delay,a._paused&&this!==a._timeline&&(a._pauseTime=a._startTime+(this.rawTime()-a._startTime)/a._timeScale),a.timeline&&a.timeline._remove(a,!0),a.timeline=a._timeline=this,a._gc&&a._enabled(!0,!0),e=this._last,this._sortChildren)for(f=a._startTime;e&&e._startTime>f;)e=e._prev;return e?(a._next=e._next,e._next=a):(a._next=this._first,this._first=a),a._next?a._next._prev=a:this._last=a,a._prev=e,this._recent=a,this._timeline&&this._uncache(!0),this},g._remove=function(a,b){return a.timeline===this&&(b||a._enabled(!1,!0),a._prev?a._prev._next=a._next:this._first===a&&(this._first=a._next),a._next?a._next._prev=a._prev:this._last===a&&(this._last=a._prev),a._next=a._prev=a.timeline=null,a===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},g.render=function(a,b,c){var d,e=this._first;for(this._totalTime=this._time=this._rawPrevTime=a;e;)d=e._next,(e._active||a>=e._startTime&&!e._paused)&&(e._reversed?e.render((e._dirty?e.totalDuration():e._totalDuration)-(a-e._startTime)*e._timeScale,b,c):e.render((a-e._startTime)*e._timeScale,b,c)),e=d},g.rawTime=function(){return i||h.wake(),this._totalTime};var F=s("TweenLite",function(b,c,d){if(C.call(this,c,d),this.render=F.prototype.render,null==b)throw"Cannot tween a null target.";this.target=b="string"!=typeof b?b:F.selector(b)||b;var e,f,g,h=b.jquery||b.length&&b!==a&&b[0]&&(b[0]===a||b[0].nodeType&&b[0].style&&!b.nodeType),i=this.vars.overwrite;if(this._overwrite=i=null==i?T[F.defaultOverwrite]:"number"==typeof i?i>>0:T[i],(h||b instanceof Array||b.push&&o(b))&&"number"!=typeof b[0])for(this._targets=g=m(b),this._propLookup=[],this._siblings=[],e=0;e<g.length;e++)f=g[e],f?"string"!=typeof f?f.length&&f!==a&&f[0]&&(f[0]===a||f[0].nodeType&&f[0].style&&!f.nodeType)?(g.splice(e--,1),this._targets=g=g.concat(m(f))):(this._siblings[e]=Y(f,this,!1),1===i&&this._siblings[e].length>1&&$(f,this,null,1,this._siblings[e])):(f=g[e--]=F.selector(f),"string"==typeof f&&g.splice(e+1,1)):g.splice(e--,1);else this._propLookup={},this._siblings=Y(b,this,!1),1===i&&this._siblings.length>1&&$(b,this,null,1,this._siblings);(this.vars.immediateRender||0===c&&0===this._delay&&this.vars.immediateRender!==!1)&&(this._time=-l,this.render(Math.min(0,-this._delay)))},!0),G=function(b){return b&&b.length&&b!==a&&b[0]&&(b[0]===a||b[0].nodeType&&b[0].style&&!b.nodeType)},H=function(a,b){var c,d={};for(c in a)S[c]||c in b&&"transform"!==c&&"x"!==c&&"y"!==c&&"width"!==c&&"height"!==c&&"className"!==c&&"border"!==c||!(!P[c]||P[c]&&P[c]._autoCSS)||(d[c]=a[c],delete a[c]);a.css=d};g=F.prototype=new C,g.constructor=F,g.kill()._gc=!1,g.ratio=0,g._firstPT=g._targets=g._overwrittenProps=g._startAt=null,g._notifyPluginsOfEnabled=g._lazy=!1,F.version="1.19.0",F.defaultEase=g._ease=new u(null,null,1,1),F.defaultOverwrite="auto",F.ticker=h,F.autoSleep=120,F.lagSmoothing=function(a,b){h.lagSmoothing(a,b)},F.selector=a.$||a.jQuery||function(b){var c=a.$||a.jQuery;return c?(F.selector=c,c(b)):"undefined"==typeof document?b:document.querySelectorAll?document.querySelectorAll(b):document.getElementById("#"===b.charAt(0)?b.substr(1):b)};var I=[],J={},K=/(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,L=function(a){for(var b,c=this._firstPT,d=1e-6;c;)b=c.blob?a?this.join(""):this.start:c.c*a+c.s,c.m?b=c.m(b,this._target||c.t):d>b&&b>-d&&(b=0),c.f?c.fp?c.t[c.p](c.fp,b):c.t[c.p](b):c.t[c.p]=b,c=c._next},M=function(a,b,c,d){var e,f,g,h,i,j,k,l=[a,b],m=0,n="",o=0;for(l.start=a,c&&(c(l),a=l[0],b=l[1]),l.length=0,e=a.match(K)||[],f=b.match(K)||[],d&&(d._next=null,d.blob=1,l._firstPT=l._applyPT=d),i=f.length,h=0;i>h;h++)k=f[h],j=b.substr(m,b.indexOf(k,m)-m),n+=j||!h?j:",",m+=j.length,o?o=(o+1)%5:"rgba("===j.substr(-5)&&(o=1),k===e[h]||e.length<=h?n+=k:(n&&(l.push(n),n=""),g=parseFloat(e[h]),l.push(g),l._firstPT={_next:l._firstPT,t:l,p:l.length-1,s:g,c:("="===k.charAt(1)?parseInt(k.charAt(0)+"1",10)*parseFloat(k.substr(2)):parseFloat(k)-g)||0,f:0,m:o&&4>o?Math.round:0}),m+=k.length;return n+=b.substr(m),n&&l.push(n),l.setRatio=L,l},N=function(a,b,c,d,e,f,g,h,i){"function"==typeof d&&(d=d(i||0,a));var j,k,l="get"===c?a[b]:c,m=typeof a[b],n="string"==typeof d&&"="===d.charAt(1),o={t:a,p:b,s:l,f:"function"===m,pg:0,n:e||b,m:f?"function"==typeof f?f:Math.round:0,pr:0,c:n?parseInt(d.charAt(0)+"1",10)*parseFloat(d.substr(2)):parseFloat(d)-l||0};return"number"!==m&&("function"===m&&"get"===c&&(k=b.indexOf("set")||"function"!=typeof a["get"+b.substr(3)]?b:"get"+b.substr(3),o.s=l=g?a[k](g):a[k]()),"string"==typeof l&&(g||isNaN(l))?(o.fp=g,j=M(l,d,h||F.defaultStringFilter,o),o={t:j,p:"setRatio",s:0,c:1,f:2,pg:0,n:e||b,pr:0,m:0}):n||(o.s=parseFloat(l),o.c=parseFloat(d)-o.s||0)),o.c?((o._next=this._firstPT)&&(o._next._prev=o),this._firstPT=o,o):void 0},O=F._internals={isArray:o,isSelector:G,lazyTweens:I,blobDif:M},P=F._plugins={},Q=O.tweenLookup={},R=0,S=O.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1,callbackScope:1,stringFilter:1,id:1},T={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},U=C._rootFramesTimeline=new E,V=C._rootTimeline=new E,W=30,X=O.lazyRender=function(){var a,b=I.length;for(J={};--b>-1;)a=I[b],a&&a._lazy!==!1&&(a.render(a._lazy[0],a._lazy[1],!0),a._lazy=!1);I.length=0};V._startTime=h.time,U._startTime=h.frame,V._active=U._active=!0,setTimeout(X,1),C._updateRoot=F.render=function(){var a,b,c;if(I.length&&X(),V.render((h.time-V._startTime)*V._timeScale,!1,!1),U.render((h.frame-U._startTime)*U._timeScale,!1,!1),I.length&&X(),h.frame>=W){W=h.frame+(parseInt(F.autoSleep,10)||120);for(c in Q){for(b=Q[c].tweens,a=b.length;--a>-1;)b[a]._gc&&b.splice(a,1);0===b.length&&delete Q[c]}if(c=V._first,(!c||c._paused)&&F.autoSleep&&!U._first&&1===h._listeners.tick.length){for(;c&&c._paused;)c=c._next;c||h.sleep()}}},h.addEventListener("tick",C._updateRoot);var Y=function(a,b,c){var d,e,f=a._gsTweenID;if(Q[f||(a._gsTweenID=f="t"+R++)]||(Q[f]={target:a,tweens:[]}),b&&(d=Q[f].tweens,d[e=d.length]=b,c))for(;--e>-1;)d[e]===b&&d.splice(e,1);return Q[f].tweens},Z=function(a,b,c,d){var e,f,g=a.vars.onOverwrite;return g&&(e=g(a,b,c,d)),g=F.onOverwrite,g&&(f=g(a,b,c,d)),e!==!1&&f!==!1},$=function(a,b,c,d,e){var f,g,h,i;if(1===d||d>=4){for(i=e.length,f=0;i>f;f++)if((h=e[f])!==b)h._gc||h._kill(null,a,b)&&(g=!0);else if(5===d)break;return g}var j,k=b._startTime+l,m=[],n=0,o=0===b._duration;for(f=e.length;--f>-1;)(h=e[f])===b||h._gc||h._paused||(h._timeline!==b._timeline?(j=j||_(b,0,o),0===_(h,j,o)&&(m[n++]=h)):h._startTime<=k&&h._startTime+h.totalDuration()/h._timeScale>k&&((o||!h._initted)&&k-h._startTime<=2e-10||(m[n++]=h)));for(f=n;--f>-1;)if(h=m[f],2===d&&h._kill(c,a,b)&&(g=!0),2!==d||!h._firstPT&&h._initted){if(2!==d&&!Z(h,b))continue;h._enabled(!1,!1)&&(g=!0)}return g},_=function(a,b,c){for(var d=a._timeline,e=d._timeScale,f=a._startTime;d._timeline;){if(f+=d._startTime,e*=d._timeScale,d._paused)return-100;d=d._timeline}return f/=e,f>b?f-b:c&&f===b||!a._initted&&2*l>f-b?l:(f+=a.totalDuration()/a._timeScale/e)>b+l?0:f-b-l};g._init=function(){var a,b,c,d,e,f,g=this.vars,h=this._overwrittenProps,i=this._duration,j=!!g.immediateRender,k=g.ease;if(g.startAt){this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),e={};for(d in g.startAt)e[d]=g.startAt[d];if(e.overwrite=!1,e.immediateRender=!0,e.lazy=j&&g.lazy!==!1,e.startAt=e.delay=null,this._startAt=F.to(this.target,0,e),j)if(this._time>0)this._startAt=null;else if(0!==i)return}else if(g.runBackwards&&0!==i)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{0!==this._time&&(j=!1),c={};for(d in g)S[d]&&"autoCSS"!==d||(c[d]=g[d]);if(c.overwrite=0,c.data="isFromStart",c.lazy=j&&g.lazy!==!1,c.immediateRender=j,this._startAt=F.to(this.target,0,c),j){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=k=k?k instanceof u?k:"function"==typeof k?new u(k,g.easeParams):v[k]||F.defaultEase:F.defaultEase,g.easeParams instanceof Array&&k.config&&(this._ease=k.config.apply(k,g.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(f=this._targets.length,a=0;f>a;a++)this._initProps(this._targets[a],this._propLookup[a]={},this._siblings[a],h?h[a]:null,a)&&(b=!0);else b=this._initProps(this.target,this._propLookup,this._siblings,h,0);if(b&&F._onPluginEvent("_onInitAllProps",this),h&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),g.runBackwards)for(c=this._firstPT;c;)c.s+=c.c,c.c=-c.c,c=c._next;this._onUpdate=g.onUpdate,this._initted=!0},g._initProps=function(b,c,d,e,f){var g,h,i,j,k,l;if(null==b)return!1;J[b._gsTweenID]&&X(),this.vars.css||b.style&&b!==a&&b.nodeType&&P.css&&this.vars.autoCSS!==!1&&H(this.vars,b);for(g in this.vars)if(l=this.vars[g],S[g])l&&(l instanceof Array||l.push&&o(l))&&-1!==l.join("").indexOf("{self}")&&(this.vars[g]=l=this._swapSelfInParams(l,this));else if(P[g]&&(j=new P[g])._onInitTween(b,this.vars[g],this,f)){for(this._firstPT=k={_next:this._firstPT,t:j,p:"setRatio",s:0,c:1,f:1,n:g,pg:1,pr:j._priority,m:0},h=j._overwriteProps.length;--h>-1;)c[j._overwriteProps[h]]=this._firstPT;(j._priority||j._onInitAllProps)&&(i=!0),(j._onDisable||j._onEnable)&&(this._notifyPluginsOfEnabled=!0),k._next&&(k._next._prev=k)}else c[g]=N.call(this,b,g,"get",l,g,0,null,this.vars.stringFilter,f);return e&&this._kill(e,b)?this._initProps(b,c,d,e,f):this._overwrite>1&&this._firstPT&&d.length>1&&$(b,this,c,this._overwrite,d)?(this._kill(c,b),this._initProps(b,c,d,e,f)):(this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration)&&(J[b._gsTweenID]=!0),i)},g.render=function(a,b,c){var d,e,f,g,h=this._time,i=this._duration,j=this._rawPrevTime;if(a>=i-1e-7)this._totalTime=this._time=i,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(d=!0,e="onComplete",c=c||this._timeline.autoRemoveChildren),0===i&&(this._initted||!this.vars.lazy||c)&&(this._startTime===this._timeline._duration&&(a=0),(0>j||0>=a&&a>=-1e-7||j===l&&"isPause"!==this.data)&&j!==a&&(c=!0,j>l&&(e="onReverseComplete")),this._rawPrevTime=g=!b||a||j===a?a:l);else if(1e-7>a)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==h||0===i&&j>0)&&(e="onReverseComplete",d=this._reversed),0>a&&(this._active=!1,0===i&&(this._initted||!this.vars.lazy||c)&&(j>=0&&(j!==l||"isPause"!==this.data)&&(c=!0),this._rawPrevTime=g=!b||a||j===a?a:l)),this._initted||(c=!0);else if(this._totalTime=this._time=a,this._easeType){var k=a/i,m=this._easeType,n=this._easePower;(1===m||3===m&&k>=.5)&&(k=1-k),3===m&&(k*=2),1===n?k*=k:2===n?k*=k*k:3===n?k*=k*k*k:4===n&&(k*=k*k*k*k),1===m?this.ratio=1-k:2===m?this.ratio=k:.5>a/i?this.ratio=k/2:this.ratio=1-k/2}else this.ratio=this._ease.getRatio(a/i);if(this._time!==h||c){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!c&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=h,this._rawPrevTime=j,I.push(this),void(this._lazy=[a,b]);this._time&&!d?this.ratio=this._ease.getRatio(this._time/i):d&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==h&&a>=0&&(this._active=!0),0===h&&(this._startAt&&(a>=0?this._startAt.render(a,b,c):e||(e="_dummyGS")),this.vars.onStart&&(0!==this._time||0===i)&&(b||this._callback("onStart"))),f=this._firstPT;f;)f.f?f.t[f.p](f.c*this.ratio+f.s):f.t[f.p]=f.c*this.ratio+f.s,f=f._next;this._onUpdate&&(0>a&&this._startAt&&a!==-1e-4&&this._startAt.render(a,b,c),b||(this._time!==h||d||c)&&this._callback("onUpdate")),e&&(!this._gc||c)&&(0>a&&this._startAt&&!this._onUpdate&&a!==-1e-4&&this._startAt.render(a,b,c),d&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!b&&this.vars[e]&&this._callback(e),0===i&&this._rawPrevTime===l&&g!==l&&(this._rawPrevTime=0))}},g._kill=function(a,b,c){if("all"===a&&(a=null),null==a&&(null==b||b===this.target))return this._lazy=!1,this._enabled(!1,!1);b="string"!=typeof b?b||this._targets||this.target:F.selector(b)||b;var d,e,f,g,h,i,j,k,l,m=c&&this._time&&c._startTime===this._startTime&&this._timeline===c._timeline;if((o(b)||G(b))&&"number"!=typeof b[0])for(d=b.length;--d>-1;)this._kill(a,b[d],c)&&(i=!0);else{if(this._targets){for(d=this._targets.length;--d>-1;)if(b===this._targets[d]){h=this._propLookup[d]||{},this._overwrittenProps=this._overwrittenProps||[],e=this._overwrittenProps[d]=a?this._overwrittenProps[d]||{}:"all";break}}else{if(b!==this.target)return!1;h=this._propLookup,e=this._overwrittenProps=a?this._overwrittenProps||{}:"all"}if(h){if(j=a||h,k=a!==e&&"all"!==e&&a!==h&&("object"!=typeof a||!a._tempKill),c&&(F.onOverwrite||this.vars.onOverwrite)){for(f in j)h[f]&&(l||(l=[]),l.push(f));if((l||!a)&&!Z(this,c,b,l))return!1}for(f in j)(g=h[f])&&(m&&(g.f?g.t[g.p](g.s):g.t[g.p]=g.s,i=!0),g.pg&&g.t._kill(j)&&(i=!0),g.pg&&0!==g.t._overwriteProps.length||(g._prev?g._prev._next=g._next:g===this._firstPT&&(this._firstPT=g._next),g._next&&(g._next._prev=g._prev),g._next=g._prev=null),delete h[f]),k&&(e[f]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return i},g.invalidate=function(){return this._notifyPluginsOfEnabled&&F._onPluginEvent("_onDisable",this),this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],C.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-l,this.render(Math.min(0,-this._delay))),this},g._enabled=function(a,b){if(i||h.wake(),a&&this._gc){var c,d=this._targets;if(d)for(c=d.length;--c>-1;)this._siblings[c]=Y(d[c],this,!0);else this._siblings=Y(this.target,this,!0)}return C.prototype._enabled.call(this,a,b),this._notifyPluginsOfEnabled&&this._firstPT?F._onPluginEvent(a?"_onEnable":"_onDisable",this):!1},F.to=function(a,b,c){return new F(a,b,c)},F.from=function(a,b,c){return c.runBackwards=!0,c.immediateRender=0!=c.immediateRender,new F(a,b,c)},F.fromTo=function(a,b,c,d){return d.startAt=c,d.immediateRender=0!=d.immediateRender&&0!=c.immediateRender,new F(a,b,d)},F.delayedCall=function(a,b,c,d,e){return new F(b,0,{delay:a,onComplete:b,onCompleteParams:c,callbackScope:d,onReverseComplete:b,onReverseCompleteParams:c,immediateRender:!1,lazy:!1,useFrames:e,overwrite:0})},F.set=function(a,b){return new F(a,0,b)},F.getTweensOf=function(a,b){if(null==a)return[];a="string"!=typeof a?a:F.selector(a)||a;var c,d,e,f;if((o(a)||G(a))&&"number"!=typeof a[0]){for(c=a.length,d=[];--c>-1;)d=d.concat(F.getTweensOf(a[c],b));for(c=d.length;--c>-1;)for(f=d[c],e=c;--e>-1;)f===d[e]&&d.splice(c,1)}else for(d=Y(a).concat(),c=d.length;--c>-1;)(d[c]._gc||b&&!d[c].isActive())&&d.splice(c,1);return d},F.killTweensOf=F.killDelayedCallsTo=function(a,b,c){"object"==typeof b&&(c=b,b=!1);for(var d=F.getTweensOf(a,b),e=d.length;--e>-1;)d[e]._kill(c,a)};var aa=s("plugins.TweenPlugin",function(a,b){this._overwriteProps=(a||"").split(","),this._propName=this._overwriteProps[0],this._priority=b||0,this._super=aa.prototype},!0);if(g=aa.prototype,aa.version="1.19.0",aa.API=2,g._firstPT=null,g._addTween=N,g.setRatio=L,g._kill=function(a){var b,c=this._overwriteProps,d=this._firstPT;if(null!=a[this._propName])this._overwriteProps=[];else for(b=c.length;--b>-1;)null!=a[c[b]]&&c.splice(b,1);for(;d;)null!=a[d.n]&&(d._next&&(d._next._prev=d._prev),d._prev?(d._prev._next=d._next,d._prev=null):this._firstPT===d&&(this._firstPT=d._next)),d=d._next;return!1},g._mod=g._roundProps=function(a){for(var b,c=this._firstPT;c;)b=a[this._propName]||null!=c.n&&a[c.n.split(this._propName+"_").join("")],b&&"function"==typeof b&&(2===c.f?c.t._applyPT.m=b:c.m=b),c=c._next},F._onPluginEvent=function(a,b){var c,d,e,f,g,h=b._firstPT;if("_onInitAllProps"===a){for(;h;){for(g=h._next,d=e;d&&d.pr>h.pr;)d=d._next;(h._prev=d?d._prev:f)?h._prev._next=h:e=h,(h._next=d)?d._prev=h:f=h,h=g}h=b._firstPT=e}for(;h;)h.pg&&"function"==typeof h.t[a]&&h.t[a]()&&(c=!0),h=h._next;return c},aa.activate=function(a){for(var b=a.length;--b>-1;)a[b].API===aa.API&&(P[(new a[b])._propName]=a[b]);return!0},r.plugin=function(a){if(!(a&&a.propName&&a.init&&a.API))throw"illegal plugin definition.";var b,c=a.propName,d=a.priority||0,e=a.overwriteProps,f={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_mod",mod:"_mod",initAll:"_onInitAllProps"},g=s("plugins."+c.charAt(0).toUpperCase()+c.substr(1)+"Plugin",function(){aa.call(this,c,d),this._overwriteProps=e||[]},a.global===!0),h=g.prototype=new aa(c);h.constructor=g,g.API=a.API;for(b in f)"function"==typeof a[b]&&(h[f[b]]=a[b]);return g.version=a.version,aa.activate([g]),g},e=a._gsQueue){for(f=0;f<e.length;f++)e[f]();for(g in p)p[g].func||a.console.log("GSAP encountered missing dependency: "+g)}i=!1}}("undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window,"TweenLite");

/* TIME LINE LITE */
/*!
 * VERSION: 1.17.0
 * DATE: 2015-05-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],h(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));h(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals,a=s._internals={},o=n.isSelector,h=n.isArray,l=n.lazyTweens,_=n.lazyRender,u=[],f=_gsScope._gsDefine.globals,c=function(t){var e,i={};for(e in t)i[e]=t[e];return i},p=a.pauseCallback=function(t,e,i,s){var n,a=t._timeline,o=a._totalTime,h=t._startTime,l=0>t._rawPrevTime||0===t._rawPrevTime&&a._reversed,_=l?0:r,f=l?r:0;if(e||!this._forcingPlayhead){for(a.pause(h),n=t._prev;n&&n._startTime===h;)n._rawPrevTime=f,n=n._prev;for(n=t._next;n&&n._startTime===h;)n._rawPrevTime=_,n=n._next;e&&e.apply(s||a.vars.callbackScope||a,i||u),(this._forcingPlayhead||!a._paused)&&a.seek(o)}},m=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},d=s.prototype=new e;return s.version="1.17.0",d.constructor=s,d.kill()._gc=d._forcingPlayhead=!1,d.to=function(t,e,s,r){var n=s.repeat&&f.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},d.from=function(t,e,s,r){return this.add((s.repeat&&f.TweenMax||i).from(t,e,s),r)},d.fromTo=function(t,e,s,r,n){var a=r.repeat&&f.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},d.staggerTo=function(t,e,r,n,a,h,l,_){var u,f=new s({onComplete:h,onCompleteParams:l,callbackScope:_,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),t=t||[],o(t)&&(t=m(t)),n=n||0,0>n&&(t=m(t),t.reverse(),n*=-1),u=0;t.length>u;u++)r.startAt&&(r.startAt=c(r.startAt)),f.to(t[u],e,c(r),u*n);return this.add(f,a)},d.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},d.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},d.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},d.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},d.add=function(r,n,a,o){var l,_,u,f,c,p;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&h(r)){for(a=a||"normal",o=o||0,l=n,_=r.length,u=0;_>u;u++)h(f=r[u])&&(f=new s({tweens:f})),this.add(f,l),"string"!=typeof f&&"function"!=typeof f&&("sequence"===a?l=f._startTime+f.totalDuration()/f._timeScale:"start"===a&&(f._startTime-=f.delay())),l+=o;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(c=this,p=c.rawTime()>r._startTime;c._timeline;)p&&c._timeline.smoothChildTiming?c.totalTime(c._totalTime,!0):c._gc&&c._enabled(!0,!1),c=c._timeline;return this},d.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&h(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},d._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},d.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},d.insert=d.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},d.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},d.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},d.addPause=function(t,e,s,r){var n=i.delayedCall(0,p,["{self}",e,s,r],this);return n.data="isPause",this.add(n,t)},d.removeLabel=function(t){return delete this._labels[t],this},d.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},d._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&h(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},d.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},d.stop=function(){return this.paused(!0)},d.gotoAndPlay=function(t,e){return this.play(t,e)},d.gotoAndStop=function(t,e){return this.pause(t,e)},d.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,o,h,u=this._dirty?this.totalDuration():this._totalDuration,f=this._time,c=this._startTime,p=this._timeScale,m=this._paused;if(t>=u)this._totalTime=this._time=u,this._reversed||this._hasPausedChild()||(n=!0,o="onComplete",h=!!this._timeline.autoRemoveChildren,0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(h=!0,this._rawPrevTime>r&&(o="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=u+1e-4;else if(1e-7>t)if(this._totalTime=this._time=0,(0!==f||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(o="onReverseComplete",n=this._reversed),0>t)this._active=!1,this._timeline.autoRemoveChildren&&this._reversed?(h=n=!0,o="onReverseComplete"):this._rawPrevTime>=0&&this._first&&(h=!0),this._rawPrevTime=t;else{if(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,0===t&&n)for(s=this._first;s&&0===s._startTime;)s._duration||(n=!1),s=s._next;t=0,this._initted||(h=!0)}else this._totalTime=this._time=this._rawPrevTime=t;if(this._time!==f&&this._first||i||h){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==f&&t>0&&(this._active=!0),0===f&&this.vars.onStart&&0!==this._time&&(e||this._callback("onStart")),this._time>=f)for(s=this._first;s&&(a=s._next,!this._paused||m);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||m);)(s._active||f>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||(l.length&&_(),this._callback("onUpdate"))),o&&(this._gc||(c===this._startTime||p!==this._timeScale)&&(0===this._time||u>=this.totalDuration())&&(n&&(l.length&&_(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[o]&&this._callback(o)))}},d._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},d.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},d.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},d.recent=function(){return this._recent},d._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},d.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},d._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},d.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},d.invalidate=function(){for(var e=this._first;e;)e.invalidate(),e=e._next;return t.prototype.invalidate.call(this)},d._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},d.totalTime=function(){this._forcingPlayhead=!0;var e=t.prototype.totalTime.apply(this,arguments);return this._forcingPlayhead=!1,e},d.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},d.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},d.paused=function(e){if(!e)for(var i=this._first,s=this._time;i;)i._startTime===s&&"isPause"===i.data&&(i._rawPrevTime=0),i=i._next;return t.prototype.paused.apply(this,arguments)},d.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},d.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t){"use strict";var e=function(){return(_gsScope.GreenSockGlobals||_gsScope)[t]};"function"==typeof define&&define.amd?define(["TweenLite"],e):"undefined"!=typeof module&&module.exports&&(require("./TweenLite.js"),module.exports=e())}("TimelineLite");


/* EASING PLUGIN*/
/*!
 * VERSION: 1.15.5
 * DATE: 2016-07-08
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("easing.Back",["easing.Ease"],function(a){var b,c,d,e=_gsScope.GreenSockGlobals||_gsScope,f=e.com.greensock,g=2*Math.PI,h=Math.PI/2,i=f._class,j=function(b,c){var d=i("easing."+b,function(){},!0),e=d.prototype=new a;return e.constructor=d,e.getRatio=c,d},k=a.register||function(){},l=function(a,b,c,d,e){var f=i("easing."+a,{easeOut:new b,easeIn:new c,easeInOut:new d},!0);return k(f,a),f},m=function(a,b,c){this.t=a,this.v=b,c&&(this.next=c,c.prev=this,this.c=c.v-b,this.gap=c.t-a)},n=function(b,c){var d=i("easing."+b,function(a){this._p1=a||0===a?a:1.70158,this._p2=1.525*this._p1},!0),e=d.prototype=new a;return e.constructor=d,e.getRatio=c,e.config=function(a){return new d(a)},d},o=l("Back",n("BackOut",function(a){return(a-=1)*a*((this._p1+1)*a+this._p1)+1}),n("BackIn",function(a){return a*a*((this._p1+1)*a-this._p1)}),n("BackInOut",function(a){return(a*=2)<1?.5*a*a*((this._p2+1)*a-this._p2):.5*((a-=2)*a*((this._p2+1)*a+this._p2)+2)})),p=i("easing.SlowMo",function(a,b,c){b=b||0===b?b:.7,null==a?a=.7:a>1&&(a=1),this._p=1!==a?b:0,this._p1=(1-a)/2,this._p2=a,this._p3=this._p1+this._p2,this._calcEnd=c===!0},!0),q=p.prototype=new a;return q.constructor=p,q.getRatio=function(a){var b=a+(.5-a)*this._p;return a<this._p1?this._calcEnd?1-(a=1-a/this._p1)*a:b-(a=1-a/this._p1)*a*a*a*b:a>this._p3?this._calcEnd?1-(a=(a-this._p3)/this._p1)*a:b+(a-b)*(a=(a-this._p3)/this._p1)*a*a*a:this._calcEnd?1:b},p.ease=new p(.7,.7),q.config=p.config=function(a,b,c){return new p(a,b,c)},b=i("easing.SteppedEase",function(a){a=a||1,this._p1=1/a,this._p2=a+1},!0),q=b.prototype=new a,q.constructor=b,q.getRatio=function(a){return 0>a?a=0:a>=1&&(a=.999999999),(this._p2*a>>0)*this._p1},q.config=b.config=function(a){return new b(a)},c=i("easing.RoughEase",function(b){b=b||{};for(var c,d,e,f,g,h,i=b.taper||"none",j=[],k=0,l=0|(b.points||20),n=l,o=b.randomize!==!1,p=b.clamp===!0,q=b.template instanceof a?b.template:null,r="number"==typeof b.strength?.4*b.strength:.4;--n>-1;)c=o?Math.random():1/l*n,d=q?q.getRatio(c):c,"none"===i?e=r:"out"===i?(f=1-c,e=f*f*r):"in"===i?e=c*c*r:.5>c?(f=2*c,e=f*f*.5*r):(f=2*(1-c),e=f*f*.5*r),o?d+=Math.random()*e-.5*e:n%2?d+=.5*e:d-=.5*e,p&&(d>1?d=1:0>d&&(d=0)),j[k++]={x:c,y:d};for(j.sort(function(a,b){return a.x-b.x}),h=new m(1,1,null),n=l;--n>-1;)g=j[n],h=new m(g.x,g.y,h);this._prev=new m(0,0,0!==h.t?h:h.next)},!0),q=c.prototype=new a,q.constructor=c,q.getRatio=function(a){var b=this._prev;if(a>b.t){for(;b.next&&a>=b.t;)b=b.next;b=b.prev}else for(;b.prev&&a<=b.t;)b=b.prev;return this._prev=b,b.v+(a-b.t)/b.gap*b.c},q.config=function(a){return new c(a)},c.ease=new c,l("Bounce",j("BounceOut",function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375}),j("BounceIn",function(a){return(a=1-a)<1/2.75?1-7.5625*a*a:2/2.75>a?1-(7.5625*(a-=1.5/2.75)*a+.75):2.5/2.75>a?1-(7.5625*(a-=2.25/2.75)*a+.9375):1-(7.5625*(a-=2.625/2.75)*a+.984375)}),j("BounceInOut",function(a){var b=.5>a;return a=b?1-2*a:2*a-1,a=1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375,b?.5*(1-a):.5*a+.5})),l("Circ",j("CircOut",function(a){return Math.sqrt(1-(a-=1)*a)}),j("CircIn",function(a){return-(Math.sqrt(1-a*a)-1)}),j("CircInOut",function(a){return(a*=2)<1?-.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)})),d=function(b,c,d){var e=i("easing."+b,function(a,b){this._p1=a>=1?a:1,this._p2=(b||d)/(1>a?a:1),this._p3=this._p2/g*(Math.asin(1/this._p1)||0),this._p2=g/this._p2},!0),f=e.prototype=new a;return f.constructor=e,f.getRatio=c,f.config=function(a,b){return new e(a,b)},e},l("Elastic",d("ElasticOut",function(a){return this._p1*Math.pow(2,-10*a)*Math.sin((a-this._p3)*this._p2)+1},.3),d("ElasticIn",function(a){return-(this._p1*Math.pow(2,10*(a-=1))*Math.sin((a-this._p3)*this._p2))},.3),d("ElasticInOut",function(a){return(a*=2)<1?-.5*(this._p1*Math.pow(2,10*(a-=1))*Math.sin((a-this._p3)*this._p2)):this._p1*Math.pow(2,-10*(a-=1))*Math.sin((a-this._p3)*this._p2)*.5+1},.45)),l("Expo",j("ExpoOut",function(a){return 1-Math.pow(2,-10*a)}),j("ExpoIn",function(a){return Math.pow(2,10*(a-1))-.001}),j("ExpoInOut",function(a){return(a*=2)<1?.5*Math.pow(2,10*(a-1)):.5*(2-Math.pow(2,-10*(a-1)))})),l("Sine",j("SineOut",function(a){return Math.sin(a*h)}),j("SineIn",function(a){return-Math.cos(a*h)+1}),j("SineInOut",function(a){return-.5*(Math.cos(Math.PI*a)-1)})),i("easing.EaseLookup",{find:function(b){return a.map[b]}},!0),k(e.SlowMo,"SlowMo","ease,"),k(c,"RoughEase","ease,"),k(b,"SteppedEase","ease,"),o},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(){"use strict";var a=function(){return _gsScope.GreenSockGlobals||_gsScope};"function"==typeof define&&define.amd?define(["TweenLite"],a):"undefined"!=typeof module&&module.exports&&(require("../TweenLite.js"),module.exports=a())}();


/* CSS PLUGIN */
/*!
 * VERSION: 1.19.0
 * DATE: 2016-07-14
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(a,b){var c,d,e,f,g=function(){a.call(this,"css"),this._overwriteProps.length=0,this.setRatio=g.prototype.setRatio},h=_gsScope._gsDefine.globals,i={},j=g.prototype=new a("css");j.constructor=g,g.version="1.19.0",g.API=2,g.defaultTransformPerspective=0,g.defaultSkewType="compensated",g.defaultSmoothOrigin=!0,j="px",g.suffixMap={top:j,right:j,bottom:j,left:j,width:j,height:j,fontSize:j,padding:j,margin:j,perspective:j,lineHeight:""};var k,l,m,n,o,p,q,r,s=/(?:\-|\.|\b)(\d|\.|e\-)+/g,t=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,u=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,v=/(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,w=/(?:\d|\-|\+|=|#|\.)*/g,x=/opacity *= *([^)]*)/i,y=/opacity:([^;]*)/i,z=/alpha\(opacity *=.+?\)/i,A=/^(rgb|hsl)/,B=/([A-Z])/g,C=/-([a-z])/gi,D=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,E=function(a,b){return b.toUpperCase()},F=/(?:Left|Right|Width)/i,G=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,H=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,I=/,(?=[^\)]*(?:\(|$))/gi,J=/[\s,\(]/i,K=Math.PI/180,L=180/Math.PI,M={},N=document,O=function(a){return N.createElementNS?N.createElementNS("http://www.w3.org/1999/xhtml",a):N.createElement(a)},P=O("div"),Q=O("img"),R=g._internals={_specialProps:i},S=navigator.userAgent,T=function(){var a=S.indexOf("Android"),b=O("a");return m=-1!==S.indexOf("Safari")&&-1===S.indexOf("Chrome")&&(-1===a||Number(S.substr(a+8,1))>3),o=m&&Number(S.substr(S.indexOf("Version/")+8,1))<6,n=-1!==S.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(S)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(S))&&(p=parseFloat(RegExp.$1)),b?(b.style.cssText="top:1px;opacity:.55;",/^0.55/.test(b.style.opacity)):!1}(),U=function(a){return x.test("string"==typeof a?a:(a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100:1},V=function(a){window.console&&console.log(a)},W="",X="",Y=function(a,b){b=b||P;var c,d,e=b.style;if(void 0!==e[a])return a;for(a=a.charAt(0).toUpperCase()+a.substr(1),c=["O","Moz","ms","Ms","Webkit"],d=5;--d>-1&&void 0===e[c[d]+a];);return d>=0?(X=3===d?"ms":c[d],W="-"+X.toLowerCase()+"-",X+a):null},Z=N.defaultView?N.defaultView.getComputedStyle:function(){},$=g.getStyle=function(a,b,c,d,e){var f;return T||"opacity"!==b?(!d&&a.style[b]?f=a.style[b]:(c=c||Z(a))?f=c[b]||c.getPropertyValue(b)||c.getPropertyValue(b.replace(B,"-$1").toLowerCase()):a.currentStyle&&(f=a.currentStyle[b]),null==e||f&&"none"!==f&&"auto"!==f&&"auto auto"!==f?f:e):U(a)},_=R.convertToPixels=function(a,c,d,e,f){if("px"===e||!e)return d;if("auto"===e||!d)return 0;var h,i,j,k=F.test(c),l=a,m=P.style,n=0>d,o=1===d;if(n&&(d=-d),o&&(d*=100),"%"===e&&-1!==c.indexOf("border"))h=d/100*(k?a.clientWidth:a.clientHeight);else{if(m.cssText="border:0 solid red;position:"+$(a,"position")+";line-height:0;","%"!==e&&l.appendChild&&"v"!==e.charAt(0)&&"rem"!==e)m[k?"borderLeftWidth":"borderTopWidth"]=d+e;else{if(l=a.parentNode||N.body,i=l._gsCache,j=b.ticker.frame,i&&k&&i.time===j)return i.width*d/100;m[k?"width":"height"]=d+e}l.appendChild(P),h=parseFloat(P[k?"offsetWidth":"offsetHeight"]),l.removeChild(P),k&&"%"===e&&g.cacheWidths!==!1&&(i=l._gsCache=l._gsCache||{},i.time=j,i.width=h/d*100),0!==h||f||(h=_(a,c,d,e,!0))}return o&&(h/=100),n?-h:h},aa=R.calculateOffset=function(a,b,c){if("absolute"!==$(a,"position",c))return 0;var d="left"===b?"Left":"Top",e=$(a,"margin"+d,c);return a["offset"+d]-(_(a,b,parseFloat(e),e.replace(w,""))||0)},ba=function(a,b){var c,d,e,f={};if(b=b||Z(a,null))if(c=b.length)for(;--c>-1;)e=b[c],(-1===e.indexOf("-transform")||Ca===e)&&(f[e.replace(C,E)]=b.getPropertyValue(e));else for(c in b)(-1===c.indexOf("Transform")||Ba===c)&&(f[c]=b[c]);else if(b=a.currentStyle||a.style)for(c in b)"string"==typeof c&&void 0===f[c]&&(f[c.replace(C,E)]=b[c]);return T||(f.opacity=U(a)),d=Pa(a,b,!1),f.rotation=d.rotation,f.skewX=d.skewX,f.scaleX=d.scaleX,f.scaleY=d.scaleY,f.x=d.x,f.y=d.y,Ea&&(f.z=d.z,f.rotationX=d.rotationX,f.rotationY=d.rotationY,f.scaleZ=d.scaleZ),f.filters&&delete f.filters,f},ca=function(a,b,c,d,e){var f,g,h,i={},j=a.style;for(g in c)"cssText"!==g&&"length"!==g&&isNaN(g)&&(b[g]!==(f=c[g])||e&&e[g])&&-1===g.indexOf("Origin")&&("number"==typeof f||"string"==typeof f)&&(i[g]="auto"!==f||"left"!==g&&"top"!==g?""!==f&&"auto"!==f&&"none"!==f||"string"!=typeof b[g]||""===b[g].replace(v,"")?f:0:aa(a,g),void 0!==j[g]&&(h=new ra(j,g,j[g],h)));if(d)for(g in d)"className"!==g&&(i[g]=d[g]);return{difs:i,firstMPT:h}},da={width:["Left","Right"],height:["Top","Bottom"]},ea=["marginLeft","marginRight","marginTop","marginBottom"],fa=function(a,b,c){if("svg"===(a.nodeName+"").toLowerCase())return(c||Z(a))[b]||0;if(a.getBBox&&Ma(a))return a.getBBox()[b]||0;var d=parseFloat("width"===b?a.offsetWidth:a.offsetHeight),e=da[b],f=e.length;for(c=c||Z(a,null);--f>-1;)d-=parseFloat($(a,"padding"+e[f],c,!0))||0,d-=parseFloat($(a,"border"+e[f]+"Width",c,!0))||0;return d},ga=function(a,b){if("contain"===a||"auto"===a||"auto auto"===a)return a+" ";(null==a||""===a)&&(a="0 0");var c,d=a.split(" "),e=-1!==a.indexOf("left")?"0%":-1!==a.indexOf("right")?"100%":d[0],f=-1!==a.indexOf("top")?"0%":-1!==a.indexOf("bottom")?"100%":d[1];if(d.length>3&&!b){for(d=a.split(", ").join(",").split(","),a=[],c=0;c<d.length;c++)a.push(ga(d[c]));return a.join(",")}return null==f?f="center"===e?"50%":"0":"center"===f&&(f="50%"),("center"===e||isNaN(parseFloat(e))&&-1===(e+"").indexOf("="))&&(e="50%"),a=e+" "+f+(d.length>2?" "+d[2]:""),b&&(b.oxp=-1!==e.indexOf("%"),b.oyp=-1!==f.indexOf("%"),b.oxr="="===e.charAt(1),b.oyr="="===f.charAt(1),b.ox=parseFloat(e.replace(v,"")),b.oy=parseFloat(f.replace(v,"")),b.v=a),b||a},ha=function(a,b){return"function"==typeof a&&(a=a(r,q)),"string"==typeof a&&"="===a.charAt(1)?parseInt(a.charAt(0)+"1",10)*parseFloat(a.substr(2)):parseFloat(a)-parseFloat(b)||0},ia=function(a,b){return"function"==typeof a&&(a=a(r,q)),null==a?b:"string"==typeof a&&"="===a.charAt(1)?parseInt(a.charAt(0)+"1",10)*parseFloat(a.substr(2))+b:parseFloat(a)||0},ja=function(a,b,c,d){var e,f,g,h,i,j=1e-6;return"function"==typeof a&&(a=a(r,q)),null==a?h=b:"number"==typeof a?h=a:(e=360,f=a.split("_"),i="="===a.charAt(1),g=(i?parseInt(a.charAt(0)+"1",10)*parseFloat(f[0].substr(2)):parseFloat(f[0]))*(-1===a.indexOf("rad")?1:L)-(i?0:b),f.length&&(d&&(d[c]=b+g),-1!==a.indexOf("short")&&(g%=e,g!==g%(e/2)&&(g=0>g?g+e:g-e)),-1!==a.indexOf("_cw")&&0>g?g=(g+9999999999*e)%e-(g/e|0)*e:-1!==a.indexOf("ccw")&&g>0&&(g=(g-9999999999*e)%e-(g/e|0)*e)),h=b+g),j>h&&h>-j&&(h=0),h},ka={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},la=function(a,b,c){return a=0>a?a+1:a>1?a-1:a,255*(1>6*a?b+(c-b)*a*6:.5>a?c:2>3*a?b+(c-b)*(2/3-a)*6:b)+.5|0},ma=g.parseColor=function(a,b){var c,d,e,f,g,h,i,j,k,l,m;if(a)if("number"==typeof a)c=[a>>16,a>>8&255,255&a];else{if(","===a.charAt(a.length-1)&&(a=a.substr(0,a.length-1)),ka[a])c=ka[a];else if("#"===a.charAt(0))4===a.length&&(d=a.charAt(1),e=a.charAt(2),f=a.charAt(3),a="#"+d+d+e+e+f+f),a=parseInt(a.substr(1),16),c=[a>>16,a>>8&255,255&a];else if("hsl"===a.substr(0,3))if(c=m=a.match(s),b){if(-1!==a.indexOf("="))return a.match(t)}else g=Number(c[0])%360/360,h=Number(c[1])/100,i=Number(c[2])/100,e=.5>=i?i*(h+1):i+h-i*h,d=2*i-e,c.length>3&&(c[3]=Number(a[3])),c[0]=la(g+1/3,d,e),c[1]=la(g,d,e),c[2]=la(g-1/3,d,e);else c=a.match(s)||ka.transparent;c[0]=Number(c[0]),c[1]=Number(c[1]),c[2]=Number(c[2]),c.length>3&&(c[3]=Number(c[3]))}else c=ka.black;return b&&!m&&(d=c[0]/255,e=c[1]/255,f=c[2]/255,j=Math.max(d,e,f),k=Math.min(d,e,f),i=(j+k)/2,j===k?g=h=0:(l=j-k,h=i>.5?l/(2-j-k):l/(j+k),g=j===d?(e-f)/l+(f>e?6:0):j===e?(f-d)/l+2:(d-e)/l+4,g*=60),c[0]=g+.5|0,c[1]=100*h+.5|0,c[2]=100*i+.5|0),c},na=function(a,b){var c,d,e,f=a.match(oa)||[],g=0,h=f.length?"":a;for(c=0;c<f.length;c++)d=f[c],e=a.substr(g,a.indexOf(d,g)-g),g+=e.length+d.length,d=ma(d,b),3===d.length&&d.push(1),h+=e+(b?"hsla("+d[0]+","+d[1]+"%,"+d[2]+"%,"+d[3]:"rgba("+d.join(","))+")";return h+a.substr(g)},oa="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";for(j in ka)oa+="|"+j+"\\b";oa=new RegExp(oa+")","gi"),g.colorStringFilter=function(a){var b,c=a[0]+a[1];oa.test(c)&&(b=-1!==c.indexOf("hsl(")||-1!==c.indexOf("hsla("),a[0]=na(a[0],b),a[1]=na(a[1],b)),oa.lastIndex=0},b.defaultStringFilter||(b.defaultStringFilter=g.colorStringFilter);var pa=function(a,b,c,d){if(null==a)return function(a){return a};var e,f=b?(a.match(oa)||[""])[0]:"",g=a.split(f).join("").match(u)||[],h=a.substr(0,a.indexOf(g[0])),i=")"===a.charAt(a.length-1)?")":"",j=-1!==a.indexOf(" ")?" ":",",k=g.length,l=k>0?g[0].replace(s,""):"";return k?e=b?function(a){var b,m,n,o;if("number"==typeof a)a+=l;else if(d&&I.test(a)){for(o=a.replace(I,"|").split("|"),n=0;n<o.length;n++)o[n]=e(o[n]);return o.join(",")}if(b=(a.match(oa)||[f])[0],m=a.split(b).join("").match(u)||[],n=m.length,k>n--)for(;++n<k;)m[n]=c?m[(n-1)/2|0]:g[n];return h+m.join(j)+j+b+i+(-1!==a.indexOf("inset")?" inset":"")}:function(a){var b,f,m;if("number"==typeof a)a+=l;else if(d&&I.test(a)){for(f=a.replace(I,"|").split("|"),m=0;m<f.length;m++)f[m]=e(f[m]);return f.join(",")}if(b=a.match(u)||[],m=b.length,k>m--)for(;++m<k;)b[m]=c?b[(m-1)/2|0]:g[m];return h+b.join(j)+i}:function(a){return a}},qa=function(a){return a=a.split(","),function(b,c,d,e,f,g,h){var i,j=(c+"").split(" ");for(h={},i=0;4>i;i++)h[a[i]]=j[i]=j[i]||j[(i-1)/2>>0];return e.parse(b,h,f,g)}},ra=(R._setPluginRatio=function(a){this.plugin.setRatio(a);for(var b,c,d,e,f,g=this.data,h=g.proxy,i=g.firstMPT,j=1e-6;i;)b=h[i.v],i.r?b=Math.round(b):j>b&&b>-j&&(b=0),i.t[i.p]=b,i=i._next;if(g.autoRotate&&(g.autoRotate.rotation=g.mod?g.mod(h.rotation,this.t):h.rotation),1===a||0===a)for(i=g.firstMPT,f=1===a?"e":"b";i;){if(c=i.t,c.type){if(1===c.type){for(e=c.xs0+c.s+c.xs1,d=1;d<c.l;d++)e+=c["xn"+d]+c["xs"+(d+1)];c[f]=e}}else c[f]=c.s+c.xs0;i=i._next}},function(a,b,c,d,e){this.t=a,this.p=b,this.v=c,this.r=e,d&&(d._prev=this,this._next=d)}),sa=(R._parseToProxy=function(a,b,c,d,e,f){var g,h,i,j,k,l=d,m={},n={},o=c._transform,p=M;for(c._transform=null,M=b,d=k=c.parse(a,b,d,e),M=p,f&&(c._transform=o,l&&(l._prev=null,l._prev&&(l._prev._next=null)));d&&d!==l;){if(d.type<=1&&(h=d.p,n[h]=d.s+d.c,m[h]=d.s,f||(j=new ra(d,"s",h,j,d.r),d.c=0),1===d.type))for(g=d.l;--g>0;)i="xn"+g,h=d.p+"_"+i,n[h]=d.data[i],m[h]=d[i],f||(j=new ra(d,i,h,j,d.rxp[i]));d=d._next}return{proxy:m,end:n,firstMPT:j,pt:k}},R.CSSPropTween=function(a,b,d,e,g,h,i,j,k,l,m){this.t=a,this.p=b,this.s=d,this.c=e,this.n=i||b,a instanceof sa||f.push(this.n),this.r=j,this.type=h||0,k&&(this.pr=k,c=!0),this.b=void 0===l?d:l,this.e=void 0===m?d+e:m,g&&(this._next=g,g._prev=this)}),ta=function(a,b,c,d,e,f){var g=new sa(a,b,c,d-c,e,-1,f);return g.b=c,g.e=g.xs0=d,g},ua=g.parseComplex=function(a,b,c,d,e,f,h,i,j,l){c=c||f||"","function"==typeof d&&(d=d(r,q)),h=new sa(a,b,0,0,h,l?2:1,null,!1,i,c,d),d+="",e&&oa.test(d+c)&&(d=[c,d],g.colorStringFilter(d),c=d[0],d=d[1]);var m,n,o,p,u,v,w,x,y,z,A,B,C,D=c.split(", ").join(",").split(" "),E=d.split(", ").join(",").split(" "),F=D.length,G=k!==!1;for((-1!==d.indexOf(",")||-1!==c.indexOf(","))&&(D=D.join(" ").replace(I,", ").split(" "),E=E.join(" ").replace(I,", ").split(" "),F=D.length),F!==E.length&&(D=(f||"").split(" "),F=D.length),h.plugin=j,h.setRatio=l,oa.lastIndex=0,m=0;F>m;m++)if(p=D[m],u=E[m],x=parseFloat(p),x||0===x)h.appendXtra("",x,ha(u,x),u.replace(t,""),G&&-1!==u.indexOf("px"),!0);else if(e&&oa.test(p))B=u.indexOf(")")+1,B=")"+(B?u.substr(B):""),C=-1!==u.indexOf("hsl")&&T,p=ma(p,C),u=ma(u,C),y=p.length+u.length>6,y&&!T&&0===u[3]?(h["xs"+h.l]+=h.l?" transparent":"transparent",h.e=h.e.split(E[m]).join("transparent")):(T||(y=!1),C?h.appendXtra(y?"hsla(":"hsl(",p[0],ha(u[0],p[0]),",",!1,!0).appendXtra("",p[1],ha(u[1],p[1]),"%,",!1).appendXtra("",p[2],ha(u[2],p[2]),y?"%,":"%"+B,!1):h.appendXtra(y?"rgba(":"rgb(",p[0],u[0]-p[0],",",!0,!0).appendXtra("",p[1],u[1]-p[1],",",!0).appendXtra("",p[2],u[2]-p[2],y?",":B,!0),y&&(p=p.length<4?1:p[3],h.appendXtra("",p,(u.length<4?1:u[3])-p,B,!1))),oa.lastIndex=0;else if(v=p.match(s)){if(w=u.match(t),!w||w.length!==v.length)return h;for(o=0,n=0;n<v.length;n++)A=v[n],z=p.indexOf(A,o),h.appendXtra(p.substr(o,z-o),Number(A),ha(w[n],A),"",G&&"px"===p.substr(z+A.length,2),0===n),o=z+A.length;h["xs"+h.l]+=p.substr(o)}else h["xs"+h.l]+=h.l||h["xs"+h.l]?" "+u:u;if(-1!==d.indexOf("=")&&h.data){for(B=h.xs0+h.data.s,m=1;m<h.l;m++)B+=h["xs"+m]+h.data["xn"+m];h.e=B+h["xs"+m]}return h.l||(h.type=-1,h.xs0=h.e),h.xfirst||h},va=9;for(j=sa.prototype,j.l=j.pr=0;--va>0;)j["xn"+va]=0,j["xs"+va]="";j.xs0="",j._next=j._prev=j.xfirst=j.data=j.plugin=j.setRatio=j.rxp=null,j.appendXtra=function(a,b,c,d,e,f){var g=this,h=g.l;return g["xs"+h]+=f&&(h||g["xs"+h])?" "+a:a||"",c||0===h||g.plugin?(g.l++,g.type=g.setRatio?2:1,g["xs"+g.l]=d||"",h>0?(g.data["xn"+h]=b+c,g.rxp["xn"+h]=e,g["xn"+h]=b,g.plugin||(g.xfirst=new sa(g,"xn"+h,b,c,g.xfirst||g,0,g.n,e,g.pr),g.xfirst.xs0=0),g):(g.data={s:b+c},g.rxp={},g.s=b,g.c=c,g.r=e,g)):(g["xs"+h]+=b+(d||""),g)};var wa=function(a,b){b=b||{},this.p=b.prefix?Y(a)||a:a,i[a]=i[this.p]=this,this.format=b.formatter||pa(b.defaultValue,b.color,b.collapsible,b.multi),b.parser&&(this.parse=b.parser),this.clrs=b.color,this.multi=b.multi,this.keyword=b.keyword,this.dflt=b.defaultValue,this.pr=b.priority||0},xa=R._registerComplexSpecialProp=function(a,b,c){"object"!=typeof b&&(b={parser:c});var d,e,f=a.split(","),g=b.defaultValue;for(c=c||[g],d=0;d<f.length;d++)b.prefix=0===d&&b.prefix,b.defaultValue=c[d]||g,e=new wa(f[d],b)},ya=R._registerPluginProp=function(a){if(!i[a]){var b=a.charAt(0).toUpperCase()+a.substr(1)+"Plugin";xa(a,{parser:function(a,c,d,e,f,g,j){var k=h.com.greensock.plugins[b];return k?(k._cssRegister(),i[d].parse(a,c,d,e,f,g,j)):(V("Error: "+b+" js file not loaded."),f)}})}};j=wa.prototype,j.parseComplex=function(a,b,c,d,e,f){var g,h,i,j,k,l,m=this.keyword;if(this.multi&&(I.test(c)||I.test(b)?(h=b.replace(I,"|").split("|"),i=c.replace(I,"|").split("|")):m&&(h=[b],i=[c])),i){for(j=i.length>h.length?i.length:h.length,g=0;j>g;g++)b=h[g]=h[g]||this.dflt,c=i[g]=i[g]||this.dflt,m&&(k=b.indexOf(m),l=c.indexOf(m),k!==l&&(-1===l?h[g]=h[g].split(m).join(""):-1===k&&(h[g]+=" "+m)));b=h.join(", "),c=i.join(", ")}return ua(a,this.p,b,c,this.clrs,this.dflt,d,this.pr,e,f)},j.parse=function(a,b,c,d,f,g,h){return this.parseComplex(a.style,this.format($(a,this.p,e,!1,this.dflt)),this.format(b),f,g)},g.registerSpecialProp=function(a,b,c){xa(a,{parser:function(a,d,e,f,g,h,i){var j=new sa(a,e,0,0,g,2,e,!1,c);return j.plugin=h,j.setRatio=b(a,d,f._tween,e),j},priority:c})},g.useSVGTransformAttr=m||n;var za,Aa="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),Ba=Y("transform"),Ca=W+"transform",Da=Y("transformOrigin"),Ea=null!==Y("perspective"),Fa=R.Transform=function(){this.perspective=parseFloat(g.defaultTransformPerspective)||0,this.force3D=g.defaultForce3D!==!1&&Ea?g.defaultForce3D||"auto":!1},Ga=window.SVGElement,Ha=function(a,b,c){var d,e=N.createElementNS("http://www.w3.org/2000/svg",a),f=/([a-z])([A-Z])/g;for(d in c)e.setAttributeNS(null,d.replace(f,"$1-$2").toLowerCase(),c[d]);return b.appendChild(e),e},Ia=N.documentElement,Ja=function(){var a,b,c,d=p||/Android/i.test(S)&&!window.chrome;return N.createElementNS&&!d&&(a=Ha("svg",Ia),b=Ha("rect",a,{width:100,height:50,x:100}),c=b.getBoundingClientRect().width,b.style[Da]="50% 50%",b.style[Ba]="scaleX(0.5)",d=c===b.getBoundingClientRect().width&&!(n&&Ea),Ia.removeChild(a)),d}(),Ka=function(a,b,c,d,e,f){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v=a._gsTransform,w=Oa(a,!0);v&&(t=v.xOrigin,u=v.yOrigin),(!d||(h=d.split(" ")).length<2)&&(n=a.getBBox(),b=ga(b).split(" "),h=[(-1!==b[0].indexOf("%")?parseFloat(b[0])/100*n.width:parseFloat(b[0]))+n.x,(-1!==b[1].indexOf("%")?parseFloat(b[1])/100*n.height:parseFloat(b[1]))+n.y]),c.xOrigin=k=parseFloat(h[0]),c.yOrigin=l=parseFloat(h[1]),d&&w!==Na&&(m=w[0],n=w[1],o=w[2],p=w[3],q=w[4],r=w[5],s=m*p-n*o,i=k*(p/s)+l*(-o/s)+(o*r-p*q)/s,j=k*(-n/s)+l*(m/s)-(m*r-n*q)/s,k=c.xOrigin=h[0]=i,l=c.yOrigin=h[1]=j),v&&(f&&(c.xOffset=v.xOffset,c.yOffset=v.yOffset,v=c),e||e!==!1&&g.defaultSmoothOrigin!==!1?(i=k-t,j=l-u,v.xOffset+=i*w[0]+j*w[2]-i,v.yOffset+=i*w[1]+j*w[3]-j):v.xOffset=v.yOffset=0),f||a.setAttribute("data-svg-origin",h.join(" "))},La=function(a){try{return a.getBBox()}catch(a){}},Ma=function(a){return!!(Ga&&a.getBBox&&a.getCTM&&La(a)&&(!a.parentNode||a.parentNode.getBBox&&a.parentNode.getCTM))},Na=[1,0,0,1,0,0],Oa=function(a,b){var c,d,e,f,g,h,i=a._gsTransform||new Fa,j=1e5,k=a.style;if(Ba?d=$(a,Ca,null,!0):a.currentStyle&&(d=a.currentStyle.filter.match(G),d=d&&4===d.length?[d[0].substr(4),Number(d[2].substr(4)),Number(d[1].substr(4)),d[3].substr(4),i.x||0,i.y||0].join(","):""),c=!d||"none"===d||"matrix(1, 0, 0, 1, 0, 0)"===d,c&&Ba&&((h="none"===Z(a).display)||!a.parentNode)&&(h&&(f=k.display,k.display="block"),a.parentNode||(g=1,Ia.appendChild(a)),d=$(a,Ca,null,!0),c=!d||"none"===d||"matrix(1, 0, 0, 1, 0, 0)"===d,f?k.display=f:h&&Ta(k,"display"),g&&Ia.removeChild(a)),(i.svg||a.getBBox&&Ma(a))&&(c&&-1!==(k[Ba]+"").indexOf("matrix")&&(d=k[Ba],c=0),e=a.getAttribute("transform"),c&&e&&(-1!==e.indexOf("matrix")?(d=e,c=0):-1!==e.indexOf("translate")&&(d="matrix(1,0,0,1,"+e.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",")+")",c=0))),c)return Na;for(e=(d||"").match(s)||[],va=e.length;--va>-1;)f=Number(e[va]),e[va]=(g=f-(f|=0))?(g*j+(0>g?-.5:.5)|0)/j+f:f;return b&&e.length>6?[e[0],e[1],e[4],e[5],e[12],e[13]]:e},Pa=R.getTransform=function(a,c,d,e){if(a._gsTransform&&d&&!e)return a._gsTransform;var f,h,i,j,k,l,m=d?a._gsTransform||new Fa:new Fa,n=m.scaleX<0,o=2e-5,p=1e5,q=Ea?parseFloat($(a,Da,c,!1,"0 0 0").split(" ")[2])||m.zOrigin||0:0,r=parseFloat(g.defaultTransformPerspective)||0;if(m.svg=!(!a.getBBox||!Ma(a)),m.svg&&(Ka(a,$(a,Da,c,!1,"50% 50%")+"",m,a.getAttribute("data-svg-origin")),za=g.useSVGTransformAttr||Ja),f=Oa(a),f!==Na){if(16===f.length){var s,t,u,v,w,x=f[0],y=f[1],z=f[2],A=f[3],B=f[4],C=f[5],D=f[6],E=f[7],F=f[8],G=f[9],H=f[10],I=f[12],J=f[13],K=f[14],M=f[11],N=Math.atan2(D,H);m.zOrigin&&(K=-m.zOrigin,I=F*K-f[12],J=G*K-f[13],K=H*K+m.zOrigin-f[14]),m.rotationX=N*L,N&&(v=Math.cos(-N),w=Math.sin(-N),s=B*v+F*w,t=C*v+G*w,u=D*v+H*w,F=B*-w+F*v,G=C*-w+G*v,H=D*-w+H*v,M=E*-w+M*v,B=s,C=t,D=u),N=Math.atan2(-z,H),m.rotationY=N*L,N&&(v=Math.cos(-N),w=Math.sin(-N),s=x*v-F*w,t=y*v-G*w,u=z*v-H*w,G=y*w+G*v,H=z*w+H*v,M=A*w+M*v,x=s,y=t,z=u),N=Math.atan2(y,x),m.rotation=N*L,N&&(v=Math.cos(-N),w=Math.sin(-N),x=x*v+B*w,t=y*v+C*w,C=y*-w+C*v,D=z*-w+D*v,y=t),m.rotationX&&Math.abs(m.rotationX)+Math.abs(m.rotation)>359.9&&(m.rotationX=m.rotation=0,m.rotationY=180-m.rotationY),m.scaleX=(Math.sqrt(x*x+y*y)*p+.5|0)/p,m.scaleY=(Math.sqrt(C*C+G*G)*p+.5|0)/p,m.scaleZ=(Math.sqrt(D*D+H*H)*p+.5|0)/p,m.rotationX||m.rotationY?m.skewX=0:(m.skewX=B||C?Math.atan2(B,C)*L+m.rotation:m.skewX||0,Math.abs(m.skewX)>90&&Math.abs(m.skewX)<270&&(n?(m.scaleX*=-1,m.skewX+=m.rotation<=0?180:-180,m.rotation+=m.rotation<=0?180:-180):(m.scaleY*=-1,m.skewX+=m.skewX<=0?180:-180))),m.perspective=M?1/(0>M?-M:M):0,m.x=I,m.y=J,m.z=K,m.svg&&(m.x-=m.xOrigin-(m.xOrigin*x-m.yOrigin*B),m.y-=m.yOrigin-(m.yOrigin*y-m.xOrigin*C))}else if(!Ea||e||!f.length||m.x!==f[4]||m.y!==f[5]||!m.rotationX&&!m.rotationY){var O=f.length>=6,P=O?f[0]:1,Q=f[1]||0,R=f[2]||0,S=O?f[3]:1;m.x=f[4]||0,m.y=f[5]||0,i=Math.sqrt(P*P+Q*Q),j=Math.sqrt(S*S+R*R),k=P||Q?Math.atan2(Q,P)*L:m.rotation||0,l=R||S?Math.atan2(R,S)*L+k:m.skewX||0,Math.abs(l)>90&&Math.abs(l)<270&&(n?(i*=-1,l+=0>=k?180:-180,k+=0>=k?180:-180):(j*=-1,l+=0>=l?180:-180)),m.scaleX=i,m.scaleY=j,m.rotation=k,m.skewX=l,Ea&&(m.rotationX=m.rotationY=m.z=0,m.perspective=r,m.scaleZ=1),m.svg&&(m.x-=m.xOrigin-(m.xOrigin*P+m.yOrigin*R),m.y-=m.yOrigin-(m.xOrigin*Q+m.yOrigin*S))}m.zOrigin=q;for(h in m)m[h]<o&&m[h]>-o&&(m[h]=0)}return d&&(a._gsTransform=m,m.svg&&(za&&a.style[Ba]?b.delayedCall(.001,function(){Ta(a.style,Ba)}):!za&&a.getAttribute("transform")&&b.delayedCall(.001,function(){a.removeAttribute("transform")}))),m},Qa=function(a){var b,c,d=this.data,e=-d.rotation*K,f=e+d.skewX*K,g=1e5,h=(Math.cos(e)*d.scaleX*g|0)/g,i=(Math.sin(e)*d.scaleX*g|0)/g,j=(Math.sin(f)*-d.scaleY*g|0)/g,k=(Math.cos(f)*d.scaleY*g|0)/g,l=this.t.style,m=this.t.currentStyle;if(m){c=i,i=-j,j=-c,b=m.filter,l.filter="";var n,o,q=this.t.offsetWidth,r=this.t.offsetHeight,s="absolute"!==m.position,t="progid:DXImageTransform.Microsoft.Matrix(M11="+h+", M12="+i+", M21="+j+", M22="+k,u=d.x+q*d.xPercent/100,v=d.y+r*d.yPercent/100;if(null!=d.ox&&(n=(d.oxp?q*d.ox*.01:d.ox)-q/2,o=(d.oyp?r*d.oy*.01:d.oy)-r/2,u+=n-(n*h+o*i),v+=o-(n*j+o*k)),s?(n=q/2,o=r/2,t+=", Dx="+(n-(n*h+o*i)+u)+", Dy="+(o-(n*j+o*k)+v)+")"):t+=", sizingMethod='auto expand')",-1!==b.indexOf("DXImageTransform.Microsoft.Matrix(")?l.filter=b.replace(H,t):l.filter=t+" "+b,(0===a||1===a)&&1===h&&0===i&&0===j&&1===k&&(s&&-1===t.indexOf("Dx=0, Dy=0")||x.test(b)&&100!==parseFloat(RegExp.$1)||-1===b.indexOf(b.indexOf("Alpha"))&&l.removeAttribute("filter")),!s){var y,z,A,B=8>p?1:-1;for(n=d.ieOffsetX||0,o=d.ieOffsetY||0,d.ieOffsetX=Math.round((q-((0>h?-h:h)*q+(0>i?-i:i)*r))/2+u),d.ieOffsetY=Math.round((r-((0>k?-k:k)*r+(0>j?-j:j)*q))/2+v),va=0;4>va;va++)z=ea[va],y=m[z],c=-1!==y.indexOf("px")?parseFloat(y):_(this.t,z,parseFloat(y),y.replace(w,""))||0,A=c!==d[z]?2>va?-d.ieOffsetX:-d.ieOffsetY:2>va?n-d.ieOffsetX:o-d.ieOffsetY,l[z]=(d[z]=Math.round(c-A*(0===va||2===va?1:B)))+"px"}}},Ra=R.set3DTransformRatio=R.setTransformRatio=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,o,p,q,r,s,t,u,v,w,x,y,z=this.data,A=this.t.style,B=z.rotation,C=z.rotationX,D=z.rotationY,E=z.scaleX,F=z.scaleY,G=z.scaleZ,H=z.x,I=z.y,J=z.z,L=z.svg,M=z.perspective,N=z.force3D;if(((1===a||0===a)&&"auto"===N&&(this.tween._totalTime===this.tween._totalDuration||!this.tween._totalTime)||!N)&&!J&&!M&&!D&&!C&&1===G||za&&L||!Ea)return void(B||z.skewX||L?(B*=K,x=z.skewX*K,y=1e5,b=Math.cos(B)*E,e=Math.sin(B)*E,c=Math.sin(B-x)*-F,f=Math.cos(B-x)*F,x&&"simple"===z.skewType&&(s=Math.tan(x-z.skewY*K),s=Math.sqrt(1+s*s),c*=s,f*=s,z.skewY&&(s=Math.tan(z.skewY*K),s=Math.sqrt(1+s*s),b*=s,e*=s)),L&&(H+=z.xOrigin-(z.xOrigin*b+z.yOrigin*c)+z.xOffset,I+=z.yOrigin-(z.xOrigin*e+z.yOrigin*f)+z.yOffset,za&&(z.xPercent||z.yPercent)&&(p=this.t.getBBox(),H+=.01*z.xPercent*p.width,I+=.01*z.yPercent*p.height),p=1e-6,p>H&&H>-p&&(H=0),p>I&&I>-p&&(I=0)),u=(b*y|0)/y+","+(e*y|0)/y+","+(c*y|0)/y+","+(f*y|0)/y+","+H+","+I+")",L&&za?this.t.setAttribute("transform","matrix("+u):A[Ba]=(z.xPercent||z.yPercent?"translate("+z.xPercent+"%,"+z.yPercent+"%) matrix(":"matrix(")+u):A[Ba]=(z.xPercent||z.yPercent?"translate("+z.xPercent+"%,"+z.yPercent+"%) matrix(":"matrix(")+E+",0,0,"+F+","+H+","+I+")");if(n&&(p=1e-4,p>E&&E>-p&&(E=G=2e-5),p>F&&F>-p&&(F=G=2e-5),!M||z.z||z.rotationX||z.rotationY||(M=0)),B||z.skewX)B*=K,q=b=Math.cos(B),r=e=Math.sin(B),z.skewX&&(B-=z.skewX*K,q=Math.cos(B),r=Math.sin(B),"simple"===z.skewType&&(s=Math.tan((z.skewX-z.skewY)*K),s=Math.sqrt(1+s*s),q*=s,r*=s,z.skewY&&(s=Math.tan(z.skewY*K),s=Math.sqrt(1+s*s),b*=s,e*=s))),c=-r,f=q;else{if(!(D||C||1!==G||M||L))return void(A[Ba]=(z.xPercent||z.yPercent?"translate("+z.xPercent+"%,"+z.yPercent+"%) translate3d(":"translate3d(")+H+"px,"+I+"px,"+J+"px)"+(1!==E||1!==F?" scale("+E+","+F+")":""));b=f=1,c=e=0}j=1,d=g=h=i=k=l=0,m=M?-1/M:0,o=z.zOrigin,p=1e-6,v=",",w="0",B=D*K,B&&(q=Math.cos(B),r=Math.sin(B),h=-r,k=m*-r,d=b*r,g=e*r,j=q,m*=q,b*=q,e*=q),B=C*K,B&&(q=Math.cos(B),r=Math.sin(B),s=c*q+d*r,t=f*q+g*r,i=j*r,l=m*r,d=c*-r+d*q,g=f*-r+g*q,j*=q,m*=q,c=s,f=t),1!==G&&(d*=G,g*=G,j*=G,m*=G),1!==F&&(c*=F,f*=F,i*=F,l*=F),1!==E&&(b*=E,e*=E,h*=E,k*=E),(o||L)&&(o&&(H+=d*-o,I+=g*-o,J+=j*-o+o),L&&(H+=z.xOrigin-(z.xOrigin*b+z.yOrigin*c)+z.xOffset,I+=z.yOrigin-(z.xOrigin*e+z.yOrigin*f)+z.yOffset),p>H&&H>-p&&(H=w),p>I&&I>-p&&(I=w),p>J&&J>-p&&(J=0)),u=z.xPercent||z.yPercent?"translate("+z.xPercent+"%,"+z.yPercent+"%) matrix3d(":"matrix3d(",u+=(p>b&&b>-p?w:b)+v+(p>e&&e>-p?w:e)+v+(p>h&&h>-p?w:h),u+=v+(p>k&&k>-p?w:k)+v+(p>c&&c>-p?w:c)+v+(p>f&&f>-p?w:f),C||D||1!==G?(u+=v+(p>i&&i>-p?w:i)+v+(p>l&&l>-p?w:l)+v+(p>d&&d>-p?w:d),u+=v+(p>g&&g>-p?w:g)+v+(p>j&&j>-p?w:j)+v+(p>m&&m>-p?w:m)+v):u+=",0,0,0,0,1,0,",u+=H+v+I+v+J+v+(M?1+-J/M:1)+")",A[Ba]=u};j=Fa.prototype,j.x=j.y=j.z=j.skewX=j.skewY=j.rotation=j.rotationX=j.rotationY=j.zOrigin=j.xPercent=j.yPercent=j.xOffset=j.yOffset=0,j.scaleX=j.scaleY=j.scaleZ=1,xa("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin",{parser:function(a,b,c,d,f,h,i){if(d._lastParsedTransform===i)return f;d._lastParsedTransform=i;var j;"function"==typeof i[c]&&(j=i[c],i[c]=b);var k,l,m,n,o,p,s,t,u,v=a._gsTransform,w=a.style,x=1e-6,y=Aa.length,z=i,A={},B="transformOrigin",C=Pa(a,e,!0,z.parseTransform),D=z.transform&&("function"==typeof z.transform?z.transform(r,q):z.transform);if(d._transform=C,D&&"string"==typeof D&&Ba)l=P.style,l[Ba]=D,l.display="block",l.position="absolute",N.body.appendChild(P),k=Pa(P,null,!1),C.svg&&(p=C.xOrigin,s=C.yOrigin,k.x-=C.xOffset,k.y-=C.yOffset,(z.transformOrigin||z.svgOrigin)&&(D={},Ka(a,ga(z.transformOrigin),D,z.svgOrigin,z.smoothOrigin,!0),p=D.xOrigin,s=D.yOrigin,k.x-=D.xOffset-C.xOffset,k.y-=D.yOffset-C.yOffset),(p||s)&&(t=Oa(P,!0),k.x-=p-(p*t[0]+s*t[2]),k.y-=s-(p*t[1]+s*t[3]))),N.body.removeChild(P),k.perspective||(k.perspective=C.perspective),null!=z.xPercent&&(k.xPercent=ia(z.xPercent,C.xPercent)),null!=z.yPercent&&(k.yPercent=ia(z.yPercent,C.yPercent));else if("object"==typeof z){if(k={scaleX:ia(null!=z.scaleX?z.scaleX:z.scale,C.scaleX),scaleY:ia(null!=z.scaleY?z.scaleY:z.scale,C.scaleY),scaleZ:ia(z.scaleZ,C.scaleZ),x:ia(z.x,C.x),y:ia(z.y,C.y),z:ia(z.z,C.z),xPercent:ia(z.xPercent,C.xPercent),yPercent:ia(z.yPercent,C.yPercent),perspective:ia(z.transformPerspective,C.perspective)},o=z.directionalRotation,null!=o)if("object"==typeof o)for(l in o)z[l]=o[l];else z.rotation=o;"string"==typeof z.x&&-1!==z.x.indexOf("%")&&(k.x=0,k.xPercent=ia(z.x,C.xPercent)),"string"==typeof z.y&&-1!==z.y.indexOf("%")&&(k.y=0,k.yPercent=ia(z.y,C.yPercent)),k.rotation=ja("rotation"in z?z.rotation:"shortRotation"in z?z.shortRotation+"_short":"rotationZ"in z?z.rotationZ:C.rotation-C.skewY,C.rotation-C.skewY,"rotation",A),Ea&&(k.rotationX=ja("rotationX"in z?z.rotationX:"shortRotationX"in z?z.shortRotationX+"_short":C.rotationX||0,C.rotationX,"rotationX",A),k.rotationY=ja("rotationY"in z?z.rotationY:"shortRotationY"in z?z.shortRotationY+"_short":C.rotationY||0,C.rotationY,"rotationY",A)),k.skewX=ja(z.skewX,C.skewX-C.skewY),(k.skewY=ja(z.skewY,C.skewY))&&(k.skewX+=k.skewY,k.rotation+=k.skewY)}for(Ea&&null!=z.force3D&&(C.force3D=z.force3D,n=!0),C.skewType=z.skewType||C.skewType||g.defaultSkewType,m=C.force3D||C.z||C.rotationX||C.rotationY||k.z||k.rotationX||k.rotationY||k.perspective,m||null==z.scale||(k.scaleZ=1);--y>-1;)u=Aa[y],D=k[u]-C[u],(D>x||-x>D||null!=z[u]||null!=M[u])&&(n=!0,f=new sa(C,u,C[u],D,f),u in A&&(f.e=A[u]),f.xs0=0,f.plugin=h,d._overwriteProps.push(f.n));return D=z.transformOrigin,C.svg&&(D||z.svgOrigin)&&(p=C.xOffset,s=C.yOffset,Ka(a,ga(D),k,z.svgOrigin,z.smoothOrigin),f=ta(C,"xOrigin",(v?C:k).xOrigin,k.xOrigin,f,B),f=ta(C,"yOrigin",(v?C:k).yOrigin,k.yOrigin,f,B),(p!==C.xOffset||s!==C.yOffset)&&(f=ta(C,"xOffset",v?p:C.xOffset,C.xOffset,f,B),f=ta(C,"yOffset",v?s:C.yOffset,C.yOffset,f,B)),D=za?null:"0px 0px"),(D||Ea&&m&&C.zOrigin)&&(Ba?(n=!0,u=Da,D=(D||$(a,u,e,!1,"50% 50%"))+"",f=new sa(w,u,0,0,f,-1,B),f.b=w[u],f.plugin=h,Ea?(l=C.zOrigin,D=D.split(" "),C.zOrigin=(D.length>2&&(0===l||"0px"!==D[2])?parseFloat(D[2]):l)||0,f.xs0=f.e=D[0]+" "+(D[1]||"50%")+" 0px",f=new sa(C,"zOrigin",0,0,f,-1,f.n),f.b=l,f.xs0=f.e=C.zOrigin):f.xs0=f.e=D):ga(D+"",C)),n&&(d._transformType=C.svg&&za||!m&&3!==this._transformType?2:3),j&&(i[c]=j),f},prefix:!0}),xa("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),xa("borderRadius",{defaultValue:"0px",parser:function(a,b,c,f,g,h){b=this.format(b);var i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],z=a.style;for(q=parseFloat(a.offsetWidth),r=parseFloat(a.offsetHeight),i=b.split(" "),j=0;j<y.length;j++)this.p.indexOf("border")&&(y[j]=Y(y[j])),m=l=$(a,y[j],e,!1,"0px"),-1!==m.indexOf(" ")&&(l=m.split(" "),m=l[0],l=l[1]),n=k=i[j],o=parseFloat(m),t=m.substr((o+"").length),u="="===n.charAt(1),u?(p=parseInt(n.charAt(0)+"1",10),n=n.substr(2),p*=parseFloat(n),s=n.substr((p+"").length-(0>p?1:0))||""):(p=parseFloat(n),s=n.substr((p+"").length)),""===s&&(s=d[c]||t),s!==t&&(v=_(a,"borderLeft",o,t),w=_(a,"borderTop",o,t),"%"===s?(m=v/q*100+"%",l=w/r*100+"%"):"em"===s?(x=_(a,"borderLeft",1,"em"),m=v/x+"em",l=w/x+"em"):(m=v+"px",l=w+"px"),u&&(n=parseFloat(m)+p+s,k=parseFloat(l)+p+s)),g=ua(z,y[j],m+" "+l,n+" "+k,!1,"0px",g);return g},prefix:!0,formatter:pa("0px 0px 0px 0px",!1,!0)}),xa("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius",{defaultValue:"0px",parser:function(a,b,c,d,f,g){return ua(a.style,c,this.format($(a,c,e,!1,"0px 0px")),this.format(b),!1,"0px",f)},prefix:!0,formatter:pa("0px 0px",!1,!0)}),xa("backgroundPosition",{defaultValue:"0 0",parser:function(a,b,c,d,f,g){var h,i,j,k,l,m,n="background-position",o=e||Z(a,null),q=this.format((o?p?o.getPropertyValue(n+"-x")+" "+o.getPropertyValue(n+"-y"):o.getPropertyValue(n):a.currentStyle.backgroundPositionX+" "+a.currentStyle.backgroundPositionY)||"0 0"),r=this.format(b);if(-1!==q.indexOf("%")!=(-1!==r.indexOf("%"))&&r.split(",").length<2&&(m=$(a,"backgroundImage").replace(D,""),m&&"none"!==m)){for(h=q.split(" "),i=r.split(" "),Q.setAttribute("src",m),j=2;--j>-1;)q=h[j],k=-1!==q.indexOf("%"),k!==(-1!==i[j].indexOf("%"))&&(l=0===j?a.offsetWidth-Q.width:a.offsetHeight-Q.height,h[j]=k?parseFloat(q)/100*l+"px":parseFloat(q)/l*100+"%");q=h.join(" ")}return this.parseComplex(a.style,q,r,f,g)},formatter:ga}),xa("backgroundSize",{defaultValue:"0 0",formatter:function(a){return a+="",ga(-1===a.indexOf(" ")?a+" "+a:a)}}),xa("perspective",{defaultValue:"0px",prefix:!0}),xa("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),xa("transformStyle",{prefix:!0}),xa("backfaceVisibility",{prefix:!0}),xa("userSelect",{prefix:!0}),xa("margin",{parser:qa("marginTop,marginRight,marginBottom,marginLeft")}),xa("padding",{parser:qa("paddingTop,paddingRight,paddingBottom,paddingLeft")}),xa("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(a,b,c,d,f,g){var h,i,j;return 9>p?(i=a.currentStyle,j=8>p?" ":",",h="rect("+i.clipTop+j+i.clipRight+j+i.clipBottom+j+i.clipLeft+")",b=this.format(b).split(",").join(j)):(h=this.format($(a,this.p,e,!1,this.dflt)),b=this.format(b)),this.parseComplex(a.style,h,b,f,g)}}),xa("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),xa("autoRound,strictUnits",{parser:function(a,b,c,d,e){return e}}),xa("border",{defaultValue:"0px solid #000",parser:function(a,b,c,d,f,g){var h=$(a,"borderTopWidth",e,!1,"0px"),i=this.format(b).split(" "),j=i[0].replace(w,"");return"px"!==j&&(h=parseFloat(h)/_(a,"borderTopWidth",1,j)+j),this.parseComplex(a.style,this.format(h+" "+$(a,"borderTopStyle",e,!1,"solid")+" "+$(a,"borderTopColor",e,!1,"#000")),i.join(" "),f,g)},color:!0,formatter:function(a){var b=a.split(" ");return b[0]+" "+(b[1]||"solid")+" "+(a.match(oa)||["#000"])[0]}}),xa("borderWidth",{
parser:qa("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),xa("float,cssFloat,styleFloat",{parser:function(a,b,c,d,e,f){var g=a.style,h="cssFloat"in g?"cssFloat":"styleFloat";return new sa(g,h,0,0,e,-1,c,!1,0,g[h],b)}});var Sa=function(a){var b,c=this.t,d=c.filter||$(this.data,"filter")||"",e=this.s+this.c*a|0;100===e&&(-1===d.indexOf("atrix(")&&-1===d.indexOf("radient(")&&-1===d.indexOf("oader(")?(c.removeAttribute("filter"),b=!$(this.data,"filter")):(c.filter=d.replace(z,""),b=!0)),b||(this.xn1&&(c.filter=d=d||"alpha(opacity="+e+")"),-1===d.indexOf("pacity")?0===e&&this.xn1||(c.filter=d+" alpha(opacity="+e+")"):c.filter=d.replace(x,"opacity="+e))};xa("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(a,b,c,d,f,g){var h=parseFloat($(a,"opacity",e,!1,"1")),i=a.style,j="autoAlpha"===c;return"string"==typeof b&&"="===b.charAt(1)&&(b=("-"===b.charAt(0)?-1:1)*parseFloat(b.substr(2))+h),j&&1===h&&"hidden"===$(a,"visibility",e)&&0!==b&&(h=0),T?f=new sa(i,"opacity",h,b-h,f):(f=new sa(i,"opacity",100*h,100*(b-h),f),f.xn1=j?1:0,i.zoom=1,f.type=2,f.b="alpha(opacity="+f.s+")",f.e="alpha(opacity="+(f.s+f.c)+")",f.data=a,f.plugin=g,f.setRatio=Sa),j&&(f=new sa(i,"visibility",0,0,f,-1,null,!1,0,0!==h?"inherit":"hidden",0===b?"hidden":"inherit"),f.xs0="inherit",d._overwriteProps.push(f.n),d._overwriteProps.push(c)),f}});var Ta=function(a,b){b&&(a.removeProperty?(("ms"===b.substr(0,2)||"webkit"===b.substr(0,6))&&(b="-"+b),a.removeProperty(b.replace(B,"-$1").toLowerCase())):a.removeAttribute(b))},Ua=function(a){if(this.t._gsClassPT=this,1===a||0===a){this.t.setAttribute("class",0===a?this.b:this.e);for(var b=this.data,c=this.t.style;b;)b.v?c[b.p]=b.v:Ta(c,b.p),b=b._next;1===a&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};xa("className",{parser:function(a,b,d,f,g,h,i){var j,k,l,m,n,o=a.getAttribute("class")||"",p=a.style.cssText;if(g=f._classNamePT=new sa(a,d,0,0,g,2),g.setRatio=Ua,g.pr=-11,c=!0,g.b=o,k=ba(a,e),l=a._gsClassPT){for(m={},n=l.data;n;)m[n.p]=1,n=n._next;l.setRatio(1)}return a._gsClassPT=g,g.e="="!==b.charAt(1)?b:o.replace(new RegExp("(?:\\s|^)"+b.substr(2)+"(?![\\w-])"),"")+("+"===b.charAt(0)?" "+b.substr(2):""),a.setAttribute("class",g.e),j=ca(a,k,ba(a),i,m),a.setAttribute("class",o),g.data=j.firstMPT,a.style.cssText=p,g=g.xfirst=f.parse(a,j.difs,g,h)}});var Va=function(a){if((1===a||0===a)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var b,c,d,e,f,g=this.t.style,h=i.transform.parse;if("all"===this.e)g.cssText="",e=!0;else for(b=this.e.split(" ").join("").split(","),d=b.length;--d>-1;)c=b[d],i[c]&&(i[c].parse===h?e=!0:c="transformOrigin"===c?Da:i[c].p),Ta(g,c);e&&(Ta(g,Ba),f=this.t._gsTransform,f&&(f.svg&&(this.t.removeAttribute("data-svg-origin"),this.t.removeAttribute("transform")),delete this.t._gsTransform))}};for(xa("clearProps",{parser:function(a,b,d,e,f){return f=new sa(a,d,0,0,f,2),f.setRatio=Va,f.e=b,f.pr=-10,f.data=e._tween,c=!0,f}}),j="bezier,throwProps,physicsProps,physics2D".split(","),va=j.length;va--;)ya(j[va]);j=g.prototype,j._firstPT=j._lastParsedTransform=j._transform=null,j._onInitTween=function(a,b,h,j){if(!a.nodeType)return!1;this._target=q=a,this._tween=h,this._vars=b,r=j,k=b.autoRound,c=!1,d=b.suffixMap||g.suffixMap,e=Z(a,""),f=this._overwriteProps;var n,p,s,t,u,v,w,x,z,A=a.style;if(l&&""===A.zIndex&&(n=$(a,"zIndex",e),("auto"===n||""===n)&&this._addLazySet(A,"zIndex",0)),"string"==typeof b&&(t=A.cssText,n=ba(a,e),A.cssText=t+";"+b,n=ca(a,n,ba(a)).difs,!T&&y.test(b)&&(n.opacity=parseFloat(RegExp.$1)),b=n,A.cssText=t),b.className?this._firstPT=p=i.className.parse(a,b.className,"className",this,null,null,b):this._firstPT=p=this.parse(a,b,null),this._transformType){for(z=3===this._transformType,Ba?m&&(l=!0,""===A.zIndex&&(w=$(a,"zIndex",e),("auto"===w||""===w)&&this._addLazySet(A,"zIndex",0)),o&&this._addLazySet(A,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(z?"visible":"hidden"))):A.zoom=1,s=p;s&&s._next;)s=s._next;x=new sa(a,"transform",0,0,null,2),this._linkCSSP(x,null,s),x.setRatio=Ba?Ra:Qa,x.data=this._transform||Pa(a,e,!0),x.tween=h,x.pr=-1,f.pop()}if(c){for(;p;){for(v=p._next,s=t;s&&s.pr>p.pr;)s=s._next;(p._prev=s?s._prev:u)?p._prev._next=p:t=p,(p._next=s)?s._prev=p:u=p,p=v}this._firstPT=t}return!0},j.parse=function(a,b,c,f){var g,h,j,l,m,n,o,p,s,t,u=a.style;for(g in b)n=b[g],"function"==typeof n&&(n=n(r,q)),h=i[g],h?c=h.parse(a,n,g,this,c,f,b):(m=$(a,g,e)+"",s="string"==typeof n,"color"===g||"fill"===g||"stroke"===g||-1!==g.indexOf("Color")||s&&A.test(n)?(s||(n=ma(n),n=(n.length>3?"rgba(":"rgb(")+n.join(",")+")"),c=ua(u,g,m,n,!0,"transparent",c,0,f)):s&&J.test(n)?c=ua(u,g,m,n,!0,null,c,0,f):(j=parseFloat(m),o=j||0===j?m.substr((j+"").length):"",(""===m||"auto"===m)&&("width"===g||"height"===g?(j=fa(a,g,e),o="px"):"left"===g||"top"===g?(j=aa(a,g,e),o="px"):(j="opacity"!==g?0:1,o="")),t=s&&"="===n.charAt(1),t?(l=parseInt(n.charAt(0)+"1",10),n=n.substr(2),l*=parseFloat(n),p=n.replace(w,"")):(l=parseFloat(n),p=s?n.replace(w,""):""),""===p&&(p=g in d?d[g]:o),n=l||0===l?(t?l+j:l)+p:b[g],o!==p&&""!==p&&(l||0===l)&&j&&(j=_(a,g,j,o),"%"===p?(j/=_(a,g,100,"%")/100,b.strictUnits!==!0&&(m=j+"%")):"em"===p||"rem"===p||"vw"===p||"vh"===p?j/=_(a,g,1,p):"px"!==p&&(l=_(a,g,l,p),p="px"),t&&(l||0===l)&&(n=l+j+p)),t&&(l+=j),!j&&0!==j||!l&&0!==l?void 0!==u[g]&&(n||n+""!="NaN"&&null!=n)?(c=new sa(u,g,l||j||0,0,c,-1,g,!1,0,m,n),c.xs0="none"!==n||"display"!==g&&-1===g.indexOf("Style")?n:m):V("invalid "+g+" tween value: "+b[g]):(c=new sa(u,g,j,l-j,c,0,g,k!==!1&&("px"===p||"zIndex"===g),0,m,n),c.xs0=p))),f&&c&&!c.plugin&&(c.plugin=f);return c},j.setRatio=function(a){var b,c,d,e=this._firstPT,f=1e-6;if(1!==a||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(a||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;e;){if(b=e.c*a+e.s,e.r?b=Math.round(b):f>b&&b>-f&&(b=0),e.type)if(1===e.type)if(d=e.l,2===d)e.t[e.p]=e.xs0+b+e.xs1+e.xn1+e.xs2;else if(3===d)e.t[e.p]=e.xs0+b+e.xs1+e.xn1+e.xs2+e.xn2+e.xs3;else if(4===d)e.t[e.p]=e.xs0+b+e.xs1+e.xn1+e.xs2+e.xn2+e.xs3+e.xn3+e.xs4;else if(5===d)e.t[e.p]=e.xs0+b+e.xs1+e.xn1+e.xs2+e.xn2+e.xs3+e.xn3+e.xs4+e.xn4+e.xs5;else{for(c=e.xs0+b+e.xs1,d=1;d<e.l;d++)c+=e["xn"+d]+e["xs"+(d+1)];e.t[e.p]=c}else-1===e.type?e.t[e.p]=e.xs0:e.setRatio&&e.setRatio(a);else e.t[e.p]=b+e.xs0;e=e._next}else for(;e;)2!==e.type?e.t[e.p]=e.b:e.setRatio(a),e=e._next;else for(;e;){if(2!==e.type)if(e.r&&-1!==e.type)if(b=Math.round(e.s+e.c),e.type){if(1===e.type){for(d=e.l,c=e.xs0+b+e.xs1,d=1;d<e.l;d++)c+=e["xn"+d]+e["xs"+(d+1)];e.t[e.p]=c}}else e.t[e.p]=b+e.xs0;else e.t[e.p]=e.e;else e.setRatio(a);e=e._next}},j._enableTransforms=function(a){this._transform=this._transform||Pa(this._target,e,!0),this._transformType=this._transform.svg&&za||!a&&3!==this._transformType?2:3};var Wa=function(a){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)};j._addLazySet=function(a,b,c){var d=this._firstPT=new sa(a,b,0,0,this._firstPT,2);d.e=c,d.setRatio=Wa,d.data=this},j._linkCSSP=function(a,b,c,d){return a&&(b&&(b._prev=a),a._next&&(a._next._prev=a._prev),a._prev?a._prev._next=a._next:this._firstPT===a&&(this._firstPT=a._next,d=!0),c?c._next=a:d||null!==this._firstPT||(this._firstPT=a),a._next=b,a._prev=c),a},j._mod=function(a){for(var b=this._firstPT;b;)"function"==typeof a[b.p]&&a[b.p]===Math.round&&(b.r=1),b=b._next},j._kill=function(b){var c,d,e,f=b;if(b.autoAlpha||b.alpha){f={};for(d in b)f[d]=b[d];f.opacity=1,f.autoAlpha&&(f.visibility=1)}for(b.className&&(c=this._classNamePT)&&(e=c.xfirst,e&&e._prev?this._linkCSSP(e._prev,c._next,e._prev._prev):e===this._firstPT&&(this._firstPT=c._next),c._next&&this._linkCSSP(c._next,c._next._next,e._prev),this._classNamePT=null),c=this._firstPT;c;)c.plugin&&c.plugin!==d&&c.plugin._kill&&(c.plugin._kill(b),d=c.plugin),c=c._next;return a.prototype._kill.call(this,f)};var Xa=function(a,b,c){var d,e,f,g;if(a.slice)for(e=a.length;--e>-1;)Xa(a[e],b,c);else for(d=a.childNodes,e=d.length;--e>-1;)f=d[e],g=f.type,f.style&&(b.push(ba(f)),c&&c.push(f)),1!==g&&9!==g&&11!==g||!f.childNodes.length||Xa(f,b,c)};return g.cascadeTo=function(a,c,d){var e,f,g,h,i=b.to(a,c,d),j=[i],k=[],l=[],m=[],n=b._internals.reservedProps;for(a=i._targets||i.target,Xa(a,k,m),i.render(c,!0,!0),Xa(a,l),i.render(0,!0,!0),i._enabled(!0),e=m.length;--e>-1;)if(f=ca(m[e],k[e],l[e]),f.firstMPT){f=f.difs;for(g in d)n[g]&&(f[g]=d[g]);h={};for(g in f)h[g]=k[e][g];j.push(b.fromTo(m[e],c,h,f))}return j},a.activate([g]),g},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(a){"use strict";var b=function(){return(_gsScope.GreenSockGlobals||_gsScope)[a]};"function"==typeof define&&define.amd?define(["TweenLite"],b):"undefined"!=typeof module&&module.exports&&(require("../TweenLite.js"),module.exports=b())}("CSSPlugin");

/* SPLIT TEXT UTIL */
/*!
 * VERSION: 0.4.0
 * DATE: 2016-07-09
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;!function(a){"use strict";var b=a.GreenSockGlobals||a,c=function(a){var c,d=a.split("."),e=b;for(c=0;c<d.length;c++)e[d[c]]=e=e[d[c]]||{};return e},d=c("com.greensock.utils"),e=function(a){var b=a.nodeType,c="";if(1===b||9===b||11===b){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===b||4===b)return a.nodeValue;return c},f=document,g=f.defaultView?f.defaultView.getComputedStyle:function(){},h=/([A-Z])/g,i=function(a,b,c,d){var e;return(c=c||g(a,null))?(a=c.getPropertyValue(b.replace(h,"-$1").toLowerCase()),e=a||c.length?a:c[b]):a.currentStyle&&(c=a.currentStyle,e=c[b]),d?e:parseInt(e,10)||0},j=function(a){return a.length&&a[0]&&(a[0].nodeType&&a[0].style&&!a.nodeType||a[0].length&&a[0][0])?!0:!1},k=function(a){var b,c,d,e=[],f=a.length;for(b=0;f>b;b++)if(c=a[b],j(c))for(d=c.length,d=0;d<c.length;d++)e.push(c[d]);else e.push(c);return e},l=/(?:\r|\n|\s\s|\t\t)/g,m=")eefec303079ad17405c",n=/(?:<br>|<br\/>|<br \/>)/gi,o=f.all&&!f.addEventListener,p=" style='position:relative;display:inline-block;"+(o?"*display:inline;*zoom:1;'":"'"),q=function(a,b){a=a||"";var c=-1!==a.indexOf("++"),d=1;return c&&(a=a.split("++").join("")),function(){return"<"+b+p+(a?" class='"+a+(c?d++:"")+"'>":">")}},r=d.SplitText=b.SplitText=function(a,b){if("string"==typeof a&&(a=r.selector(a)),!a)throw"cannot split a null element.";this.elements=j(a)?k(a):[a],this.chars=[],this.words=[],this.lines=[],this._originals=[],this.vars=b||{},this.split(b)},s=function(a,b,c){var d=a.nodeType;if(1===d||9===d||11===d)for(a=a.firstChild;a;a=a.nextSibling)s(a,b,c);else(3===d||4===d)&&(a.nodeValue=a.nodeValue.split(b).join(c))},t=function(a,b){for(var c=b.length;--c>-1;)a.push(b[c])},u=function(a,b,c,d,h){n.test(a.innerHTML)&&(a.innerHTML=a.innerHTML.replace(n,m));var j,k,o,p,r,u,v,w,x,y,z,A,B,C,D=e(a),E=b.span?"span":"div",F=b.type||b.split||"chars,words,lines",G=-1!==F.indexOf("lines")?[]:null,H=-1!==F.indexOf("words"),I=-1!==F.indexOf("chars"),J="absolute"===b.position||b.absolute===!0,K=b.wordDelimiter||" ",L=" "!==K?"":J?"&#173; ":" ",M=-999,N=g(a),O=i(a,"paddingLeft",N),P=i(a,"borderBottomWidth",N)+i(a,"borderTopWidth",N),Q=i(a,"borderLeftWidth",N)+i(a,"borderRightWidth",N),R=i(a,"paddingTop",N)+i(a,"paddingBottom",N),S=i(a,"paddingLeft",N)+i(a,"paddingRight",N),T=i(a,"textAlign",N,!0),U=.2*i(a,"fontSize"),V=a.clientHeight,W=a.clientWidth,X=b.span?"</span>":"</div>",Y=q(b.wordsClass,E),Z=q(b.charsClass,E),$=-1!==(b.linesClass||"").indexOf("++"),_=b.linesClass,aa=-1!==D.indexOf("<"),ba=!0,ca=[],da=[],ea=[];for(!b.reduceWhiteSpace!=!1&&(D=D.replace(l,"")),$&&(_=_.split("++").join("")),aa&&(D=D.split("<").join("{{LT}}")),j=D.length,p=Y(),r=0;j>r;r++)if(v=D.charAt(r),")"===v&&D.substr(r,20)===m)p+=(ba?X:"")+"<BR/>",ba=!1,r!==j-20&&D.substr(r+20,20)!==m&&(p+=" "+Y(),ba=!0),r+=19;else if(v===K&&D.charAt(r-1)!==K&&r!==j-1&&D.substr(r-20,20)!==m){for(p+=ba?X:"",ba=!1;D.charAt(r+1)===K;)p+=L,r++;(")"!==D.charAt(r+1)||D.substr(r+1,20)!==m)&&(p+=L+Y(),ba=!0)}else"{"===v&&"{{LT}}"===D.substr(r,6)?(p+=I?Z()+"{{LT}}</"+E+">":"{{LT}}",r+=5):p+=I&&" "!==v?Z()+v+"</"+E+">":v;for(a.innerHTML=p+(ba?X:""),aa&&s(a,"{{LT}}","<"),u=a.getElementsByTagName("*"),j=u.length,w=[],r=0;j>r;r++)w[r]=u[r];if(G||J)for(r=0;j>r;r++)x=w[r],o=x.parentNode===a,(o||J||I&&!H)&&(y=x.offsetTop,G&&o&&Math.abs(y-M)>U&&"BR"!==x.nodeName&&(k=[],G.push(k),M=y),J&&(x._x=x.offsetLeft,x._y=y,x._w=x.offsetWidth,x._h=x.offsetHeight),G&&(H!==o&&I||(k.push(x),x._x-=O),o&&r&&(w[r-1]._wordEnd=!0),"BR"===x.nodeName&&x.nextSibling&&"BR"===x.nextSibling.nodeName&&G.push([])));for(r=0;j>r;r++)x=w[r],o=x.parentNode===a,"BR"!==x.nodeName?(J&&(A=x.style,H||o||(x._x+=x.parentNode._x,x._y+=x.parentNode._y),A.left=x._x+"px",A.top=x._y+"px",A.position="absolute",A.display="block",A.width=x._w+1+"px",A.height=x._h+"px"),H?o&&""!==x.innerHTML?da.push(x):I&&ca.push(x):o?(a.removeChild(x),w.splice(r--,1),j--):!o&&I&&(y=!G&&!J&&x.nextSibling,a.appendChild(x),y||a.appendChild(f.createTextNode(" ")),ca.push(x))):G||J?(a.removeChild(x),w.splice(r--,1),j--):H||a.appendChild(x);if(G){for(J&&(z=f.createElement(E),a.appendChild(z),B=z.offsetWidth+"px",y=z.offsetParent===a?0:a.offsetLeft,a.removeChild(z)),A=a.style.cssText,a.style.cssText="display:none;";a.firstChild;)a.removeChild(a.firstChild);for(C=" "===K&&(!J||!H&&!I),r=0;r<G.length;r++){for(k=G[r],z=f.createElement(E),z.style.cssText="display:block;text-align:"+T+";position:"+(J?"absolute;":"relative;"),_&&(z.className=_+($?r+1:"")),ea.push(z),j=k.length,u=0;j>u;u++)"BR"!==k[u].nodeName&&(x=k[u],z.appendChild(x),C&&(x._wordEnd||H)&&z.appendChild(f.createTextNode(" ")),J&&(0===u&&(z.style.top=x._y+"px",z.style.left=O+y+"px"),x.style.top="0px",y&&(x.style.left=x._x-y+"px")));0===j&&(z.innerHTML="&nbsp;"),H||I||(z.innerHTML=e(z).split(String.fromCharCode(160)).join(" ")),J&&(z.style.width=B,z.style.height=x._h+"px"),a.appendChild(z)}a.style.cssText=A}J&&(V>a.clientHeight&&(a.style.height=V-R+"px",a.clientHeight<V&&(a.style.height=V+P+"px")),W>a.clientWidth&&(a.style.width=W-S+"px",a.clientWidth<W&&(a.style.width=W+Q+"px"))),t(c,ca),t(d,da),t(h,ea)},v=r.prototype;v.split=function(a){this.isSplit&&this.revert(),this.vars=a||this.vars,this._originals.length=this.chars.length=this.words.length=this.lines.length=0;for(var b=this.elements.length;--b>-1;)this._originals[b]=this.elements[b].innerHTML,u(this.elements[b],this.vars,this.chars,this.words,this.lines);return this.chars.reverse(),this.words.reverse(),this.lines.reverse(),this.isSplit=!0,this},v.revert=function(){if(!this._originals)throw"revert() call wasn't scoped properly.";for(var a=this._originals.length;--a>-1;)this.elements[a].innerHTML=this._originals[a];return this.chars=[],this.words=[],this.lines=[],this.isSplit=!1,this},r.selector=a.$||a.jQuery||function(b){var c=a.$||a.jQuery;return c?(r.selector=c,c(b)):"undefined"==typeof document?b:document.querySelectorAll?document.querySelectorAll(b):document.getElementById("#"===b.charAt(0)?b.substr(1):b)},r.version="0.4.0"}(_gsScope),function(a){"use strict";var b=function(){return(_gsScope.GreenSockGlobals||_gsScope)[a]};"function"==typeof define&&define.amd?define([],b):"undefined"!=typeof module&&module.exports&&(module.exports=b())}("SplitText");

try{
	window.GreenSockGlobals = null;
	window._gsQueue = null;
	window._gsDefine = null;

	delete(window.GreenSockGlobals);
	delete(window._gsQueue);
	delete(window._gsDefine);	
   } catch(e) {}

try{
	window.GreenSockGlobals = oldgs;
	window._gsQueue = oldgs_queue;
	} catch(e) {}

if (window.tplogs==true)
	try {
		console.groupEnd();
	} catch(e) {}

(function(e,t){
		e.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage"]};e.expr[":"].uncached=function(t){var n=document.createElement("img");n.src=t.src;return e(t).is('img[src!=""]')&&!n.complete};e.fn.waitForImages=function(t,n,r){if(e.isPlainObject(arguments[0])){n=t.each;r=t.waitForAll;t=t.finished}t=t||e.noop;n=n||e.noop;r=!!r;if(!e.isFunction(t)||!e.isFunction(n)){throw new TypeError("An invalid callback was supplied.")}return this.each(function(){var i=e(this),s=[];if(r){var o=e.waitForImages.hasImageProperties||[],u=/url\((['"]?)(.*?)\1\)/g;i.find("*").each(function(){var t=e(this);if(t.is("img:uncached")){s.push({src:t.attr("src"),element:t[0]})}e.each(o,function(e,n){var r=t.css(n);if(!r){return true}var i;while(i=u.exec(r)){s.push({src:i[2],element:t[0]})}})})}else{i.find("img:uncached").each(function(){s.push({src:this.src,element:this})})}var f=s.length,l=0;if(f==0){t.call(i[0])}e.each(s,function(r,s){var o=new Image;e(o).bind("load error",function(e){l++;n.call(s.element,l,f,e.type=="load");if(l==f){t.call(i[0]);return false}});o.src=s.src})})};		
})(jQuery);
// source --> https://www.vensera.com/wp-content/plugins/revslider/public/assets/js/jquery.themepunch.revolution.min.js 
/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for Revolution Slider
 * @version: 5.3.1.5 (08.12.2016)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
**************************************************************************/
!function(jQuery,undefined){"use strict";var version={core:"5.3.1.4","revolution.extensions.actions.min.js":"2.0.4","revolution.extensions.carousel.min.js":"1.2.1","revolution.extensions.kenburn.min.js":"1.2.0","revolution.extensions.layeranimation.min.js":"3.5.0","revolution.extensions.navigation.min.js":"1.3.2","revolution.extensions.parallax.min.js":"2.2.0","revolution.extensions.slideanims.min.js":"1.6","revolution.extensions.video.min.js":"2.0.2"};jQuery.fn.extend({revolution:function(a){var b={delay:9e3,responsiveLevels:4064,visibilityLevels:[2048,1024,778,480],gridwidth:960,gridheight:500,minHeight:0,autoHeight:"off",sliderType:"standard",sliderLayout:"auto",fullScreenAutoWidth:"off",fullScreenAlignForce:"off",fullScreenOffsetContainer:"",fullScreenOffset:"0",hideCaptionAtLimit:0,hideAllCaptionAtLimit:0,hideSliderAtLimit:0,disableProgressBar:"off",stopAtSlide:-1,stopAfterLoops:-1,shadow:0,dottedOverlay:"none",startDelay:0,lazyType:"smart",spinner:"spinner0",shuffle:"off",viewPort:{enable:!1,outof:"wait",visible_area:"60%",presize:!1},fallbacks:{isJoomla:!1,panZoomDisableOnMobile:"off",simplifyAll:"on",nextSlideOnWindowFocus:"off",disableFocusListener:!0,ignoreHeightChanges:"off",ignoreHeightChangesSize:0},parallax:{type:"off",levels:[10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85],origo:"enterpoint",speed:400,bgparallax:"off",opacity:"on",disable_onmobile:"off",ddd_shadow:"on",ddd_bgfreeze:"off",ddd_overflow:"visible",ddd_layer_overflow:"visible",ddd_z_correction:65,ddd_path:"mouse"},scrolleffect:{fade:"off",blur:"off",grayscale:"off",maxblur:10,on_layers:"off",on_slidebg:"off",on_static_layers:"off",on_parallax_layers:"off",on_parallax_static_layers:"off",direction:"both",multiplicator:1.35,multiplicator_layers:.5,tilt:30,disable_on_mobile:"on"},carousel:{easing:punchgs.Power3.easeInOut,speed:800,showLayersAllTime:"off",horizontal_align:"center",vertical_align:"center",infinity:"on",space:0,maxVisibleItems:3,stretch:"off",fadeout:"on",maxRotation:0,minScale:0,vary_fade:"off",vary_rotation:"on",vary_scale:"off",border_radius:"0px",padding_top:0,padding_bottom:0},navigation:{keyboardNavigation:"off",keyboard_direction:"horizontal",mouseScrollNavigation:"off",onHoverStop:"on",touch:{touchenabled:"off",swipe_treshold:75,swipe_min_touches:1,drag_block_vertical:!1,swipe_direction:"horizontal"},arrows:{style:"",enable:!1,hide_onmobile:!1,hide_onleave:!0,hide_delay:200,hide_delay_mobile:1200,hide_under:0,hide_over:9999,tmp:"",rtl:!1,left:{h_align:"left",v_align:"center",h_offset:20,v_offset:0,container:"slider"},right:{h_align:"right",v_align:"center",h_offset:20,v_offset:0,container:"slider"}},bullets:{container:"slider",rtl:!1,style:"",enable:!1,hide_onmobile:!1,hide_onleave:!0,hide_delay:200,hide_delay_mobile:1200,hide_under:0,hide_over:9999,direction:"horizontal",h_align:"left",v_align:"center",space:0,h_offset:20,v_offset:0,tmp:'<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>'},thumbnails:{container:"slider",rtl:!1,style:"",enable:!1,width:100,height:50,min_width:100,wrapper_padding:2,wrapper_color:"#f5f5f5",wrapper_opacity:1,tmp:'<span class="tp-thumb-image"></span><span class="tp-thumb-title"></span>',visibleAmount:5,hide_onmobile:!1,hide_onleave:!0,hide_delay:200,hide_delay_mobile:1200,hide_under:0,hide_over:9999,direction:"horizontal",span:!1,position:"inner",space:2,h_align:"left",v_align:"center",h_offset:20,v_offset:0},tabs:{container:"slider",rtl:!1,style:"",enable:!1,width:100,min_width:100,height:50,wrapper_padding:10,wrapper_color:"#f5f5f5",wrapper_opacity:1,tmp:'<span class="tp-tab-image"></span>',visibleAmount:5,hide_onmobile:!1,hide_onleave:!0,hide_delay:200,hide_delay_mobile:1200,hide_under:0,hide_over:9999,direction:"horizontal",span:!1,space:0,position:"inner",h_align:"left",v_align:"center",h_offset:20,v_offset:0}},extensions:"extensions/",extensions_suffix:".min.js",debugMode:!1};return a=jQuery.extend(!0,{},b,a),this.each(function(){var b=jQuery(this);a.minHeight=a.minHeight!=undefined?parseInt(a.minHeight,0):a.minHeight,a.scrolleffect.on="on"===a.scrolleffect.fade||"on"===a.scrolleffect.blur||"on"===a.scrolleffect.grayscale,"hero"==a.sliderType&&b.find(">ul>li").each(function(a){a>0&&jQuery(this).remove()}),a.jsFileLocation=a.jsFileLocation||getScriptLocation("themepunch.revolution.min.js"),a.jsFileLocation=a.jsFileLocation+a.extensions,a.scriptsneeded=getNeededScripts(a,b),a.curWinRange=0,a.rtl=!0,a.navigation!=undefined&&a.navigation.touch!=undefined&&(a.navigation.touch.swipe_min_touches=a.navigation.touch.swipe_min_touches>5?1:a.navigation.touch.swipe_min_touches),jQuery(this).on("scriptsloaded",function(){return a.modulesfailing?(b.html('<div style="margin:auto;line-height:40px;font-size:14px;color:#fff;padding:15px;background:#e74c3c;margin:20px 0px;">!! Error at loading Slider Revolution 5.0 Extrensions.'+a.errorm+"</div>").show(),!1):(_R.migration!=undefined&&(a=_R.migration(b,a)),punchgs.force3D=!0,"on"!==a.simplifyAll&&punchgs.TweenLite.lagSmoothing(1e3,16),prepareOptions(b,a),void initSlider(b,a))}),b[0].opt=a,waitForScripts(b,a)})},revremoveslide:function(a){return this.each(function(){var b=jQuery(this),c=b[0].opt;if(!(a<0||a>c.slideamount)&&b!=undefined&&b.length>0&&jQuery("body").find("#"+b.attr("id")).length>0&&c&&c.li.length>0&&(a>0||a<=c.li.length)){var d=jQuery(c.li[a]),e=d.data("index"),f=!1;c.slideamount=c.slideamount-1,c.realslideamount=c.realslideamount-1,removeNavWithLiref(".tp-bullet",e,c),removeNavWithLiref(".tp-tab",e,c),removeNavWithLiref(".tp-thumb",e,c),d.hasClass("active-revslide")&&(f=!0),d.remove(),c.li=removeArray(c.li,a),c.carousel&&c.carousel.slides&&(c.carousel.slides=removeArray(c.carousel.slides,a)),c.thumbs=removeArray(c.thumbs,a),_R.updateNavIndexes&&_R.updateNavIndexes(c),f&&b.revnext(),punchgs.TweenLite.set(c.li,{minWidth:"99%"}),punchgs.TweenLite.set(c.li,{minWidth:"100%"})}})},revaddcallback:function(a){return this.each(function(){this.opt&&(this.opt.callBackArray===undefined&&(this.opt.callBackArray=new Array),this.opt.callBackArray.push(a))})},revgetparallaxproc:function(){return jQuery(this)[0].opt.scrollproc},revdebugmode:function(){return this.each(function(){var a=jQuery(this);a[0].opt.debugMode=!0,containerResized(a,a[0].opt)})},revscroll:function(a){return this.each(function(){var b=jQuery(this);jQuery("body,html").animate({scrollTop:b.offset().top+b.height()-a+"px"},{duration:400})})},revredraw:function(a){return this.each(function(){var a=jQuery(this);containerResized(a,a[0].opt)})},revkill:function(a){var b=this,c=jQuery(this);if(punchgs.TweenLite.killDelayedCallsTo(_R.showHideNavElements),c!=undefined&&c.length>0&&jQuery("body").find("#"+c.attr("id")).length>0){c.data("conthover",1),c.data("conthover-changed",1),c.trigger("revolution.slide.onpause");var d=c.parent().find(".tp-bannertimer"),e=c[0].opt;e.tonpause=!0,c.trigger("stoptimer"),punchgs.TweenLite.killTweensOf(c.find("*"),!1),punchgs.TweenLite.killTweensOf(c,!1),c.unbind("hover, mouseover, mouseenter,mouseleave, resize");var f="resize.revslider-"+c.attr("id");jQuery(window).off(f),c.find("*").each(function(){var a=jQuery(this);a.unbind("on, hover, mouseenter,mouseleave,mouseover, resize,restarttimer, stoptimer"),a.off("on, hover, mouseenter,mouseleave,mouseover, resize"),a.data("mySplitText",null),a.data("ctl",null),a.data("tween")!=undefined&&a.data("tween").kill(),a.data("kenburn")!=undefined&&a.data("kenburn").kill(),a.data("timeline_out")!=undefined&&a.data("timeline_out").kill(),a.data("timeline")!=undefined&&a.data("timeline").kill(),a.remove(),a.empty(),a=null}),punchgs.TweenLite.killTweensOf(c.find("*"),!1),punchgs.TweenLite.killTweensOf(c,!1),d.remove();try{c.closest(".forcefullwidth_wrapper_tp_banner").remove()}catch(a){}try{c.closest(".rev_slider_wrapper").remove()}catch(a){}try{c.remove()}catch(a){}return c.empty(),c.html(),c=null,e=null,delete b.c,delete b.opt,!0}return!1},revpause:function(){return this.each(function(){var a=jQuery(this);a!=undefined&&a.length>0&&jQuery("body").find("#"+a.attr("id")).length>0&&(a.data("conthover",1),a.data("conthover-changed",1),a.trigger("revolution.slide.onpause"),a[0].opt.tonpause=!0,a.trigger("stoptimer"))})},revresume:function(){return this.each(function(){var a=jQuery(this);a!=undefined&&a.length>0&&jQuery("body").find("#"+a.attr("id")).length>0&&(a.data("conthover",0),a.data("conthover-changed",1),a.trigger("revolution.slide.onresume"),a[0].opt.tonpause=!1,a.trigger("starttimer"))})},revstart:function(){var a=jQuery(this);if(a!=undefined&&a.length>0&&jQuery("body").find("#"+a.attr("id")).length>0&&a[0].opt!==undefined)return a[0].opt.sliderisrunning?(console.log("Slider Is Running Already"),!1):(runSlider(a,a[0].opt),!0)},revnext:function(){return this.each(function(){var a=jQuery(this);a!=undefined&&a.length>0&&jQuery("body").find("#"+a.attr("id")).length>0&&_R.callingNewSlide(a,1)})},revprev:function(){return this.each(function(){var a=jQuery(this);a!=undefined&&a.length>0&&jQuery("body").find("#"+a.attr("id")).length>0&&_R.callingNewSlide(a,-1)})},revmaxslide:function(){return jQuery(this).find(".tp-revslider-mainul >li").length},revcurrentslide:function(){var a=jQuery(this);if(a!=undefined&&a.length>0&&jQuery("body").find("#"+a.attr("id")).length>0)return parseInt(a[0].opt.act,0)+1},revlastslide:function(){return jQuery(this).find(".tp-revslider-mainul >li").length},revshowslide:function(a){return this.each(function(){var b=jQuery(this);b!=undefined&&b.length>0&&jQuery("body").find("#"+b.attr("id")).length>0&&_R.callingNewSlide(b,"to"+(a-1))})},revcallslidewithid:function(a){return this.each(function(){var b=jQuery(this);b!=undefined&&b.length>0&&jQuery("body").find("#"+b.attr("id")).length>0&&_R.callingNewSlide(b,a)})}});var _R=jQuery.fn.revolution;jQuery.extend(!0,_R,{getversion:function(){return version},compare_version:function(a){return"stop"!=a.check&&(_R.getversion().core<a.min_core?(a.check===undefined&&(console.log("%cSlider Revolution Warning (Core:"+_R.getversion().core+")","color:#c0392b;font-weight:bold;"),console.log("%c     Core is older than expected ("+a.min_core+") from "+a.alias,"color:#333"),console.log("%c     Please update Slider Revolution to the latest version.","color:#333"),console.log("%c     It might be required to purge and clear Server/Client side Caches.","color:#333")),a.check="stop"):_R.getversion()[a.name]!=undefined&&a.version<_R.getversion()[a.name]&&(a.check===undefined&&(console.log("%cSlider Revolution Warning (Core:"+_R.getversion().core+")","color:#c0392b;font-weight:bold;"),console.log("%c     "+a.alias+" ("+a.version+") is older than requiered ("+_R.getversion()[a.name]+")","color:#333"),console.log("%c     Please update Slider Revolution to the latest version.","color:#333"),console.log("%c     It might be required to purge and clear Server/Client side Caches.","color:#333")),a.check="stop")),a},currentSlideIndex:function(a){var b=a.c.find(".active-revslide").index();return b=b==-1?0:b},simp:function(a,b,c){var d=Math.abs(a)-Math.floor(Math.abs(a/b))*b;return c?d:a<0?-1*d:d},iOSVersion:function(){var a=!1;return navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/iPad/i)?navigator.userAgent.match(/OS 4_\d like Mac OS X/i)&&(a=!0):a=!1,a},isIE:function(a,b){var c=jQuery('<div style="display:none;"/>').appendTo(jQuery("body"));c.html("<!--[if "+(b||"")+" IE "+(a||"")+"]><a>&nbsp;</a><![endif]-->");var d=c.find("a").length;return c.remove(),d},is_mobile:function(){var a=["android","webos","iphone","ipad","blackberry","Android","webos",,"iPod","iPhone","iPad","Blackberry","BlackBerry"],b=!1;for(var c in a)navigator.userAgent.split(a[c]).length>1&&(b=!0);return b},callBackHandling:function(a,b,c){try{a.callBackArray&&jQuery.each(a.callBackArray,function(a,d){d&&d.inmodule&&d.inmodule===b&&d.atposition&&d.atposition===c&&d.callback&&d.callback.call()})}catch(a){console.log("Call Back Failed")}},get_browser:function(){var c,a=navigator.appName,b=navigator.userAgent,d=b.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);return d&&null!=(c=b.match(/version\/([\.\d]+)/i))&&(d[2]=c[1]),d=d?[d[1],d[2]]:[a,navigator.appVersion,"-?"],d[0]},get_browser_version:function(){var c,a=navigator.appName,b=navigator.userAgent,d=b.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);return d&&null!=(c=b.match(/version\/([\.\d]+)/i))&&(d[2]=c[1]),d=d?[d[1],d[2]]:[a,navigator.appVersion,"-?"],d[1]},getHorizontalOffset:function(a,b){var c=gWiderOut(a,".outer-left"),d=gWiderOut(a,".outer-right");switch(b){case"left":return c;case"right":return d;case"both":return c+d}},callingNewSlide:function(a,b){var c=a.find(".next-revslide").length>0?a.find(".next-revslide").index():a.find(".processing-revslide").length>0?a.find(".processing-revslide").index():a.find(".active-revslide").index(),d=0,e=a[0].opt;a.find(".next-revslide").removeClass("next-revslide"),a.find(".active-revslide").hasClass("tp-invisible-slide")&&(c=e.last_shown_slide),b&&jQuery.isNumeric(b)||b.match(/to/g)?(1===b||b===-1?(d=c+b,d=d<0?e.slideamount-1:d>=e.slideamount?0:d):(b=jQuery.isNumeric(b)?b:parseInt(b.split("to")[1],0),d=b<0?0:b>e.slideamount-1?e.slideamount-1:b),a.find(".tp-revslider-slidesli:eq("+d+")").addClass("next-revslide")):b&&a.find(".tp-revslider-slidesli").each(function(){var a=jQuery(this);a.data("index")===b&&a.addClass("next-revslide")}),d=a.find(".next-revslide").index(),a.trigger("revolution.nextslide.waiting"),c===d&&c===e.last_shown_slide||d!==c&&d!=-1?swapSlide(a):a.find(".next-revslide").removeClass("next-revslide")},slotSize:function(a,b){b.slotw=Math.ceil(b.width/b.slots),"fullscreen"==b.sliderLayout?b.sloth=Math.ceil(jQuery(window).height()/b.slots):b.sloth=Math.ceil(b.height/b.slots),"on"==b.autoHeight&&a!==undefined&&""!==a&&(b.sloth=Math.ceil(a.height()/b.slots))},setSize:function(a){var b=(a.top_outer||0)+(a.bottom_outer||0),c=parseInt(a.carousel.padding_top||0,0),d=parseInt(a.carousel.padding_bottom||0,0),e=a.gridheight[a.curWinRange],f=0,g=a.nextSlide===-1||a.nextSlide===undefined?0:a.nextSlide;if(a.paddings=a.paddings===undefined?{top:parseInt(a.c.parent().css("paddingTop"),0)||0,bottom:parseInt(a.c.parent().css("paddingBottom"),0)||0}:a.paddings,a.rowzones&&a.rowzones.length>0)for(var h=0;h<a.rowzones[g].length;h++)f+=a.rowzones[g][h][0].offsetHeight;if(e=e<a.minHeight?a.minHeight:e,e=e<f?f:e,"fullwidth"==a.sliderLayout&&"off"==a.autoHeight&&punchgs.TweenLite.set(a.c,{maxHeight:e+"px"}),a.c.css({marginTop:c,marginBottom:d}),a.width=a.ul.width(),a.height=a.ul.height(),setScale(a),a.height=Math.round(a.gridheight[a.curWinRange]*(a.width/a.gridwidth[a.curWinRange])),a.height>a.gridheight[a.curWinRange]&&"on"!=a.autoHeight&&(a.height=a.gridheight[a.curWinRange]),"fullscreen"==a.sliderLayout||a.infullscreenmode){a.height=a.bw*a.gridheight[a.curWinRange];var j=(a.c.parent().width(),jQuery(window).height());if(a.fullScreenOffsetContainer!=undefined){try{var k=a.fullScreenOffsetContainer.split(",");k&&jQuery.each(k,function(a,b){j=jQuery(b).length>0?j-jQuery(b).outerHeight(!0):j})}catch(a){}try{a.fullScreenOffset.split("%").length>1&&a.fullScreenOffset!=undefined&&a.fullScreenOffset.length>0?j-=jQuery(window).height()*parseInt(a.fullScreenOffset,0)/100:a.fullScreenOffset!=undefined&&a.fullScreenOffset.length>0&&(j-=parseInt(a.fullScreenOffset,0))}catch(a){}}j=j<a.minHeight?a.minHeight:j,j-=b,a.c.parent().height(j),a.c.closest(".rev_slider_wrapper").height(j),a.c.css({height:"100%"}),a.height=j,a.minHeight!=undefined&&a.height<a.minHeight&&(a.height=a.minHeight),a.height=parseInt(f,0)>parseInt(a.height,0)?f:a.height}else a.minHeight!=undefined&&a.height<a.minHeight&&(a.height=a.minHeight),a.height=parseInt(f,0)>parseInt(a.height,0)?f:a.height,a.c.height(a.height);var l={height:c+d+b+a.height+a.paddings.top+a.paddings.bottom};a.c.closest(".forcefullwidth_wrapper_tp_banner").find(".tp-fullwidth-forcer").css(l),a.c.closest(".rev_slider_wrapper").css(l),setScale(a)},enterInViewPort:function(a){a.waitForCountDown&&(countDown(a.c,a),a.waitForCountDown=!1),a.waitForFirstSlide&&(swapSlide(a.c),a.waitForFirstSlide=!1,setTimeout(function(){a.c.removeClass("tp-waitforfirststart")},500)),"playing"!=a.sliderlaststatus&&a.sliderlaststatus!=undefined||a.c.trigger("starttimer"),a.lastplayedvideos!=undefined&&a.lastplayedvideos.length>0&&jQuery.each(a.lastplayedvideos,function(b,c){_R.playVideo(c,a)})},leaveViewPort:function(a){a.sliderlaststatus=a.sliderstatus,a.c.trigger("stoptimer"),a.playingvideos!=undefined&&a.playingvideos.length>0&&(a.lastplayedvideos=jQuery.extend(!0,[],a.playingvideos),a.playingvideos&&jQuery.each(a.playingvideos,function(b,c){a.leaveViewPortBasedStop=!0,_R.stopVideo&&_R.stopVideo(c,a)}))},unToggleState:function(a){a!=undefined&&a.length>0&&jQuery.each(a,function(a,b){b.removeClass("rs-toggle-content-active")})},toggleState:function(a){a!=undefined&&a.length>0&&jQuery.each(a,function(a,b){b.addClass("rs-toggle-content-active")})},swaptoggleState:function(a){a!=undefined&&a.length>0&&jQuery.each(a,function(a,b){jQuery(b).hasClass("rs-toggle-content-active")?jQuery(b).removeClass("rs-toggle-content-active"):jQuery(b).addClass("rs-toggle-content-active")})},lastToggleState:function(a){var b=0;return a!=undefined&&a.length>0&&jQuery.each(a,function(a,c){b=c.hasClass("rs-toggle-content-active")}),b}});var _ISM=_R.is_mobile(),checkIDS=function(a,b){a.anyid=a.anyid===undefined?[]:a.anyid;var c=jQuery.inArray(b.attr("id"),a.anyid);if(c!=-1){var d=b.attr("id")+"_"+Math.round(9999*Math.random());b.attr("id",d)}a.anyid.push(b.attr("id"))},removeArray=function(a,b){var c=[];return jQuery.each(a,function(a,d){a!=b&&c.push(d)}),c},removeNavWithLiref=function(a,b,c){c.c.find(a).each(function(){var a=jQuery(this);a.data("liref")===b&&a.remove()})},lAjax=function(a,b){return!jQuery("body").data(a)&&(b.filesystem?(b.errorm===undefined&&(b.errorm="<br>Local Filesystem Detected !<br>Put this to your header:"),console.warn("Local Filesystem detected !"),b.errorm=b.errorm+'<br>&lt;script type="text/javascript" src="'+b.jsFileLocation+a+b.extensions_suffix+'"&gt;&lt;/script&gt;',console.warn(b.jsFileLocation+a+b.extensions_suffix+" could not be loaded !"),console.warn("Please use a local Server or work online or make sure that you load all needed Libraries manually in your Document."),console.log(" "),b.modulesfailing=!0,!1):(jQuery.ajax({url:b.jsFileLocation+a+b.extensions_suffix+"?version="+version.core,dataType:"script",cache:!0,error:function(c){console.warn("Slider Revolution 5.0 Error !"),console.error("Failure at Loading:"+a+b.extensions_suffix+" on Path:"+b.jsFileLocation),console.info(c)}}),void jQuery("body").data(a,!0)))},getNeededScripts=function(a,b){var c=new Object,d=a.navigation;return c.kenburns=!1,c.parallax=!1,c.carousel=!1,c.navigation=!1,c.videos=!1,c.actions=!1,c.layeranim=!1,c.migration=!1,b.data("version")&&b.data("version").toString().match(/5./gi)?(b.find("img").each(function(){"on"==jQuery(this).data("kenburns")&&(c.kenburns=!0)}),("carousel"==a.sliderType||"on"==d.keyboardNavigation||"on"==d.mouseScrollNavigation||"on"==d.touch.touchenabled||d.arrows.enable||d.bullets.enable||d.thumbnails.enable||d.tabs.enable)&&(c.navigation=!0),b.find(".tp-caption, .tp-static-layer, .rs-background-video-layer").each(function(){var a=jQuery(this);(a.data("ytid")!=undefined||a.find("iframe").length>0&&a.find("iframe").attr("src").toLowerCase().indexOf("youtube")>0)&&(c.videos=!0),(a.data("vimeoid")!=undefined||a.find("iframe").length>0&&a.find("iframe").attr("src").toLowerCase().indexOf("vimeo")>0)&&(c.videos=!0),a.data("actions")!==undefined&&(c.actions=!0),c.layeranim=!0}),b.find("li").each(function(){jQuery(this).data("link")&&jQuery(this).data("link")!=undefined&&(c.layeranim=!0,c.actions=!0)}),!c.videos&&(b.find(".rs-background-video-layer").length>0||b.find(".tp-videolayer").length>0||b.find(".tp-audiolayer").length>0||b.find("iframe").length>0||b.find("video").length>0)&&(c.videos=!0),"carousel"==a.sliderType&&(c.carousel=!0),("off"!==a.parallax.type||a.viewPort.enable||"true"==a.viewPort.enable||"true"===a.scrolleffect.on||a.scrolleffect.on)&&(c.parallax=!0)):(c.kenburns=!0,c.parallax=!0,c.carousel=!1,c.navigation=!0,c.videos=!0,c.actions=!0,c.layeranim=!0,c.migration=!0),"hero"==a.sliderType&&(c.carousel=!1,c.navigation=!1),window.location.href.match(/file:/gi)&&(c.filesystem=!0,a.filesystem=!0),c.videos&&"undefined"==typeof _R.isVideoPlaying&&lAjax("revolution.extension.video",a),c.carousel&&"undefined"==typeof _R.prepareCarousel&&lAjax("revolution.extension.carousel",a),c.carousel||"undefined"!=typeof _R.animateSlide||lAjax("revolution.extension.slideanims",a),c.actions&&"undefined"==typeof _R.checkActions&&lAjax("revolution.extension.actions",a),c.layeranim&&"undefined"==typeof _R.handleStaticLayers&&lAjax("revolution.extension.layeranimation",a),c.kenburns&&"undefined"==typeof _R.stopKenBurn&&lAjax("revolution.extension.kenburn",a),c.navigation&&"undefined"==typeof _R.createNavigation&&lAjax("revolution.extension.navigation",a),c.migration&&"undefined"==typeof _R.migration&&lAjax("revolution.extension.migration",a),c.parallax&&"undefined"==typeof _R.checkForParallax&&lAjax("revolution.extension.parallax",a),a.addons!=undefined&&a.addons.length>0&&jQuery.each(a.addons,function(b,c){"object"==typeof c&&c.fileprefix!=undefined&&lAjax(c.fileprefix,a)}),c},waitForScripts=function(a,b){var c=!0,d=b.scriptsneeded;b.addons!=undefined&&b.addons.length>0&&jQuery.each(b.addons,function(a,b){"object"==typeof b&&b.init!=undefined&&_R[b.init]===undefined&&(c=!1)}),d.filesystem||"undefined"!=typeof punchgs&&c&&(!d.kenburns||d.kenburns&&"undefined"!=typeof _R.stopKenBurn)&&(!d.navigation||d.navigation&&"undefined"!=typeof _R.createNavigation)&&(!d.carousel||d.carousel&&"undefined"!=typeof _R.prepareCarousel)&&(!d.videos||d.videos&&"undefined"!=typeof _R.resetVideo)&&(!d.actions||d.actions&&"undefined"!=typeof _R.checkActions)&&(!d.layeranim||d.layeranim&&"undefined"!=typeof _R.handleStaticLayers)&&(!d.migration||d.migration&&"undefined"!=typeof _R.migration)&&(!d.parallax||d.parallax&&"undefined"!=typeof _R.checkForParallax)&&(d.carousel||!d.carousel&&"undefined"!=typeof _R.animateSlide)?a.trigger("scriptsloaded"):setTimeout(function(){waitForScripts(a,b)},50)},getScriptLocation=function(a){var b=new RegExp("themepunch.revolution.min.js","gi"),c="";return jQuery("script").each(function(){var a=jQuery(this).attr("src");a&&a.match(b)&&(c=a)}),c=c.replace("jquery.themepunch.revolution.min.js",""),c=c.replace("jquery.themepunch.revolution.js",""),c=c.split("?")[0]},setCurWinRange=function(a,b){var d=9999,e=0,f=0,g=0,h=jQuery(window).width(),i=b&&9999==a.responsiveLevels?a.visibilityLevels:a.responsiveLevels;i&&i.length&&jQuery.each(i,function(a,b){h<b&&(0==e||e>b)&&(d=b,g=a,e=b),h>b&&e<b&&(e=b,f=a)}),e<d&&(g=f),b?a.forcedWinRange=g:a.curWinRange=g},prepareOptions=function(a,b){b.carousel.maxVisibleItems=b.carousel.maxVisibleItems<1?999:b.carousel.maxVisibleItems,b.carousel.vertical_align="top"===b.carousel.vertical_align?"0%":"bottom"===b.carousel.vertical_align?"100%":"50%"},gWiderOut=function(a,b){var c=0;return a.find(b).each(function(){var a=jQuery(this);!a.hasClass("tp-forcenotvisible")&&c<a.outerWidth()&&(c=a.outerWidth())}),c},initSlider=function(container,opt){return container!=undefined&&(container.data("aimg")!=undefined&&("enabled"==container.data("aie8")&&_R.isIE(8)||"enabled"==container.data("amobile")&&_ISM)&&container.html('<img class="tp-slider-alternative-image" src="'+container.data("aimg")+'">'),container.find(">ul").addClass("tp-revslider-mainul"),opt.c=container,opt.ul=container.find(".tp-revslider-mainul"),opt.ul.find(">li").each(function(a){var b=jQuery(this);"on"==b.data("hideslideonmobile")&&_ISM&&b.remove(),(b.data("invisible")||b.data("invisible")===!0)&&(b.addClass("tp-invisible-slide"),b.appendTo(opt.ul))}),opt.addons!=undefined&&opt.addons.length>0&&jQuery.each(opt.addons,function(i,obj){"object"==typeof obj&&obj.init!=undefined&&_R[obj.init](eval(obj.params))}),opt.cid=container.attr("id"),opt.ul.css({visibility:"visible"}),opt.slideamount=opt.ul.find(">li").not(".tp-invisible-slide").length,opt.realslideamount=opt.ul.find(">li").length,opt.slayers=container.find(".tp-static-layers"),opt.slayers.data("index","staticlayers"),void(1!=opt.waitForInit&&(container[0].opt=opt,runSlider(container,opt))))},onFullScreenChange=function(){jQuery("body").data("rs-fullScreenMode",!jQuery("body").data("rs-fullScreenMode")),jQuery("body").data("rs-fullScreenMode")&&setTimeout(function(){jQuery(window).trigger("resize")},200)},runSlider=function(a,b){if(b.sliderisrunning=!0,b.ul.find(">li").each(function(a){jQuery(this).data("originalindex",a)}),"on"==b.shuffle){var c=new Object,d=b.ul.find(">li:first-child");c.fstransition=d.data("fstransition"),c.fsmasterspeed=d.data("fsmasterspeed"),c.fsslotamount=d.data("fsslotamount");for(var e=0;e<b.slideamount;e++){var f=Math.round(Math.random()*b.slideamount);b.ul.find(">li:eq("+f+")").prependTo(b.ul)}var g=b.ul.find(">li:first-child");g.data("fstransition",c.fstransition),g.data("fsmasterspeed",c.fsmasterspeed),g.data("fsslotamount",c.fsslotamount),b.li=b.ul.find(">li").not(".tp-invisible-slide")}if(b.allli=b.ul.find(">li"),b.li=b.ul.find(">li").not(".tp-invisible-slide"),b.inli=b.ul.find(">li.tp-invisible-slide"),b.thumbs=new Array,b.slots=4,b.act=-1,b.firststart=1,b.loadqueue=new Array,b.syncload=0,b.conw=a.width(),b.conh=a.height(),b.responsiveLevels.length>1?b.responsiveLevels[0]=9999:b.responsiveLevels=9999,jQuery.each(b.allli,function(a,c){var c=jQuery(c),d=c.find(".rev-slidebg")||c.find("img").first(),e=0;c.addClass("tp-revslider-slidesli"),c.data("index")===undefined&&c.data("index","rs-"+Math.round(999999*Math.random()));var f=new Object;f.params=new Array,f.id=c.data("index"),f.src=c.data("thumb")!==undefined?c.data("thumb"):d.data("lazyload")!==undefined?d.data("lazyload"):d.attr("src"),c.data("title")!==undefined&&f.params.push({from:RegExp("\\{\\{title\\}\\}","g"),to:c.data("title")}),c.data("description")!==undefined&&f.params.push({from:RegExp("\\{\\{description\\}\\}","g"),to:c.data("description")});for(var e=1;e<=10;e++)c.data("param"+e)!==undefined&&f.params.push({from:RegExp("\\{\\{param"+e+"\\}\\}","g"),to:c.data("param"+e)});if(b.thumbs.push(f),c.data("origindex",c.index()),c.data("link")!=undefined){var g=c.data("link"),h=c.data("target")||"_self",i="back"===c.data("slideindex")?0:60,j=c.data("linktoslide"),k=j;j!=undefined&&"next"!=j&&"prev"!=j&&b.allli.each(function(){var a=jQuery(this);a.data("origindex")+1==k&&(j=a.data("index"))}),"slide"!=g&&(j="no");var l='<div class="tp-caption slidelink" style="cursor:pointer;width:100%;height:100%;z-index:'+i+';" data-x="center" data-y="center" data-basealign="slide" ',m="scroll_under"===j?'[{"event":"click","action":"scrollbelow","offset":"100px","delay":"0"}]':"prev"===j?'[{"event":"click","action":"jumptoslide","slide":"prev","delay":"0.2"}]':"next"===j?'[{"event":"click","action":"jumptoslide","slide":"next","delay":"0.2"}]':'[{"event":"click","action":"jumptoslide","slide":"'+j+'","delay":"0.2"}]';l="no"==j?l+' data-start="0">':l+"data-actions='"+m+'\' data-start="0">',l+='<a style="width:100%;height:100%;display:block"',l="slide"!=g?l+' target="'+h+'" href="'+g+'"':l,l+='><span style="width:100%;height:100%;display:block"></span></a></div>',c.append(l)}}),b.rle=b.responsiveLevels.length||1,b.gridwidth=cArray(b.gridwidth,b.rle),b.gridheight=cArray(b.gridheight,b.rle),"on"==b.simplifyAll&&(_R.isIE(8)||_R.iOSVersion())&&(a.find(".tp-caption").each(function(){var a=jQuery(this);a.removeClass("customin customout").addClass("fadein fadeout"),a.data("splitin",""),a.data("speed",400)}),b.allli.each(function(){var a=jQuery(this);a.data("transition","fade"),a.data("masterspeed",500),a.data("slotamount",1);var b=a.find(".rev-slidebg")||a.find(">img").first();b.data("kenburns","off")})),b.desktop=!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i),b.autoHeight="fullscreen"==b.sliderLayout?"on":b.autoHeight,"fullwidth"==b.sliderLayout&&"off"==b.autoHeight&&a.css({maxHeight:b.gridheight[b.curWinRange]+"px"}),"auto"!=b.sliderLayout&&0==a.closest(".forcefullwidth_wrapper_tp_banner").length&&("fullscreen"!==b.sliderLayout||"on"!=b.fullScreenAutoWidth)){var h=a.parent(),i=h.css("marginBottom"),j=h.css("marginTop"),k=a.attr("id")+"_forcefullwidth";i=i===undefined?0:i,j=j===undefined?0:j,h.wrap('<div class="forcefullwidth_wrapper_tp_banner" id="'+k+'" style="position:relative;width:100%;height:auto;margin-top:'+j+";margin-bottom:"+i+'"></div>'),a.closest(".forcefullwidth_wrapper_tp_banner").append('<div class="tp-fullwidth-forcer" style="width:100%;height:'+a.height()+'px"></div>'),a.parent().css({marginTop:"0px",marginBottom:"0px"}),a.parent().css({position:"absolute"})}if(b.shadow!==undefined&&b.shadow>0&&(a.parent().addClass("tp-shadow"+b.shadow),a.parent().append('<div class="tp-shadowcover"></div>'),a.parent().find(".tp-shadowcover").css({backgroundColor:a.parent().css("backgroundColor"),backgroundImage:a.parent().css("backgroundImage")})),setCurWinRange(b),setCurWinRange(b,!0),!a.hasClass("revslider-initialised")){a.addClass("revslider-initialised"),a.addClass("tp-simpleresponsive"),a.attr("id")==undefined&&a.attr("id","revslider-"+Math.round(1e3*Math.random()+5)),checkIDS(b,a),b.firefox13=!1,b.ie=!jQuery.support.opacity,b.ie9=9==document.documentMode,b.origcd=b.delay;var l=jQuery.fn.jquery.split("."),m=parseFloat(l[0]),n=parseFloat(l[1]);parseFloat(l[2]||"0");1==m&&n<7&&a.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:'+l+" <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>"),m>1&&(b.ie=!1);var p=new Object;p.addedyt=0,p.addedvim=0,p.addedvid=0,b.scrolleffect.on&&(b.scrolleffect.layers=new Array),a.find(".tp-caption, .rs-background-video-layer").each(function(a){var c=jQuery(this),d=c.data(),e=d.autoplayonlyfirsttime,f=d.autoplay,g=c.hasClass("tp-audiolayer"),h=d.videoloop,i=!0,j=!1;d.startclasses=c.attr("class"),d.isparallaxlayer=d.startclasses.indexOf("rs-parallax")>=0,c.hasClass("tp-static-layer")&&_R.handleStaticLayers&&(_R.handleStaticLayers(c,b),b.scrolleffect.on&&("on"===b.scrolleffect.on_parallax_static_layers&&d.isparallaxlayer||"on"===b.scrolleffect.on_static_layers&&!d.isparallaxlayer)&&(j=!0),i=!1);var k=c.data("noposteronmobile")||c.data("noPosterOnMobile")||c.data("posteronmobile")||c.data("posterOnMobile")||c.data("posterOnMObile");c.data("noposteronmobile",k);var l=0;if(c.find("iframe").each(function(){punchgs.TweenLite.set(jQuery(this),{autoAlpha:0}),l++}),l>0&&c.data("iframes",!0),c.hasClass("tp-caption")){var m=c.hasClass("slidelink")?"width:100% !important;height:100% !important;":"",n=c.data(),o=n.type,q="row"===o||"column"===o?"relative":"absolute",r="";"row"===o?(c.addClass("rev_row").removeClass("tp-resizeme"),r="rev_row_wrap"):"column"===o?(r="rev_column",c.addClass("rev_column_inner").removeClass("tp-resizeme"),c.data("width","auto"),punchgs.TweenLite.set(c,{width:"auto"})):"group"===o&&c.removeClass("tp-resizeme");var s="",t="";"row"!==o&&"group"!==o&&"column"!==o?(s="display:"+c.css("display")+";",c.closest(".rev_column").length>0?(c.addClass("rev_layer_in_column"),i=!1):c.closest(".rev_group").length>0&&(c.addClass("rev_layer_in_group"),i=!1)):"column"===o&&(i=!1),n.wrapper_class!==undefined&&(r=r+" "+n.wrapper_class),n.wrapper_id!==undefined&&(t='id="'+n.wrapper_id+'"'),c.wrap("<div "+t+' class="tp-parallax-wrap '+r+'" style="'+m+"position:"+q+";"+s+';visibility:hidden"><div class="tp-loop-wrap" style="'+m+"position:"+q+";"+s+';"><div class="tp-mask-wrap" style="'+m+"position:"+q+";"+s+';" ></div></div></div>'),i&&b.scrolleffect.on&&("on"===b.scrolleffect.on_parallax_layers&&d.isparallaxlayer||"on"===b.scrolleffect.on_layers&&!d.isparallaxlayer)&&b.scrolleffect.layers.push(c.parent()),
j&&b.scrolleffect.layers.push(c.parent()),"column"===o&&(c.append('<div class="rev_column_bg rev_column_bg_man_sized" style="display:none"></div>'),c.closest(".tp-parallax-wrap").append('<div class="rev_column_bg rev_column_bg_auto_sized"></div>'));var u=["pendulum","rotate","slideloop","pulse","wave"],v=c.closest(".tp-loop-wrap");jQuery.each(u,function(a,b){var d=c.find(".rs-"+b),e=d.data()||"";""!=e&&(v.data(e),v.addClass("rs-"+b),d.children(0).unwrap(),c.data("loopanimation","on"))}),c.attr("id")===undefined&&c.attr("id","layer-"+Math.round(999999999*Math.random())),checkIDS(b,c),punchgs.TweenLite.set(c,{visibility:"hidden"})}var w=c.data("actions");w!==undefined&&_R.checkActions(c,b,w),checkHoverDependencies(c,b),_R.checkVideoApis&&(p=_R.checkVideoApis(c,b,p)),_ISM&&(1!=e&&"true"!=e||(d.autoplayonlyfirsttime=!1,e=!1),1!=f&&"true"!=f&&"on"!=f&&"1sttime"!=f||(d.autoplay="off",f="off")),g||1!=e&&"true"!=e&&"1sttime"!=f||"loopandnoslidestop"==h||c.closest("li.tp-revslider-slidesli").addClass("rs-pause-timer-once"),g||1!=f&&"true"!=f&&"on"!=f&&"no1sttime"!=f||"loopandnoslidestop"==h||c.closest("li.tp-revslider-slidesli").addClass("rs-pause-timer-always")}),a[0].addEventListener("mouseenter",function(){a.trigger("tp-mouseenter"),b.overcontainer=!0},{passive:!0}),a[0].addEventListener("mouseover",function(){a.trigger("tp-mouseover"),b.overcontainer=!0},{passive:!0}),a[0].addEventListener("mouseleave",function(){a.trigger("tp-mouseleft"),b.overcontainer=!1},{passive:!0}),a.find(".tp-caption video").each(function(a){var b=jQuery(this);b.removeClass("video-js vjs-default-skin"),b.attr("preload",""),b.css({display:"none"})}),"standard"!==b.sliderType&&(b.lazyType="all"),loadImages(a.find(".tp-static-layers"),b,0,!0),waitForCurrentImages(a.find(".tp-static-layers"),b,function(){a.find(".tp-static-layers img").each(function(){var a=jQuery(this),c=a.data("lazyload")!=undefined?a.data("lazyload"):a.attr("src"),d=getLoadObj(b,c);a.attr("src",d.src)})}),b.rowzones=[],b.allli.each(function(a){var c=jQuery(this);b.rowzones[a]=[],c.find(".rev_row_zone").each(function(){b.rowzones[a].push(jQuery(this))}),"all"!=b.lazyType&&("smart"!=b.lazyType||0!=a&&1!=a&&a!=b.slideamount&&a!=b.slideamount-1)||(loadImages(c,b,a),waitForCurrentImages(c,b,function(){}))});var q=getUrlVars("#")[0];if(q.length<9&&q.split("slide").length>1){var r=parseInt(q.split("slide")[1],0);r<1&&(r=1),r>b.slideamount&&(r=b.slideamount),b.startWithSlide=r-1}a.append('<div class="tp-loader '+b.spinner+'"><div class="dot1"></div><div class="dot2"></div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'),b.loader=a.find(".tp-loader"),0===a.find(".tp-bannertimer").length&&a.append('<div class="tp-bannertimer" style="visibility:hidden"></div>'),a.find(".tp-bannertimer").css({width:"0%"}),b.ul.css({display:"block"}),prepareSlides(a,b),("off"!==b.parallax.type||b.scrolleffect.on)&&_R.checkForParallax&&_R.checkForParallax(a,b),_R.setSize(b),"hero"!==b.sliderType&&_R.createNavigation&&_R.createNavigation(a,b),_R.resizeThumbsTabs&&_R.resizeThumbsTabs&&_R.resizeThumbsTabs(b),contWidthManager(b);var s=b.viewPort;b.inviewport=!1,s!=undefined&&s.enable&&(jQuery.isNumeric(s.visible_area)||s.visible_area.indexOf("%")!==-1&&(s.visible_area=parseInt(s.visible_area)/100),_R.scrollTicker&&_R.scrollTicker(b,a)),"carousel"===b.sliderType&&_R.prepareCarousel&&(punchgs.TweenLite.set(b.ul,{opacity:0}),_R.prepareCarousel(b,new punchgs.TimelineLite,undefined,0),b.onlyPreparedSlide=!0),setTimeout(function(){if(!s.enable||s.enable&&b.inviewport||s.enable&&!b.inviewport&&"wait"==!s.outof)swapSlide(a);else if(b.c.addClass("tp-waitforfirststart"),b.waitForFirstSlide=!0,s.presize){var c=jQuery(b.li[0]);loadImages(c,b,0,!0),waitForCurrentImages(c.find(".tp-layers"),b,function(){_R.animateTheCaptions({slide:c,opt:b,preset:!0})})}_R.manageNavigation&&_R.manageNavigation(b),b.slideamount>1&&(!s.enable||s.enable&&b.inviewport?countDown(a,b):b.waitForCountDown=!0),setTimeout(function(){a.trigger("revolution.slide.onloaded")},100)},b.startDelay),b.startDelay=0,jQuery("body").data("rs-fullScreenMode",!1),window.addEventListener("fullscreenchange",onFullScreenChange,{passive:!0}),window.addEventListener("mozfullscreenchange",onFullScreenChange,{passive:!0}),window.addEventListener("webkitfullscreenchange",onFullScreenChange,{passive:!0});var t="resize.revslider-"+a.attr("id");jQuery(window).on(t,function(){if(a==undefined)return!1;0!=jQuery("body").find(a)&&contWidthManager(b);var c=!1;if("fullscreen"==b.sliderLayout){var d=jQuery(window).height();"mobile"==b.fallbacks.ignoreHeightChanges&&_ISM||"always"==b.fallbacks.ignoreHeightChanges?(b.fallbacks.ignoreHeightChangesSize=b.fallbacks.ignoreHeightChangesSize==undefined?0:b.fallbacks.ignoreHeightChangesSize,c=d!=b.lastwindowheight&&Math.abs(d-b.lastwindowheight)>b.fallbacks.ignoreHeightChangesSize):c=d!=b.lastwindowheight}(a.outerWidth(!0)!=b.width||a.is(":hidden")||c)&&(b.lastwindowheight=jQuery(window).height(),containerResized(a,b))}),hideSliderUnder(a,b),contWidthManager(b),b.fallbacks.disableFocusListener||"true"==b.fallbacks.disableFocusListener||b.fallbacks.disableFocusListener===!0||tabBlurringCheck(a,b)}},cArray=function(a,b){if(!jQuery.isArray(a)){var c=a;a=new Array,a.push(c)}if(a.length<b)for(var c=a[a.length-1],d=0;d<b-a.length+2;d++)a.push(c);return a},checkHoverDependencies=function(a,b){var c=a.data(),d="sliderenter"===c.start||c.frames!==undefined&&c.frames[0]!=undefined&&"sliderenter"===c.frames[0].delay;d&&(b.layersonhover===undefined&&(b.c.on("tp-mouseenter",function(){b.layersonhover&&jQuery.each(b.layersonhover,function(a,c){var d=c.data("closestli")||c.closest(".tp-revslider-slidesli"),e=c.data("staticli")||c.closest(".tp-static-layers");c.data("closestli")===undefined&&(c.data("closestli",d),c.data("staticli",e)),(d.length>0&&d.hasClass("active-revslide")||d.hasClass("processing-revslide")||e.length>0)&&(c.data("animdirection","in"),_R.playAnimationFrame&&_R.playAnimationFrame({caption:c,opt:b,frame:"frame_0",triggerdirection:"in",triggerframein:"frame_0",triggerframeout:"frame_999"}),c.data("triggerstate","on"))})}),b.c.on("tp-mouseleft",function(){b.layersonhover&&jQuery.each(b.layersonhover,function(a,c){c.data("animdirection","out"),c.data("triggered",!0),c.data("triggerstate","off"),_R.stopVideo&&_R.stopVideo(c,b),_R.playAnimationFrame&&_R.playAnimationFrame({caption:c,opt:b,frame:"frame_999",triggerdirection:"out",triggerframein:"frame_0",triggerframeout:"frame_999"})})}),b.layersonhover=new Array),b.layersonhover.push(a))},contWidthManager=function(a){var b=_R.getHorizontalOffset(a.c,"left");if("auto"==a.sliderLayout||"fullscreen"===a.sliderLayout&&"on"==a.fullScreenAutoWidth)"fullscreen"==a.sliderLayout&&"on"==a.fullScreenAutoWidth?punchgs.TweenLite.set(a.ul,{left:0,width:a.c.width()}):punchgs.TweenLite.set(a.ul,{left:b,width:a.c.width()-_R.getHorizontalOffset(a.c,"both")});else{var c=Math.ceil(a.c.closest(".forcefullwidth_wrapper_tp_banner").offset().left-b);punchgs.TweenLite.set(a.c.parent(),{left:0-c+"px",width:jQuery(window).width()-_R.getHorizontalOffset(a.c,"both")})}a.slayers&&"fullwidth"!=a.sliderLayout&&"fullscreen"!=a.sliderLayout&&punchgs.TweenLite.set(a.slayers,{left:b})},cv=function(a,b){return a===undefined?b:a},hideSliderUnder=function(a,b,c){var d=a.parent();jQuery(window).width()<b.hideSliderAtLimit?(a.trigger("stoptimer"),"none"!=d.css("display")&&d.data("olddisplay",d.css("display")),d.css({display:"none"})):a.is(":hidden")&&c&&(d.data("olddisplay")!=undefined&&"undefined"!=d.data("olddisplay")&&"none"!=d.data("olddisplay")?d.css({display:d.data("olddisplay")}):d.css({display:"block"}),a.trigger("restarttimer"),setTimeout(function(){containerResized(a,b)},150)),_R.hideUnHideNav&&_R.hideUnHideNav(b)},containerResized=function(a,b){if(a.trigger("revolution.slide.beforeredraw"),1==b.infullscreenmode&&(b.minHeight=jQuery(window).height()),setCurWinRange(b),setCurWinRange(b,!0),!_R.resizeThumbsTabs||_R.resizeThumbsTabs(b)===!0){if(hideSliderUnder(a,b,!0),contWidthManager(b),"carousel"==b.sliderType&&_R.prepareCarousel(b,!0),a===undefined)return!1;_R.setSize(b),b.conw=b.c.width(),b.conh=b.infullscreenmode?b.minHeight:b.c.height();var c=a.find(".active-revslide .slotholder"),d=a.find(".processing-revslide .slotholder");removeSlots(a,b,a,2),"standard"===b.sliderType&&(punchgs.TweenLite.set(d.find(".defaultimg"),{opacity:0}),c.find(".defaultimg").css({opacity:1})),"carousel"===b.sliderType&&b.lastconw!=b.conw&&(clearTimeout(b.pcartimer),b.pcartimer=setTimeout(function(){_R.prepareCarousel(b,!0),"carousel"==b.sliderType&&"on"===b.carousel.showLayersAllTime&&jQuery.each(b.li,function(a){_R.animateTheCaptions({slide:jQuery(b.li[a]),opt:b,recall:!0})})},100),b.lastconw=b.conw),_R.manageNavigation&&_R.manageNavigation(b),_R.animateTheCaptions&&a.find(".active-revslide").length>0&&_R.animateTheCaptions({slide:a.find(".active-revslide"),opt:b,recall:!0}),"on"==d.data("kenburns")&&_R.startKenBurn(d,b,d.data("kbtl").progress()),"on"==c.data("kenburns")&&_R.startKenBurn(c,b,c.data("kbtl").progress()),_R.animateTheCaptions&&a.find(".processing-revslide").length>0&&_R.animateTheCaptions({slide:a.find(".processing-revslide"),opt:b,recall:!0}),_R.manageNavigation&&_R.manageNavigation(b)}a.trigger("revolution.slide.afterdraw")},setScale=function(a){a.bw=a.width/a.gridwidth[a.curWinRange],a.bh=a.height/a.gridheight[a.curWinRange],a.bh>a.bw?a.bh=a.bw:a.bw=a.bh,(a.bh>1||a.bw>1)&&(a.bw=1,a.bh=1)},prepareSlides=function(a,b){if(a.find(".tp-caption").each(function(){var a=jQuery(this);a.data("transition")!==undefined&&a.addClass(a.data("transition"))}),b.ul.css({overflow:"hidden",width:"100%",height:"100%",maxHeight:a.parent().css("maxHeight")}),"on"==b.autoHeight&&(b.ul.css({overflow:"hidden",width:"100%",height:"100%",maxHeight:"none"}),a.css({maxHeight:"none"}),a.parent().css({maxHeight:"none"})),b.allli.each(function(a){var c=jQuery(this),d=c.data("originalindex");(b.startWithSlide!=undefined&&d==b.startWithSlide||b.startWithSlide===undefined&&0==a)&&c.addClass("next-revslide"),c.css({width:"100%",height:"100%",overflow:"hidden"})}),"carousel"===b.sliderType){b.ul.css({overflow:"visible"}).wrap('<div class="tp-carousel-wrapper" style="width:100%;height:100%;position:absolute;top:0px;left:0px;overflow:hidden;"></div>');var c='<div style="clear:both;display:block;width:100%;height:1px;position:relative;margin-bottom:-1px"></div>';b.c.parent().prepend(c),b.c.parent().append(c),_R.prepareCarousel(b)}a.parent().css({overflow:"visible"}),b.allli.find(">img").each(function(a){var c=jQuery(this),d=c.closest("li"),e=d.find(".rs-background-video-layer");e.addClass("defaultvid").css({zIndex:30}),c.addClass("defaultimg"),"on"==b.fallbacks.panZoomDisableOnMobile&&_ISM&&(c.data("kenburns","off"),c.data("bgfit","cover"));var f=d.data("mediafilter");f="none"===f||f===undefined?"":f,c.wrap('<div class="slotholder" style="position:absolute; top:0px; left:0px; z-index:0;width:100%;height:100%;"></div>'),e.appendTo(d.find(".slotholder"));var g=c.data();c.closest(".slotholder").data(g),e.length>0&&g.bgparallax!=undefined&&e.data("bgparallax",g.bgparallax),"none"!=b.dottedOverlay&&b.dottedOverlay!=undefined&&c.closest(".slotholder").append('<div class="tp-dottedoverlay '+b.dottedOverlay+'"></div>');var h=c.attr("src");g.src=h,g.bgfit=g.bgfit||"cover",g.bgrepeat=g.bgrepeat||"no-repeat",g.bgposition=g.bgposition||"center center";var i=c.closest(".slotholder");c.parent().append('<div class="tp-bgimg defaultimg '+f+'" style="background-color:'+c.css("backgroundColor")+";background-repeat:"+g.bgrepeat+";background-image:url("+h+");background-size:"+g.bgfit+";background-position:"+g.bgposition+';width:100%;height:100%;"></div>'),c.data("mediafilter",f);var j=document.createComment("Runtime Modification - Img tag is Still Available for SEO Goals in Source - "+c.get(0).outerHTML);c.replaceWith(j),c=i.find(".tp-bgimg"),c.data(g),c.attr("src",h),"standard"!==b.sliderType&&"undefined"!==b.sliderType||c.css({opacity:0})}),b.scrolleffect.on&&"on"===b.scrolleffect.on_slidebg&&(b.allslotholder=new Array,b.allli.find(".slotholder").each(function(){jQuery(this).wrap('<div style="display:block;position:absolute;top:0px;left:0px;width:100%;height:100%" class="slotholder_fadeoutwrap"></div>')}),b.allslotholder=b.c.find(".slotholder_fadeoutwrap"))},removeSlots=function(a,b,c,d){b.removePrepare=b.removePrepare+d,c.find(".slot, .slot-circle-wrapper").each(function(){jQuery(this).remove()}),b.transition=0,b.removePrepare=0},cutParams=function(a){var b=a;return a!=undefined&&a.length>0&&(b=a.split("?")[0]),b},relativeRedir=function(a){return location.pathname.replace(/(.*)\/[^\/]*/,"$1/"+a)},abstorel=function(a,b){var c=a.split("/"),d=b.split("/");c.pop();for(var e=0;e<d.length;e++)"."!=d[e]&&(".."==d[e]?c.pop():c.push(d[e]));return c.join("/")},imgLoaded=function(a,b,c){b.syncload--,b.loadqueue&&jQuery.each(b.loadqueue,function(b,d){var e=d.src.replace(/\.\.\/\.\.\//gi,""),f=self.location.href,g=document.location.origin,h=f.substring(0,f.length-1)+"/"+e,i=g+"/"+e,j=abstorel(self.location.href,d.src);f=f.substring(0,f.length-1)+e,g+=e,(cutParams(g)===cutParams(decodeURIComponent(a.src))||cutParams(f)===cutParams(decodeURIComponent(a.src))||cutParams(j)===cutParams(decodeURIComponent(a.src))||cutParams(i)===cutParams(decodeURIComponent(a.src))||cutParams(h)===cutParams(decodeURIComponent(a.src))||cutParams(d.src)===cutParams(decodeURIComponent(a.src))||cutParams(d.src).replace(/^.*\/\/[^\/]+/,"")===cutParams(decodeURIComponent(a.src)).replace(/^.*\/\/[^\/]+/,"")||"file://"===window.location.origin&&cutParams(a.src).match(new RegExp(e)))&&(d.progress=c,d.width=a.width,d.height=a.height)}),progressImageLoad(b)},progressImageLoad=function(a){3!=a.syncload&&a.loadqueue&&jQuery.each(a.loadqueue,function(b,c){if(c.progress.match(/prepared/g)&&a.syncload<=3){if(a.syncload++,"img"==c.type){var d=new Image;d.onload=function(){imgLoaded(this,a,"loaded"),c.error=!1},d.onerror=function(){imgLoaded(this,a,"failed"),c.error=!0},d.src=c.src}else jQuery.get(c.src,function(b){c.innerHTML=(new XMLSerializer).serializeToString(b.documentElement),c.progress="loaded",a.syncload--,progressImageLoad(a)}).fail(function(){c.progress="failed",a.syncload--,progressImageLoad(a)});c.progress="inload"}})},addToLoadQueue=function(a,b,c,d,e){var f=!1;if(b.loadqueue&&jQuery.each(b.loadqueue,function(b,c){c.src===a&&(f=!0)}),!f){var g=new Object;g.src=a,g.starttoload=jQuery.now(),g.type=d||"img",g.prio=c,g.progress="prepared",g.static=e,b.loadqueue.push(g)}},loadImages=function(a,b,c,d){a.find("img,.defaultimg, .tp-svg-layer").each(function(){var a=jQuery(this),e=a.data("lazyload")!==undefined&&"undefined"!==a.data("lazyload")?a.data("lazyload"):a.data("svg_src")!=undefined?a.data("svg_src"):a.attr("src"),f=a.data("svg_src")!=undefined?"svg":"img";a.data("start-to-load",jQuery.now()),addToLoadQueue(e,b,c,f,d)}),progressImageLoad(b)},getLoadObj=function(a,b){var c=new Object;return a.loadqueue&&jQuery.each(a.loadqueue,function(a,d){d.src==b&&(c=d)}),c},waitForCurrentImages=function(a,b,c){var d=!1;a.find("img,.defaultimg, .tp-svg-layer").each(function(){var c=jQuery(this),e=c.data("lazyload")!=undefined?c.data("lazyload"):c.data("svg_src")!=undefined?c.data("svg_src"):c.attr("src"),f=getLoadObj(b,e);if(c.data("loaded")===undefined&&f!==undefined&&f.progress&&f.progress.match(/loaded/g)){if(c.attr("src",f.src),"img"==f.type)if(c.hasClass("defaultimg"))_R.isIE(8)?defimg.attr("src",f.src):c.css({backgroundImage:'url("'+f.src+'")'}),a.data("owidth",f.width),a.data("oheight",f.height),a.find(".slotholder").data("owidth",f.width),a.find(".slotholder").data("oheight",f.height);else{var g=c.data("ww"),h=c.data("hh");c.data("owidth",f.width),c.data("oheight",f.height),g=g==undefined||"auto"==g||""==g?f.width:g,h=h==undefined||"auto"==h||""==h?f.height:h,!jQuery.isNumeric(g)&&g.indexOf("%")>0&&(h=g),c.data("ww",g),c.data("hh",h)}else"svg"==f.type&&"loaded"==f.progress&&(c.append('<div class="tp-svg-innercontainer"></div>'),c.find(".tp-svg-innercontainer").append(f.innerHTML));c.data("loaded",!0)}if(f&&f.progress&&f.progress.match(/inprogress|inload|prepared/g)&&(!f.error&&jQuery.now()-c.data("start-to-load")<5e3?d=!0:(f.progress="failed",f.reported_img||(f.reported_img=!0,console.warn(e+"  Could not be loaded !")))),1==b.youtubeapineeded&&(!window.YT||YT.Player==undefined)&&(d=!0,jQuery.now()-b.youtubestarttime>5e3&&1!=b.youtubewarning)){b.youtubewarning=!0;var i="YouTube Api Could not be loaded !";"https:"===location.protocol&&(i+=" Please Check and Renew SSL Certificate !"),console.error(i),b.c.append('<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>'+i+"</strong></div>")}if(1==b.vimeoapineeded&&!window.Froogaloop&&(d=!0,jQuery.now()-b.vimeostarttime>5e3&&1!=b.vimeowarning)){b.vimeowarning=!0;var i="Vimeo Froogaloop Api Could not be loaded !";"https:"===location.protocol&&(i+=" Please Check and Renew SSL Certificate !"),console.error(i),b.c.append('<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>'+i+"</strong></div>")}}),!_ISM&&b.audioqueue&&b.audioqueue.length>0&&jQuery.each(b.audioqueue,function(a,b){b.status&&"prepared"===b.status&&jQuery.now()-b.start<b.waittime&&(d=!0)}),jQuery.each(b.loadqueue,function(a,b){b.static!==!0||"loaded"==b.progress&&"failed"!==b.progress||("failed"==b.progress?b.reported||(b.reported=!0,console.warn("Static Image "+b.src+"  Could not be loaded in time. Error Exists:"+b.error)):!b.error&&jQuery.now()-b.starttoload<5e3?d=!0:b.reported||(b.reported=!0,console.warn("Static Image "+b.src+"  Could not be loaded within 5s! Error Exists:"+b.error)))}),d?punchgs.TweenLite.delayedCall(.18,waitForCurrentImages,[a,b,c]):punchgs.TweenLite.delayedCall(.18,c)},swapSlide=function(a){var b=a[0].opt;if(clearTimeout(b.waitWithSwapSlide),a.find(".processing-revslide").length>0)return b.waitWithSwapSlide=setTimeout(function(){swapSlide(a)},150),!1;var c=a.find(".active-revslide"),d=a.find(".next-revslide"),e=d.find(".defaultimg");return"carousel"!==b.sliderType||b.carousel.fadein||(punchgs.TweenLite.to(b.ul,1,{opacity:1}),b.carousel.fadein=!0),d.index()===c.index()&&b.onlyPreparedSlide!==!0?(d.removeClass("next-revslide"),!1):(b.onlyPreparedSlide===!0&&(b.onlyPreparedSlide=!1,jQuery(b.li[0]).addClass("processing-revslide")),d.removeClass("next-revslide").addClass("processing-revslide"),d.index()===-1&&"carousel"===b.sliderType&&(d=jQuery(b.li[0])),d.data("slide_on_focus_amount",d.data("slide_on_focus_amount")+1||1),"on"==b.stopLoop&&d.index()==b.lastslidetoshow-1&&(a.find(".tp-bannertimer").css({visibility:"hidden"}),a.trigger("revolution.slide.onstop"),b.noloopanymore=1),d.index()===b.slideamount-1&&(b.looptogo=b.looptogo-1,b.looptogo<=0&&(b.stopLoop="on")),b.tonpause=!0,a.trigger("stoptimer"),b.cd=0,"off"===b.spinner&&(b.loader!==undefined?b.loader.css({display:"none"}):b.loadertimer=setTimeout(function(){b.loader!==undefined&&b.loader.css({display:"block"})},50)),loadImages(d,b,1),_R.preLoadAudio&&_R.preLoadAudio(d,b,1),void waitForCurrentImages(d,b,function(){d.find(".rs-background-video-layer").each(function(){var a=jQuery(this);a.hasClass("HasListener")||(a.data("bgvideo",1),_R.manageVideoLayer&&_R.manageVideoLayer(a,b)),0==a.find(".rs-fullvideo-cover").length&&a.append('<div class="rs-fullvideo-cover"></div>')}),swapSlideProgress(e,a)}))},swapSlideProgress=function(a,b){var c=b.find(".active-revslide"),d=b.find(".processing-revslide"),e=c.find(".slotholder"),f=d.find(".slotholder"),g=b[0].opt;g.tonpause=!1,g.cd=0,clearTimeout(g.loadertimer),g.loader!==undefined&&g.loader.css({display:"none"}),_R.setSize(g),_R.slotSize(a,g),_R.manageNavigation&&_R.manageNavigation(g);var h={};h.nextslide=d,h.currentslide=c,b.trigger("revolution.slide.onbeforeswap",h),g.transition=1,g.videoplaying=!1,d.data("delay")!=undefined?(g.cd=0,g.delay=d.data("delay")):g.delay=g.origcd,"true"==d.data("ssop")||d.data("ssop")===!0?g.ssop=!0:g.ssop=!1,b.trigger("nulltimer");var i=c.index(),j=d.index();g.sdir=j<i?1:0,"arrow"==g.sc_indicator&&(0==i&&j==g.slideamount-1&&(g.sdir=1),i==g.slideamount-1&&0==j&&(g.sdir=0)),g.lsdir=g.lsdir===undefined?g.sdir:g.lsdir,g.dirc=g.lsdir!=g.sdir,g.lsdir=g.sdir,c.index()!=d.index()&&1!=g.firststart&&_R.removeTheCaptions&&_R.removeTheCaptions(c,g),d.hasClass("rs-pause-timer-once")||d.hasClass("rs-pause-timer-always")?g.videoplaying=!0:b.trigger("restarttimer"),d.removeClass("rs-pause-timer-once");var k,m;if(g.currentSlide=c.index(),g.nextSlide=d.index(),"carousel"==g.sliderType)m=new punchgs.TimelineLite,_R.prepareCarousel(g,m),letItFree(b,f,e,d,c,m),g.transition=0,g.firststart=0;else{m=new punchgs.TimelineLite({onComplete:function(){letItFree(b,f,e,d,c,m)}}),m.add(punchgs.TweenLite.set(f.find(".defaultimg"),{opacity:0})),m.pause(),_R.animateTheCaptions&&_R.animateTheCaptions({slide:d,opt:g,preset:!0}),1==g.firststart&&(punchgs.TweenLite.set(c,{autoAlpha:0}),g.firststart=0),punchgs.TweenLite.set(c,{zIndex:18}),punchgs.TweenLite.set(d,{autoAlpha:0,zIndex:20}),"prepared"==d.data("differentissplayed")&&(d.data("differentissplayed","done"),d.data("transition",d.data("savedtransition")),d.data("slotamount",d.data("savedslotamount")),d.data("masterspeed",d.data("savedmasterspeed"))),d.data("fstransition")!=undefined&&"done"!=d.data("differentissplayed")&&(d.data("savedtransition",d.data("transition")),d.data("savedslotamount",d.data("slotamount")),d.data("savedmasterspeed",d.data("masterspeed")),d.data("transition",d.data("fstransition")),d.data("slotamount",d.data("fsslotamount")),d.data("masterspeed",d.data("fsmasterspeed")),d.data("differentissplayed","prepared")),d.data("transition")==undefined&&d.data("transition","random"),k=0;var n=d.data("transition")!==undefined?d.data("transition").split(","):"fade",o=d.data("nexttransid")==undefined?-1:d.data("nexttransid");"on"==d.data("randomtransition")?o=Math.round(Math.random()*n.length):o+=1,o==n.length&&(o=0),d.data("nexttransid",o);var p=n[o];g.ie&&("boxfade"==p&&(p="boxslide"),"slotfade-vertical"==p&&(p="slotzoom-vertical"),"slotfade-horizontal"==p&&(p="slotzoom-horizontal")),_R.isIE(8)&&(p=11),m=_R.animateSlide(k,p,b,d,c,f,e,m),"on"==f.data("kenburns")&&(_R.startKenBurn(f,g),m.add(punchgs.TweenLite.set(f,{autoAlpha:0}))),m.pause()}_R.scrollHandling&&(_R.scrollHandling(g,!0),m.eventCallback("onUpdate",function(){_R.scrollHandling(g,!0)})),"off"!=g.parallax.type&&g.parallax.firstgo==undefined&&_R.scrollHandling&&(g.parallax.firstgo=!0,g.lastscrolltop=-999,_R.scrollHandling(g,!0),setTimeout(function(){g.lastscrolltop=-999,_R.scrollHandling(g,!0)},210),setTimeout(function(){g.lastscrolltop=-999,_R.scrollHandling(g,!0)},420)),_R.animateTheCaptions?"carousel"===g.sliderType&&"on"===g.carousel.showLayersAllTime?(jQuery.each(g.li,function(a){g.carousel.allLayersStarted?_R.animateTheCaptions({slide:jQuery(g.li[a]),opt:g,recall:!0}):g.li[a]===d?_R.animateTheCaptions({slide:jQuery(g.li[a]),maintimeline:m,opt:g,startslideanimat:0}):_R.animateTheCaptions({slide:jQuery(g.li[a]),opt:g,startslideanimat:0})}),g.carousel.allLayersStarted=!0):_R.animateTheCaptions({slide:d,opt:g,maintimeline:m,startslideanimat:0}):m!=undefined&&setTimeout(function(){m.resume()},30),punchgs.TweenLite.to(d,.001,{autoAlpha:1})},letItFree=function(a,b,c,d,e,f){var g=a[0].opt;"carousel"===g.sliderType||(g.removePrepare=0,punchgs.TweenLite.to(b.find(".defaultimg"),.001,{zIndex:20,autoAlpha:1,onComplete:function(){removeSlots(a,g,d,1)}}),d.index()!=e.index()&&punchgs.TweenLite.to(e,.2,{zIndex:18,autoAlpha:0,onComplete:function(){removeSlots(a,g,e,1)}})),a.find(".active-revslide").removeClass("active-revslide"),a.find(".processing-revslide").removeClass("processing-revslide").addClass("active-revslide"),g.act=d.index(),g.c.attr("data-slideactive",a.find(".active-revslide").data("index")),"scroll"!=g.parallax.type&&"scroll+mouse"!=g.parallax.type&&"mouse+scroll"!=g.parallax.type||(g.lastscrolltop=-999,_R.scrollHandling(g)),f.clear(),c.data("kbtl")!=undefined&&(c.data("kbtl").reverse(),c.data("kbtl").timeScale(25)),"on"==b.data("kenburns")&&(b.data("kbtl")!=undefined?(b.data("kbtl").timeScale(1),b.data("kbtl").play()):_R.startKenBurn(b,g)),d.find(".rs-background-video-layer").each(function(a){if(_ISM)return!1;var b=jQuery(this);_R.resetVideo(b,g),punchgs.TweenLite.fromTo(b,1,{autoAlpha:0},{autoAlpha:1,ease:punchgs.Power3.easeInOut,delay:.2,onComplete:function(){_R.animcompleted&&_R.animcompleted(b,g)}})}),e.find(".rs-background-video-layer").each(function(a){if(_ISM)return!1;var b=jQuery(this);_R.stopVideo&&(_R.resetVideo(b,g),_R.stopVideo(b,g)),punchgs.TweenLite.to(b,1,{autoAlpha:0,ease:punchgs.Power3.easeInOut,delay:.2})});var h={};h.slideIndex=d.index()+1,h.slideLIIndex=d.index(),h.slide=d,h.currentslide=d,h.prevslide=e,g.last_shown_slide=e.index(),a.trigger("revolution.slide.onchange",h),a.trigger("revolution.slide.onafterswap",h),g.duringslidechange=!1;var i=e.data("slide_on_focus_amount"),j=e.data("hideafterloop");0!=j&&j<=i&&g.c.revremoveslide(e.index());var k=g.nextSlide===-1||g.nextSlide===undefined?0:g.nextSlide;k=k>g.rowzones.length?g.rowzones.length:k,g.rowzones!=undefined&&g.rowzones.length>0&&g.rowzones[k]!=undefined&&k>=0&&k<=g.rowzones.length&&g.rowzones[k].length>0&&_R.setSize(g)},removeAllListeners=function(a,b){a.children().each(function(){try{jQuery(this).die("click")}catch(a){}try{jQuery(this).die("mouseenter")}catch(a){}try{jQuery(this).die("mouseleave")}catch(a){}try{jQuery(this).unbind("hover")}catch(a){}});try{a.die("click","mouseenter","mouseleave")}catch(a){}clearInterval(b.cdint),a=null},countDown=function(a,b){b.cd=0,b.loop=0,b.stopAfterLoops!=undefined&&b.stopAfterLoops>-1?b.looptogo=b.stopAfterLoops:b.looptogo=9999999,b.stopAtSlide!=undefined&&b.stopAtSlide>-1?b.lastslidetoshow=b.stopAtSlide:b.lastslidetoshow=999,b.stopLoop="off",0==b.looptogo&&(b.stopLoop="on");var c=a.find(".tp-bannertimer");a.on("stoptimer",function(){var a=jQuery(this).find(".tp-bannertimer");a[0].tween.pause(),"on"==b.disableProgressBar&&a.css({visibility:"hidden"}),b.sliderstatus="paused",_R.unToggleState(b.slidertoggledby)}),a.on("starttimer",function(){b.forcepause_viatoggle||(1!=b.conthover&&1!=b.videoplaying&&b.width>b.hideSliderAtLimit&&1!=b.tonpause&&1!=b.overnav&&1!=b.ssop&&(1===b.noloopanymore||b.viewPort.enable&&!b.inviewport||(c.css({visibility:"visible"}),c[0].tween.resume(),b.sliderstatus="playing")),"on"==b.disableProgressBar&&c.css({visibility:"hidden"}),_R.toggleState(b.slidertoggledby))}),a.on("restarttimer",function(){if(!b.forcepause_viatoggle){var a=jQuery(this).find(".tp-bannertimer");if(b.mouseoncontainer&&"on"==b.navigation.onHoverStop&&!_ISM)return!1;1===b.noloopanymore||b.viewPort.enable&&!b.inviewport||1==b.ssop||(a.css({visibility:"visible"}),a[0].tween.kill(),a[0].tween=punchgs.TweenLite.fromTo(a,b.delay/1e3,{width:"0%"},{force3D:"auto",width:"100%",ease:punchgs.Linear.easeNone,onComplete:d,delay:1}),b.sliderstatus="playing"),"on"==b.disableProgressBar&&a.css({visibility:"hidden"}),_R.toggleState(b.slidertoggledby)}}),a.on("nulltimer",function(){c[0].tween.kill(),c[0].tween=punchgs.TweenLite.fromTo(c,b.delay/1e3,{width:"0%"},{force3D:"auto",width:"100%",ease:punchgs.Linear.easeNone,onComplete:d,delay:1}),c[0].tween.pause(0),"on"==b.disableProgressBar&&c.css({visibility:"hidden"}),b.sliderstatus="paused"});var d=function(){0==jQuery("body").find(a).length&&(removeAllListeners(a,b),clearInterval(b.cdint)),a.trigger("revolution.slide.slideatend"),1==a.data("conthover-changed")&&(b.conthover=a.data("conthover"),a.data("conthover-changed",0)),_R.callingNewSlide(a,1)};c[0].tween=punchgs.TweenLite.fromTo(c,b.delay/1e3,{width:"0%"},{force3D:"auto",width:"100%",ease:punchgs.Linear.easeNone,onComplete:d,delay:1}),b.slideamount>1&&(0!=b.stopAfterLoops||1!=b.stopAtSlide)?a.trigger("starttimer"):(b.noloopanymore=1,a.trigger("nulltimer")),a.on("tp-mouseenter",function(){b.mouseoncontainer=!0,"on"!=b.navigation.onHoverStop||_ISM||(a.trigger("stoptimer"),a.trigger("revolution.slide.onpause"))}),a.on("tp-mouseleft",function(){b.mouseoncontainer=!1,1!=a.data("conthover")&&"on"==b.navigation.onHoverStop&&(1==b.viewPort.enable&&b.inviewport||0==b.viewPort.enable)&&(a.trigger("revolution.slide.onresume"),a.trigger("starttimer"))})},vis=function(){var a,b,c={hidden:"visibilitychange",webkitHidden:"webkitvisibilitychange",mozHidden:"mozvisibilitychange",msHidden:"msvisibilitychange"};for(a in c)if(a in document){b=c[a];break}return function(c){return c&&document.addEventListener(b,c,{pasive:!0}),!document[a]}}(),restartOnFocus=function(a){return a!=undefined&&a.c!=undefined&&void(1!=a.windowfocused&&(a.windowfocused=!0,punchgs.TweenLite.delayedCall(.3,function(){"on"==a.fallbacks.nextSlideOnWindowFocus&&a.c.revnext(),a.c.revredraw(),"playing"==a.lastsliderstatus&&a.c.revresume()})))},lastStatBlur=function(a){a.windowfocused=!1,a.lastsliderstatus=a.sliderstatus,a.c.revpause();var b=a.c.find(".active-revslide .slotholder"),c=a.c.find(".processing-revslide .slotholder");"on"==c.data("kenburns")&&_R.stopKenBurn(c,a),"on"==b.data("kenburns")&&_R.stopKenBurn(b,a)},tabBlurringCheck=function(a,b){var c=document.documentMode===undefined,d=window.chrome;c&&!d?jQuery(window).on("focusin",function(){restartOnFocus(b)}).on("focusout",function(){lastStatBlur(b)}):window.addEventListener?(window.addEventListener("focus",function(a){restartOnFocus(b)},{capture:!1,passive:!0}),window.addEventListener("blur",function(a){lastStatBlur(b)},{capture:!1,passive:!0})):(window.attachEvent("focus",function(a){restartOnFocus(b)}),window.attachEvent("blur",function(a){lastStatBlur(b)}))},getUrlVars=function(a){for(var c,b=[],d=window.location.href.slice(window.location.href.indexOf(a)+1).split("_"),e=0;e<d.length;e++)d[e]=d[e].replace("%3D","="),c=d[e].split("="),b.push(c[0]),b[c[0]]=c[1];return b}}(jQuery);