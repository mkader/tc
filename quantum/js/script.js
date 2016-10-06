var browserAgent = navigator.userAgent.toLowerCase();

//check ipad
if(typeof(AC) === "undefined"){
	AC={}
	AC.Detector={
		getAgent:function(){
			return navigator.userAgent.toLowerCase();
		},
		isiPad:function(c){
			var d = c||this.getAgent();
			return d.match(/ipad/i);
		},
		isiPhone:function(c){
			var d = c||this.getAgent();
			return d.match(/iphone os/i);
		}
	}
}

// set viewport for Ratio screen
var getDevicePixelRatio = function() {
	if (window.devicePixelRatio == undefined) return 1;
	return window.devicePixelRatio;
}
var vp = document.getElementById("vp");
var vp_width = "width=device-width, ";
var vp_user_scalable = "user-scalable=no, ";
var scale = (getDevicePixelRatio() == 2 && !AC.Detector.isiPad(browserAgent))? "0.5" : "1.0";
var vp_initial_scale = "initial-scale="+scale+", ";
var vp_minimum_scale = "minimum-scale="+scale+", ";
var vp_maximum_scale = "maximum-scale="+scale;
vp.attributes.content.value = vp_width + vp_user_scalable + vp_initial_scale + vp_minimum_scale + vp_maximum_scale;

var timerProgress = 3000; //progress animate timmer

//mobile init
$(document).bind( "mobileinit", function() {
	
	//set default config
	$.mobile.defaultPageTransition = 'slide';
	var activePage = $.mobile.activePageClass;	
	
	$(document).delegate('[data-role="page"]', 'pagebeforecreate', function () {
		if(AC.Detector.isiPhone(browserAgent)){
			$('.btnIpadPage').attr('href','#pageInfo');
		}	
	});
	
	
	//pageLogin
	$('#pageLogin').live('pageshow',function(){
//		$(document).delegate('#btnSignInAndAcceptTerms', 'vclick', function() {
//			if($('#pageLogin #username').val().length == 0 && $('#pageLogin #password').val().length == 0 ){
//				var $dialog = $('<div class="ui-simpledialog-container pop" ><h2>Login Failed</h2><p>Incorretct Login ID/ Password combination</p><a rel="close" data-role="button" href="#" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="btnDialogCancel ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">OK</span></span></a></div>');
//				$('#pageLogin').append($dialog);
//				$('#pageLogin').append($('<div class="ui-simpledialog-screen"></div>'));
//				$('#pageLogin .ui-simpledialog-container').addClass('in');
//				positionModal($dialog);
//				return false;
//			}
//		});
        $(document).delegate('#pageLogin label', 'vclick', function() {
            $(this).hide();
            $(this).next('input').focus();
            return false;
        });
        $(document).delegate('#pageLogin :text,#pageLogin :password', 'focus', function() {
            $(this).prev('label').hide();
        });
        $(document).delegate('#pageLogin :text,#pageLogin :password', 'blur', function() {
            if($.trim($(this).val()).length==0){
                $(this).prev('label').show();
            }
        });
		$(document).delegate('#pageLogin :text,#pageLogin :password', 'keyup', function() {
			if($.trim($(this).val()).length>0){
				$(this).siblings('.btnClear').show();
			}else{
				$(this).siblings('.btnClear').hide();
			}
		});
		$(document).delegate('#pageLogin .btnClear', 'vclick', function() {
			$(this).hide();
			$(this).siblings(':text,:password').val('');
            $(this).parent().find('label').show();
			return false;
		});
		$(document).delegate('#pageLogin .btnDialogCancel', 'vclick', function() {
			$('.ui-simpledialog-container, .ui-simpledialog-screen').remove();
			return false;
		});
	});
	
	//pageCloud
	$('#pageCloud').live('pagebeforeshow',function(){
		if(!$('#pageCloud .pullList').data('generatNumber')){
			var html = cloudDataFill(cloudJson).join(' ');
			$('#pageCloud .pullList').empty();
			$('#pageCloud .pullList').append(html);
		}
		
	});
	
	//pageDevice
	$('#pageDevice').live('pagebeforeshow',function(){
		var html,htmlArray = new Array();
		if(!$('#pageDevice .pullList').data('dataFilled')){
			$('#pageDevice .pullList').empty();
			for(var i in deviceJson.jsonData){
				html = deciveDataFill(deviceJson.jsonData[i]).join(' ');
				htmlArray.push(html);
			}
			$('#pageDevice .pullList').append(htmlArray.join(' '));
			$('#pageDevice .pullList').data('dataFilled',true);
		}
		
		if(AC.Detector.isiPad(browserAgent) && !AC.Detector.isiPhone(browserAgent)){
			$('#pageDevice .filterBar ul a').removeClass('current');
			$('#pageDevice .filterBar ul a:eq(1)').addClass('current');
			$('#pageDevice .filterBar ul a').live('vclick',function(){
				$('#pageDevice .filterBar ul a').removeClass('current');
				$(this).addClass('current');
				var deviceName = $(this).attr('data-json-name');
				var tmp,tmpArray = new Array();
				if(deviceName.length>0){
					if(deviceName == 'all'){
						$('#pageDevice .pullList').empty();
						for(var i in deviceJson.jsonData){
							tmp = "";
							tmp = deciveDataFill(deviceJson.jsonData[i]).join(' ');
							tmpArray.push(tmp);
						}
					}else{
						$('#pageDevice .pullList').empty();
						for(var i in deviceJson.jsonData){
							if(deviceJson.jsonData[i].itemName == deviceName){
								tmp = "";
								tmp = deciveDataFill(deviceJson.jsonData[i]).join(' ');
								tmpArray.push(tmp);
							}
						}
					}
					$('#pageDevice .pullList').append(tmpArray.join(' '));
					$('#pageDevice [data-iscroll="scroller"]').data("iscroll-plugin").refresh();
				}
				return false;
			});
		}
		
		$('#pageDevice').delegate('.pullList li', 'taphold', function() {
			$(this).find('.videoRemoveModal').show();
		});
		
		$('#pageDevice').delegate('.pullList li', 'swipeleft swiperight', function() {
			if($('#pageDevice [data-role="content"]').hasClass('list')){
				$(this).find('.videoRemoveModal').show();
			}
		});
		
		$('#pageDevice').delegate('.pullList li .videoRemoveModal .btnConfirm', 'tap', function() {
			var $row = $(this).closest('li');
			$row.hide(10,function(){
				$row.remove();
				$('#pageDevice [data-iscroll="scroller"]').data("iscroll-plugin").refresh();
			});
			return false;
		});
		
		$('#pageDevice').delegate('.pullList li .videoRemoveModal .btnCancel', 'tap', function() {
			$(this).parent('.videoRemoveModal').hide();
		});

	});
	
	
	//page Setting
	$('#pageSetting').live('pagebeforeshow',function(){
		$('#pageSetting .closeCaptionsOption a').live('tap',function(){
			$('#pageSetting .closeCaptionsOption a').removeClass('current');
			$(this).addClass('current');
		});
	});
	
	//page Parental Controls
	$('#pageParentalControls').live('pagebeforeshow',function(){
		$('#pageParentalControls .closeCaptionsOption a').live('tap',function(){
			$('#pageParentalControls .closeCaptionsOption a').removeClass('current');
			$(this).addClass('current');
		});
		
		$('#pageParentalControls').delegate('#btnParentalControls', 'vclick', function() {
			var $dialog = $('<div class="ui-simpledialog-container pop"><h2>Parental Controls</h2><p>This request will open in safari.</p><a data-role="button" href="#" class="btnDialogOkay ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">OK</span></span></a><a rel="close" data-role="button" href="#" class="btnDialogCancel ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Cancel</span></span></a></div>');
			$('#pageParentalControls').append($dialog);
			$('#pageParentalControls').append($('<div class="ui-simpledialog-screen"></div>'));
			$('#pageParentalControls .ui-simpledialog-container').addClass('in');
			
			positionModal($dialog);
			return false;
		});
		
		$('#pageParentalControls .btnDialogOkay').live('vclick',function(){
			window.open('https://customer.comcast.com/Secure/OnlineParentalControls.aspx', '_blank', '');
			$('.ui-simpledialog-container,.ui-simpledialog-screen').remove();
			return false;
		});
		$(document).delegate('#pageParentalControls .btnDialogCancel', 'vclick', function() {
			$('.ui-simpledialog-container, .ui-simpledialog-screen').remove();
			return false;
		});
		
	});
	
	
	//reset DOM before hide
	$(document).delegate('[data-role="page"]', 'pagebeforehide', function () {
		var $page = $('.'+activePage);
		var $scrollers	= $page.find('[data-iscroll="scroller"]');
		var $carousels	= $page.find('[data-iscroll="carousel"]');
		
		var $pageId = $page.attr('id');
		var $iscrollId,$icarouselId;
		
		//only run the following code if the `[data-iscroll="scroller"]` div exists on the page (which is the element that will be passed to iScroll)
		if ($scrollers.length > 0) {
			$scrollers.each(function(index){
				var $this = $(this);
				$iscrollId = $pageId +"-"+ index;
				if ($this.data("iscroll-plugin")) {
					myScroll[$iscrollId].destroy();
					myScroll[$iscrollId] = null;
					$this.removeData("iscroll-plugin");
					return;
				}
			});
			$carousels.each(function(index){
				var $this = $(this);
				$icarouselId = $pageId +"-carousel-"+ index;
				if ($this.data("iscroll-carousel-plugin")) {
					myScroll[$icarouselId].destroy();
					myScroll[$icarouselId] = null;
					$this.removeData("iscroll-carousel-plugin");
					return;
				}
			});
		}
		var $pop = $page.find('.sortPop');
		$pop.hide();
		$('.btnSorting').unbind('vclick');
		
		$('.ui-simpledialog-container,.ui-simpledialog-screen').remove();
	});
	
	
	//reset DOM before page show
	$(document).delegate('[data-role="page"]', 'pagebeforeshow', function () {
		
		$(document).delegate('.btnDownload', 'vclick', function() {
			var $row = $(this).closest('li');
			var $progressBar = $row.find('.downloadBox .progressBar');
			var $progressLabel = $row.find('.downloadBox .progressLabel em');
			
			$row.addClass('processing');
			$row.find('.videoControlCell a').hide();
			$row.find('.videoControlCell a.btnDownloadCancel').css('display','block');
			if(AC.Detector.isiPhone(browserAgent)) $row.find('.videoInfoContentBox').hide();
			$row.find('.downloadBox').show();
			
			$progressBar.animate(
				{'width':'100%'},
				{
					duration: timerProgress,
					step:function(e,fx){
						$progressLabel.text((Math.round(e*10)/10).toFixed(1));
					},
					complete: function() {
						$row.removeClass('processing');
						$progressBar.css('width','0%');
						$row.find('.videoInfoContentBox').show();
						$row.find('.downloadBox').hide();
						$row.find('.videoControlCell a').hide();
						$row.find('.poster .new').css('display','block');
					}
				}
			);
		});
		
		$(document).delegate('.btnDownloadCancel', 'vclick', function() {
			var $row = $(this).closest('li');
			var $progressBar = $row.find('.downloadBox .progressBar');
			var $progressLabel = $row.find('.downloadBox .progressLabel em');
			$progressBar.stop();
			$progressBar.css('width','0%');
			$progressLabel.text('0.0');
			$row.find('.videoInfoContentBox').show();
			$row.find('.downloadBox').hide();
			$row.removeClass('processing');
			$row.find('.videoControlCell a').hide();
			$row.find('.videoControlCell a.btnDownload').css('display','block');
		});
		
		$(document).delegate('.btnShowGrid', 'vclick', function() {
			var $page = $(this).closest('[data-role="page"]');
			$page.find('[data-role="content"]').removeClass().addClass('grid'); 
			$page.find('footer .btnShowGrid').hide();
			$page.find('footer .btnShowList').show();
			var $scroll = $page.find('[data-iscroll="scroller"]');
			$scroll.each(function(){
				if($(this).data("iscroll-plugin")){
					$(this).data("iscroll-plugin").refresh();
				}
				if($(this).data("iscroll-carousel-plugin")){
					$(this).data("iscroll-carousel-plugin").refresh();
				}
			});
			return false;
		});
		
		$(document).delegate('.btnShowList', 'vclick', function() {
			var $page = $(this).closest('[data-role="page"]');
			$page.find('[data-role="content"]').removeClass().addClass('list'); 
			$page.find('footer .btnShowGrid').show();
			$page.find('footer .btnShowList').hide();
			
			var $scroll = $page.find('[data-iscroll="scroller"]');
			$scroll.each(function(){
				if($(this).data("iscroll-plugin")){
					$(this).data("iscroll-plugin").refresh();
				}
				if($(this).data("iscroll-carousel-plugin")){
					$(this).data("iscroll-carousel-plugin").refresh();
				}
			});
			return false;
		});
				
		$('.sortPop').delegate('label', 'vclick', function() {
			var $label = $(this);
			var $pop = $(this).closest('.sortPop');
			var $row = $(this).parent();
			$pop.find('dd').removeClass('selected');
			$row.addClass('selected');
			$pop.find(':radio').attr('checked',false);
			$row.find(':radio').attr('checked',true);
			$pop.hide();
		});
		
		$('.videoResolution').delegate('label', 'vclick', function() {
			var $label = $(this);
			var $list = $(this).closest('.videoResolution');
			var $row = $(this).parent();
			$list.find('dd').removeClass('selected');
			$row.addClass('selected');
			$list.find(':radio').attr('checked',false);
			$row.find(':radio').attr('checked',true);
		});
		
		$('.btnSorting').bind('vclick', function() {
			var $footer = $(this).closest('footer');
			var $pop = $footer.parent().find('.sortPop');
			if($pop.is(':hidden')){
                $pop.show();
			}else{
                $pop.hide();
			}
			return false;
		});
		
		$(document).live("tap",function(event){
			var $target = $(event.target);
			var $pop = $('.'+activePage+' .sortPop');
			if(!$pop.is(':hidden')){
				if(!$target.is($pop.find('*').andSelf())){
					$pop.hide();
				}
			}
		});		
		
	});
	
	$(document).delegate('[data-role="page"]', 'pageshow', function () {
		$(window).bind('orientationchange',function(e){
			//cache current page being created and the id of the element that will be passed to iScroll
			var activePage = $.mobile.activePageClass;
			var $page		= $('.'+activePage);
			
			var $carousels	= $page.find('[data-iscroll="carousel"]');
			if ($carousels.length > 0) {
				$carousels.each(function(){
					var $this = $(this);
					var winWidth = $page.width();
					var item = $this.find('ul>li');
					item.width(winWidth/3)
					var width = winWidth/3;
					
					var length = item.length;
					var $this = $(this);
					$this.find('.carouselInner').width(width*length);
					
					if ($this.data("iscroll-carousel-plugin")) {
						$this.data("iscroll-carousel-plugin").refresh();
					}
		
				});
			}
			positionModal($('.ui-simpledialog-container'));
		});
	});
	
});

//cloud page data insert
var cloudDataFill = function(data) {
	var dataArray = new Array();
	var row;
	
	for (var i in data.itemData){
		row = '';
		row += '<li>';
		row += '<div class="videoCell">';
		row += 		'<div class="poster"><img src="images/'+data.itemData[i].itemCellImages+'" alt="" /><div class="new"></div></div>';
		row += 		'<a href="#" data-role="none" class="btnPlay"></a>';
		row += '</div>';
		row += '<div class="videoInfoCell">';
		row += 		'<h3 title="'+data.itemData[i].itemCellName+'">'+data.itemData[i].itemCellName+'</h3>';
		row += 		'<div class="videoInfoContentBox">';
		row += 			'<div class="rationBox">';
		row += 				'<span class="ratings">'+data.itemData[i].itemCellRatingNum+'</span>';
		row += 			'</div>';
		row += 			'<div class="videoInfoBox">';
		row += 				'<div class="videoTime"><time>'+data.itemData[i].itemCellVideoLength+'</time></div>';
		row += 				'<div class="videoDate">'+data.itemData[i].itemCellVideoDate+'</div>';
		row += 			'</div>';
		row += 		'</div>';
		row += 		'<div class="downloadBox hide">';
		row += 			'<div class="progress"><div class="progressBar"></div></div>';
		row += 			'<div class="progressLabel">Downloading... (<em>0</em>%)</div>';
		row += 		'</div>';
		row += '</div>';
		row += '<div class="videoControlCell">';
		row += 		'<a href="#" data-role="none" class="btnDownloadCancel"></a>';
		row += 		'<a href="#" data-role="none" class="btnDownload"></a>';
		row += 		'<a href="#" data-role="none" class="btnNewMark"></a>';
		row += '</div>';
		row += '<div class="videoRemoveModal">';
		row += 		'<p>Remove from device?</p>';
		row += 		'<a href="#" data-role="none" class="btnGray btnCancel">No</a>';
		row += 		'<a href="#" data-role="none" class="btnGray btnConfirm">Yes</a>';
		row += '</div>';
		row += '<div class="clearFixed"></div>';
		row += '</li>';
		dataArray.push(row);
	}
	return dataArray;
}

//decive page data insert
var deciveDataFill = function(data) {
	var dataArray = new Array();
	var row;
	
	for (var i in data.itemData){
		row = '';
		row += '<li>';
		row += '<div class="videoCell">';
		row += 		'<div class="poster"><div class="inner"><img src="images/'+data.itemData[i].itemCellImages+'" alt="" />' ;

        if(data.itemData[i].itemStatus){
        row += 		    '<div class="new"></div>';
        }
        if($.trim(data.itemData[i].itemCellVideoPlayed).length>0){
            row += 		'<div class="videoPlayProgress"><div class="videoPlayProgressBar"></div></div>';
        }
        row += 		'<div class="playMask"><a href="#" data-role="none" class="btnPlay"></a></div>';
        row +=     '</div></div>';


		row += '</div>';
		row += '<div class="videoInfoCell">';
		row += 		'<h3 title="'+data.itemData[i].itemCellName+'">'+data.itemData[i].itemCellName+'</h3>';
		row += 		'<div class="videoInfoContentBox">';
		row += 			'<div class="rationBox">';
		row += 				'<span class="ratings">'+data.itemData[i].itemCellRatingNum+'</span>';
		row += 			'</div>';
		row += 			'<div class="videoInfoBox">';
		if($.trim(data.itemData[i].itemCellVideoPlayed).length>0){
			row += 				'<div class="videoPlayTime"><time class="videoPlayedTime">'+data.itemData[i].itemCellVideoPlayed+'</time>/ <time>'+data.itemData[i].itemCellVideoLength+'</time></div>';
		}else{
			row += 				'<div class="videoTime"><time>'+data.itemData[i].itemCellVideoLength+'</time></div>';
		}
		row += 				'<div class="videoDate">'+data.itemData[i].itemCellVideoDate+'</div>';
		row += 			'</div>';
		row += 		'</div>';
		row += 		'<div class="downloadBox hide">';
		row += 			'<div class="progress"><div class="progressBar"></div></div>';
		row += 			'<div class="progressLabel">Downloading... (<em>0</em>%)</div>';
		row += 		'</div>';
		row += '</div>';
		row += '<div class="videoControlCell">';
		if(data.itemData[i].itemStatus){
			row += 		'<a href="#" data-role="none" class="btnNewMark"></a>';
		}
		row += '</div>';
		row += '<div class="videoRemoveModal">';
		row += 		'<p>Remove from device?</p>';
		row += 		'<a href="#" data-role="none" class="btnGray btnCancel">No</a>';
		row += 		'<a href="#" data-role="none" class="btnGray btnConfirm">Yes</a>';
		row += '</div>';
		row += '<div class="clearFixed"></div>';
		row += '</li>';
		dataArray.push(row);
	}
	return dataArray;
}

var positionModal = function(obj){
	var wWidth  = window.innerWidth;
	var wHeight = window.innerHeight;

	if (typeof wWidth == "undefined") {
		wWidth  = document.documentElement.clientWidth;
		wHeight = document.documentElement.clientHeight;
	}

	var boxLeft = parseInt((wWidth / 2) - ( obj.width() / 2 ));
	var boxTop  = parseInt((wHeight / 2) - ( obj.height() / 2 ));

	// position modal
	obj.css({left:boxLeft+ 'px',top:boxTop+ 'px'	});
}
