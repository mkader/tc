
/* input Tips */
(function($) {

   // input tips
   $.fn.inputTips = function(tip){
        this.each(function(){
             $(this).jqmData("tips",tip);
             $(this).unbind("focusin");
             $(this).unbind("focusout");
             $(this).bind("focusin",function(){
                var value = $.trim($(this).val());
                if(value == "" || value == tip){
                    $(this).removeClass("tipIt").val("");
                }
             });
             $(this).bind("focusout",function(){
                var value = $.trim($(this).val());
                 if(value == "" || value == tip){
                    $(this).addClass("tipIt").val(tip);
                 }
             });
            $(this).trigger("focusout");
        })
   }
})(jQuery)



$(document).bind( "mobileinit", function() {
    $.extend(  $.mobile , {
        ajaxEnabled: false
    });  
    
	
	
    $(document).live( 'pageinit',function(event){

        /* login */
        $(".login-box .remember,.checkbox").bind("vclick",function(event){
            $(this).toggleClass("selected");
             
        })
        $(".login-box input.username").inputTips("Username");
        $(".login-box input.answer").inputTips("Type your answer");
        $(".login-box input.email").inputTips("name@company.com");
		
        $(".login-box a.login").click(function(){
            var box = $(this).parents(".login-box");
            var username = box.find("input[type='text']");
            if(username.val() == "" || username.val() == username.jqmData("tips") || username.val() == "invalid"){
                box.find(".error").css("visibility","visible");
				box.find(".error").removeClass("errorInitial");
				box.find(".error").html("Invalid Username / Password");
                return false;
            }
        });
        $(".login-box a.submit-answer").click(function(){
            var box = $(this).parents(".login-box");
            var answer = box.find("input[type='text']");
            if(answer.val() == "" || answer.val() == answer.jqmData("tips") || answer.val() == "invalid"){
				box.find(".error").css("color","#eb0e0e");
				box.find(".error").html("Invalid answer, Try again");
                box.find(".error").css("visibility","visible");
                return false;
            }
			
			box.find(".error").css("color","#69F");
			box.find(".error").html("Password sent");
			box.find(".error").css("visibility","visible");
			
			
			window.location.href='./login-password-send.html';
			
        });
		
		
		
		$(".login-box a.submit-createUser").click(function(){
            var box = $(this).parents(".login-box");
            var username = box.find("input[type='text']");
			var password1 = box.find("input[type='password']")[0];
            console.log(password1.value);
			if(username.val() == "" || username.val() == username.jqmData("tips") || username.val() == "invalid"||password1.value==""){
                box.find(".error").css("visibility","visible");
                return false;
            }
			
        });
		
		$(".login-box a.submit-updatePassword").click(function(){
            var box = $(this).parents(".login-box");
			var password0 = box.find("input[type='password']")[0];
			var password1 = box.find("input[type='password']")[1];
			var password2 = box.find("input[type='password']")[2];
			console.log(password0.value);
            console.log(password1.value);
			console.log(password2.value);
			if(password0==""||password1.value==""||password2.value==""||password1.value!=password2.value){
                box.find(".error").css("visibility","visible");
                return false;
            }
			
        });
		
		
		$(".radioItem").click(function(){
			$(".radioItem").each(function(index, element) {
                $(".radioItem").removeClass('active');
            });
			
			$(this).addClass('active');
		});
		
		
		
		var showAdd; //1 show add, 2 show delete
		function modelShow(show){
			if(show){
				$('.modelBG').css('display','block');
				if(showAdd == 1){
				$('.model').css('display','block');
				
				var modelWidth = $('.model').width();
				var modelHeight = $('model').height();
				var parentWidth = $('.modelBG').width();
				var parentHeight = $('.modelBG').height();
				var left = (parentWidth/2) - (modelWidth/2);
				var top = (parentHeight- modelHeight)/8;
				
				$('.model').css('left',left);
				$('.model').css('top',top);
				}
				else {
					$('.deleteModel').css('display','block');
					
				}
			}
			else {
				$('.modelBG').css('display','none');
				$('.model').css('display','none');
				$('.deleteModel').css('display','none');
			}
		}
		
		$('.deleteDevice').click(function (){
			showAdd = 2;
			modelShow(true);
		});
		
		
				
				//1, mouse down, 2, mouse up
				$(".slideSimulate").mousedown(function(e){
					
					$(".slideHandle").css('margin-left',e.offsetX);
            		setTimeout(function(){ 
						$(".slideSimulate").css('display','none');
                		thePopup.hide();     
            		},1000);
				})
				
				
		
		
		$('.trigerSlicer').click(function(){
			
			$(".adjustProperty").html('');
			if($(this).hasClass("brightness") || $(this).hasClass("constrast") || $(this).hasClass("saturation") || $(this).hasClass("hue")){
				
				$(".slideSimulate").css('display','block');
				/*
				if($(this).hasClass("brightness")) {
					$(".adjustProperty").html('Adjust Brightness');
				}
				if($(this).hasClass("constrast")) {
					$(".adjustProperty").html('Adjust Constrast');
				}
				if($(this).hasClass("saturation")) {
					$(".adjustProperty").html('Adjust Saturation');
				}
				if($(this).hasClass("hue")) {
					$(".adjustProperty").html('Adjust Hue');
				}*/
				
				//$(".myslider").css("display","none");
				//$(".myswitch").css("display","none"); 
				//$(".myslider").css("display","block");
				
			}
			 else {
				 showAdd = 2;
				modelShow(true);
				if($(this).hasClass("mute")) {
					$(".adjustProperty").html('Mute?');
				}
				if($(this).hasClass("ptz-enable")) {
					$(".adjustProperty").html('PTZ-Enable?');
				}
				 
				 $(".myslider").css("display","none");
				 $(".myswitch").css("display","none"); 
			 	$(".myswitch").css("display","block"); 
			 }
		});
		
		$('.okPopUp').click(function(){
			modelShow(false);
		});
		
		
		$('.cancelPopUp').click(function(){
			modelShow(false);
		});
		/*$("#addDeviceButton").click(
			function() {
				console.log("haha");
				$(this).simpledialog({
					'mode':'blank',
					'prompt':false,
					'forceInput':false,
					'userModal':true,
					'fullHTML':
						"<div class='popUpWrapper'><ul data-role='listview'><li><div class='addDeviceList'><span class='Title'>Add Device:</span> <input type='text' class='addDevicePopup hidden'></input></div></li><li><div class='addDeviceList'><span>Device Name:</span> <input type='text' class='addDevicePopup'></input></div></li><li><div class='addDeviceList'><span>Device Type: </span><input type='text'  class='addDevicePopup' ></input></div></li><li><div class='addDeviceList'><span>IP Address: </span><input type='text'  class='addDevicePopup'></input><span class='theSpecial'>Port:</span> <input type='text'  class='addDevicePopup'></input></div></li><li><div class='addDeviceList'><span>Username:</span> <input type='text'  class='addDevicePopup'></input></div></li><li><div class='addDeviceList'><span>Password:</span> <input type='text'  class='addDevicePopup' ></input></div></li><li><div class='addDeviceList'><span>Channel:</span> <input type='radio' class='radioStyle' name='group1'></input><span class='radioLabel'>MainStream</span></div></li><li><div class='addDeviceList'><span></span> <input type='radio' name='group1' class='radioStyle'></input><span class='radioLabelSub'>Substream</span></div></li><li><div class='subpopUpWrapper'><a rel='close' data-role='button' href='device-list.html' class='closeButton'>OK</a><a rel='close' data-role='button' href='device-list.html' class='closeButton'>Cancel</a></div></li></ul></div>"
				})
			}
			
		);*/
		
		
			
		/*$('.deleteDevice').click( 
			function() {
				console.log("haha");
				$(this).simpledialog({
					'mode':'blank',
					'prompt':false,
					'forceInput':false,
					'userModal':true,
					'fullHTML':
						"<div class='confirmPopUp'><div class='confirmTitle'>Are you sure ?</div><a rel='close' data-role='button' href='device-list.html' class='closeButton'>OK</a><a rel='close' data-role='button' href='device-list.html' class='closeButton'>Cancel</a></div>"
				})
			}
		);*./
			/*$(this).simpledialog({
				'mode':'blank',
				'prompt':false,
				'forceInput':false,
				'userModal':true,
				'fullHTML':
					"<a data-role='button' href='device-list.html' id='simpleclose'>OK</a><a data-role='button' href='device-list.html' id='simpleclose'>Cancel</a>"
			})
		);*/


        $(".camera-list .ui-listview span.star").live("vclick",function(){
            $(this).toggleClass("highlight");
        })

        /* popups */
         $(document).bind("vclick",function(event){
             var target = $(event.target);
             if(!target.hasClass("popup-trigger") && target.parents(".popup-trigger").length == 0 && target.parents(".popup").length == 0){
                $(".popup").hide();
            }
        });
        $(" .popup-trigger").bind(" vclick",function(){

            var popup =$($(this).attr("data-popup"));
            if(popup.is(":hidden")){
                $(".popup").hide();
                popup.show();
            }else{
                popup.hide();
            }
        })

        $("#beaker-popup a.checkbox").bind('vclick',function(){ 
            if($(this).hasClass("selected")){
                $(this).parents(".popup").find("a.selected").removeClass("selected");
                $(this).addClass("selected");
            }
        })
		
		var thePopup;
		
        $("#action-popup a.ui-link,#beaker-popup a.ui-link,#setting-popup p a,#movie-popup img,#ptz-popup a.minus,#ptz-popup a.plus,#ptz-popup .actions a.ui-btn").bind("vclick",function(event){
            var popup = $(this).parents(".popup");
			
			if($(this).hasClass("brightness") || $(this).hasClass("constrast") || $(this).hasClass("saturation") || $(this).hasClass("hue")){
				thePopup = popup;
				return;
			}
			
			
			
            setTimeout(function(){ 
                popup.hide();     
            },500);
        }) 
		
		
		$(".panImageLeft, .panImageDown, .panImageRight, .panImageUp").bind('vclick', function(event){
			var popup = $(this).parents(".popup");
            setTimeout(function(){ 
                popup.hide();     
            },500);
		});

    });


     function initSlider(){

        $('.carousel').each(function(){
            if($(this).is(":visible") && !$(this).jqmData("slider")){
                var slider = $(this).bxSlider({
                    controls:false,
                    pager: true
                });
                $(this).jqmData("slider",slider);

                if($(this).parents(".multi-view-page").length==0){
                    $(this).swiperight(function(){
                        slider.goToPreviousSlide();
                    });
    
                   $(this).swipeleft(function(){
                        slider.goToNextSlide();
                    })
                }else{ 
                    var timeout;
                    $(this).bind("vmousedown",function(event){
                        $(this).jqmData("startX",event.pageX);
                        var now = new Date().getTime();
                        $(this).jqmData("mousedown",now);
                        var mouseup = $(this).jqmData("mouseup");
                        if(now-mouseup<200){
                            $(this).jqmData("dmousedown",now);
                        }
                    })
                    $(this).bind("vmouseup",function(event){
                        var startX =  $(this).jqmData("startX");
                        var endX = event.pageX;
                        if(startX-endX>30){
                            slider.goToNextSlide();
                        }else if(endX-startX>30){
                            slider.goToPreviousSlide();
                        }else{
                            var now = new Date().getTime();
                            $(this).jqmData("mouseup",now);
                            if(event.target.nodeName.toUpperCase() == "IMG"){
                                if($(this).jqmData("dmousedown")){
                                    clearTimeout(timeout);
                                    $(this).jqmData("mousedown",0);
                                    $(this).jqmData("dmousedown",0);
                                    $(this).jqmData("mouseup",0); 
                                    $.mobile.changePage("video-single-view.html");
                                }else{
                                    timeout = setTimeout(function(){
                                        $(this).jqmData("mousedown",0);
                                        $(this).jqmData("dmousedown",0);
                                       $(this).jqmData("mouseup",0);
                                         $.mobile.changePage("device-list.html");
                                    },500);
                                }
                            }
                        }
                    })
                }
            }
        })
     }

    $(window).bind("orientationchange",function(){
       initSlider();
    })
     $(document).bind( "pageshow",function(){

        $(document).bind("dragstart", function() {
             return false;
        });
         initSlider();

     })

})