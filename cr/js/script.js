var situations;
var votedSituations;
var searchResults;
var currentSituationId;
var backendUrl = "http://www.holycrappapp.com/holycrapp/";

document.addEventListener("deviceready",onDeviceReady,false);

var questionsPageMap = {
	'Travel': 'pageTravelQuestions',
	'Auto': 'pageAutoQuestions',
	'Medical': 'pageMedicalQuestions',
	'Survival': 'pageSurvivalQuestions',
	'Comedy': 'pageDailyCrAppQuestions'
};

var answerPageMap = {
	'Travel': 'pageTravelAnswer',
	'Auto': 'pageAutoAnswer',
	'Medical': 'pageMedicalAnswer',
	'Survival': 'pageSurvivalAnswer',
	'Comedy': 'pageDailyCrAppAnswer'
}

function onDeviceReady() {
	$.ajax({
		type: 'get',
		url: backendUrl+'situations.php',
		success: function(data) {
			response = $.parseJSON(data);
			if (response['success']) {
				situations = response['results'];
				populatePages();
			}
		}
	});
}

$(document).bind( "mobileinit", function() {
	if (localStorage) {
		// Load the voted items in local storage
		votedSituationsData = localStorage.getItem('holycrapp-voted');
		if (votedSituationsData) {
			votedSituations = $.parseJSON(votedSituationsData);
		}
	}

	if (!votedSituations) {
		votedSituations = {};
	}

	var timmer, periodLength = 3, totalTime = 7;
	var loading = "Loading";
	$.mobile.ajaxEnabled = true;
	$.mobile.defaultPageTransition = 'slide';

	$('.tap,.viewList li a').live('vmousedown',function(){
		$(this).addClass('hover');
	});
	$('.tap,.viewList li a').live('vmouseup',function(){
		$(this).removeClass('hover');
	});
	$('.tap,.viewList li a').live('taphold',function(){
		$(this).removeClass('hover');
	});

	$('.viewList li a').live('tap', function(){
		var itemId = $(this).attr('id');
		var isSearchItem = (itemId.indexOf('search') > -1);
		var situationId = parseInt((isSearchItem)
							? itemId.substr('searchSituationItem_'.length) : itemId.substr('situationItem_'.length));

		if (!isNaN(situationId) && situationId > 0) {
			// Get the current situation and update the corresponding page
			var situation = retrieveSituation(situationId);
			if (situation != null) {
				currentSituationId = situation.situation_id;
				var answerPageId = (isSearchItem) ? 'pageSearchAnswer' : answerPageMap[situation.category];
				$('div#' + answerPageId + ' div.titleBar a').text(situation.title);
				$('div#' + answerPageId + ' span.praise').text(situation.num_upvotes - situation.num_downvotes);
				$('div#' + answerPageId + ' div.content').html(formatContent(situation.details));

				var voteType = votedSituations[situationId];
				if (voteType == 'upvote') {
					// Hide the upvote button (user has already upvoted)
					$('div#' + answerPageId + ' div.control a.add').css('display', 'none');
				} else if (voteType == 'downvote') {
					// Hide the downvote button (user has already downvoted)
					$('div#' + answerPageId + ' div.control a.reduce').css('display', 'none');
				} else {
					$('div#' + answerPageId + ' div.control a.add').css('display', 'block');
					$('div#' + answerPageId + ' div.control a.reduce').css('display', 'block');
				}
			}
		}
	});

	// Handle upvotes
	$('div.answerPage div.control a.add').live('tap', function() {
		var answerPage = $(this).parent().parent().parent().parent().parent().parent();
		doVote(currentSituationId, 'upvote', answerPage.attr('id'));
	});

	// Handle downvotes
	$('div.answerPage div.control a.reduce').live('tap', function() {
		var answerPage = $(this).parent().parent().parent().parent().parent().parent();
		doVote(currentSituationId, 'downvote', answerPage.attr('id'));
	});

	$('#pageMain .search :text').live('keyup',function(evt){
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if(charCode == 13) {
			var inputValue = $.trim($(this).val());
			if (inputValue.length == 0) {
				alert('Please enter a situation to search for.');
				return;
			}

			populateSearchResults(inputValue);
			$.mobile.changePage('#pageSearchQuestions');
		}
	});
});

var doVote = function(id, type, pageId) {
	var data = {
		action: type,
		situation_id: id,
		reversal: false
	};
    
    var header = '';
    var message = '';

	if (votedSituations[id]) {
		var voteType = votedSituations[id];
		if (voteType == 'upvote' && type == 'downvote' || voteType == 'downvote' && type == 'upvote') {
			data['reversal'] = true;
		}
	}

	$.ajax({
		type: 'post',
		data: data,
		url: backendUrl+'situations.php',
		success: function(data) {
			response = $.parseJSON(data);

			if (response['success']) {
				var result = response['result'];
				var numUpvotes = parseInt(result['num_upvotes']);
				var numDownvotes = parseInt(result['num_downvotes']);

				// Update the local voted storage
				votedSituations[id] = type;
				if (localStorage) {
					localStorage.setItem('holycrapp-voted', JSON.stringify(votedSituations));
				}

				// Hide the corresponding vote control
				if (type == 'upvote') {
                    message = 'Your feedback is valuable';
                    header = 'Thanks!';
					// Hide the upvote button (user has already upvoted)
					$('div#' + pageId + ' div.control a.add').css('display', 'none');
					$('div#' + pageId + ' div.control a.reduce').css('display', 'block');
				} else if (type == 'downvote') {
           
           message = 'Let us know how we can improve this';
           header = 'Sorry';
					// Hide the downvote button (user has already downvoted)
					$('div#' + pageId + ' div.control a.reduce').css('display', 'none');
					$('div#' + pageId + ' div.control a.add').css('display', 'block');
				}

				var voteDelta = numUpvotes;
				$('div#' + pageId + ' span.praise').text(voteDelta);

				// Update the praise for the situation item itself (on the questions page)
				$('a#situationItem_' + id + ' span.praise').text(voteDelta);

				// Update the corresponding situation item in the situations with the new number of upvotes and downvotes
				for (var i = 0; i < situations.length; i++) {
					if (situations[i].situation_id == id) {
						situations[i].num_upvotes = numUpvotes;
						situations[i].num_downvotes = numDownvotes;
					}
				}

				//alert(response['message']);
           navigator.notification.alert(header,null, message, 'Ok');
			}
		}
	});
}

var populateSearchResults = function(searchTerm) {
	if (searchTerm && $.trim(searchTerm).length > 0) {
		// Clear the previous search results
		$('div#pageSearchQuestions ul li').remove();

		for (var i = 0; i < situations.length; i++) {
			var situation = situations[i];
			if (situation.title.match(new RegExp(searchTerm, 'gi'))) {
				$('div#pageSearchQuestions ul').append(
					$('<li></li>').html('<a id="searchSituationItem_' + situation['situation_id'] + '" href="#pageSearchAnswer">'
										+ situation['title'] + ' <span class="praise">'
										+ (parseInt(situation['num_upvotes']) - parseInt(situation['num_downvotes'])) + '</span></a>')
				);
			}
		}
	}
}

var retrieveSituation = function(id) {
	for (var i = 0; i < situations.length; i++) {
		var situation = situations[i];
		if (situation.situation_id == id) {
			return situation;
		}
	}

	return null;
}

var populatePages = function() {
	for (var i = 0; i < situations.length; i++) {
		var situation = situations[i];
		var category = situation['category'];
		var questionsPageId = questionsPageMap[category];
		var answerPageId = answerPageMap[situation.category];

		$('div#' + questionsPageId + ' ul').append(
			$('<li></li>').html('<a id="situationItem_' + situation['situation_id'] + '" href="#' + answerPageId + '">'
								+ situation['title'] + ' <span class="praise">'
								+ (parseInt(situation['num_upvotes']) - parseInt(situation['num_downvotes'])) + '</span></a>')
		);
	}
}

var formatContent = function(content) {
	content = content.replace(/\\n/g, '<br />');

	return content;
}