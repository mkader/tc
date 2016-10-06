//create a global variable that stores the instances of iScroll on different pages, or multiple instance on a single page (that's up to you)
var myScroll = [];
var generatedCount = 0;
var pullDownAction = function(obj,scrollObj) { //call ajax data to insert the new list
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		var number = 2;
		var generatNumber = 0;
		el = $(obj);
		var row = '';
		row += '<div class="videoCell">';
		row += 		'<div class="poster"><img src="images/posters/VSC_HouseHunters__047839.jpg" alt="" /><div class="new"></div></div>';
		row += 		'<a href="#" data-role="none" class="btnPlay"></a>';
		row += '</div>';
		row += '<div class="videoInfoCell">';
		row += 		'<h3 title="Video Title lorem ipsum lorem ipsum"></h3>';
		row += 		'<div class="videoInfoContentBox">';
		row += 			'<div class="rationBox">';
		row += 				'<span class="ratings">TV-MA</span>';
		row += 			'</div>';
		row += 			'<div class="videoInfoBox">';
		row += 				'<div class="videoTime"><time>1:00</time></div>';
		row += 				'<div class="videoDate">May 28, 2012 10:15 PM</div>';
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
		
		if(el.data('generatNumber')){
			generatNumber = el.data('generatNumber')
		}else{
			generatNumber = generatedCount;
		}
		for (i=0; i< number; i++) {
			generatNumber++;
			li = $('<li />');
			li.append(row);
			li.find('.videoInfoCell h3').text('Generated row ' + generatNumber +' lorem ipsum dolor sit');
			li.prependTo(el);
		}
		el.data('generatNumber',generatNumber);
		
		scrollObj.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

//bind to the pageshow event for all pages that are added to the DOM by jQuery Mobile
$(document).delegate('[data-role="page"]', 'pageshow', function () {
	
	//cache current page being created and the id of the element that will be passed to iScroll
	var activePage = $.mobile.activePageClass;
	var $page		= $('.'+activePage);
	
	var $scrollers	= $page.find('[data-iscroll="scroller"]');
	var $carousels	= $page.find('[data-iscroll="carousel"]');
	var $pullDown	= $page.find('.pullDown');
	var $pullDownOffset = $pullDown.innerHeight();

	var $pageId = $page.attr('id');
	var $iscrollId,$icarouselId,pullOptions={},options = {};
	
	//only run the following code if the `[data-iscroll="scroller"]` div exists on the page (which is the element that will be passed to iScroll)
	if ($scrollers.length > 0) {
		
		$scrollers.each(function(index){
			var $this = $(this);
			$iscrollId = $pageId +"-"+ index;
			if ($this.data("iscroll-plugin")) {
				myScroll[$iscrollId].refresh();
				return;
			}
			
			var st = $this.jqmData( "scroll" ),
				dir = st && st.search(/^[xy]/) != -1 ? st.charAt(0) : null;
				
			switch(dir){
				case "x":
					options = {
						hScrollbar : true,
						hScroll    : true,
						vScrollbar : false,
						vScroll    : false,
						scrollbarClass: 'scrollbar'
					}
					break;
				case "y":
					options = {
						hScrollbar : false,
						hScroll    : false,
						vScrollbar : true,
						vScroll    : true,
						scrollbarClass: 'scrollbar'
					}
					break;
				default:
					options = {
						hScrollbar : false,
						hScroll    : false,
						vScrollbar : false,
						vScroll    : true
					}
			}
			
			if($pullDown.length>0){
				pullOptions = {
					topOffset: $pullDownOffset,
					onRefresh: function () {
						if ($pullDown.hasClass('loading')) {
							$pullDown.removeClass('loading');
							$pullDown.find('.pullDownLabel').text('Pull down to refresh...');
						} 
					},
					onScrollMove: function () {
						if (this.y > 5 && !$pullDown.hasClass('flip')) {
							$pullDown.addClass('flip');
							$pullDown.find('.pullDownLabel').text('Release to refresh...');
							this.minScrollY = 0;
						} else if (this.y < 5 && $pullDown.hasClass('flip')) {
							$pullDown.removeClass('flip');
							$pullDown.find('.pullDownLabel').text('Pull down to refresh...');
							this.minScrollY = -$pullDownOffset;
						}
					},
					onScrollEnd: function () {
						if ($pullDown.hasClass('flip')) {
							$pullDown.removeClass('flip');
							$pullDown.addClass('loading');
							$pullDown.find('.pullDownLabel').text('Syncing...');			
							pullDownAction($page.find('.pullList'),myScroll[$iscrollId]);	// Execute custom function (ajax call?)
						}
					}
				}
			}
						
			$.extend(options, pullOptions);

			$this.bind('touchmove', function (e) { e.preventDefault(); });
			if ($this) {
				myScroll[$iscrollId] = new iScroll($this.get(0), options);
				setTimeout(function () {
					myScroll[$iscrollId].refresh();
					$page.find('[data-iscroll="scroller"]').css('left','0');
				}, 400);
				
				$this.data("iscroll-plugin", myScroll[$iscrollId]);
			}
		});
		
	}
	
	//only run the following code if the `[data-iscroll="carousel"]` div exists on the page (which is the element that will be passed to iScroll)
	if ($carousels.length > 0 && AC.Detector.isiPhone(browserAgent)) {
		
		$carousels.each(function(index){
			var $this = $(this);
			$icarouselId = $pageId +"-carousel-"+ index;
			if ($this.data("iscroll-carousel-plugin")) {
				myScroll[$icarouselId].refresh();
				return;
			}
			var winWidth = $page.width();
			var item = $this.find('ul>li');
			var width = winWidth/3;
			item.width(width)
			var length = item.length;

			$this.find('.carouselInner').width(width*length);
			$this.bind('touchmove', function (e) { e.preventDefault(); });
			if ($this) {
				myScroll[$icarouselId] = new iScroll($this.get(0), {
					snap: 'li',
					momentum: false,
					vScroll: false,
					hScrollbar: false,
					vScrollbar: false,
					onScrollEnd: function () {
						var $active = $('#pageDevice .filterBar ul a').eq(this.currPageX+1);
						var deviceName = $active.attr('data-json-name');
						var tmp,tmpArray = new Array();
						if(deviceName == 'null') return;
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
					}
				});
				$this.data("iscroll-carousel-plugin", myScroll[$icarouselId]);
			}
		});
		
	}
	
});

