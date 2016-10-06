var localize = {
	"en": {
		"country":"Country/ Language :",
		"id":"Login ID :",
		"password":"Password :",
		"remember":"Remember me",
		"login":"LOGIN",
		"note":"To access eService Mobile Application, you need to register online.",
		"forgot":"Forgot your Password?"
	},
	"de": {
		"country":"Land/ Sprache :",
		"id":"Benutzer ID :",
		"password":"Passwort :",
		"remember":"An Mich Erinnern",
		"login":"ANMELDEN",
		"note":"Um eService Mobile Applikation zuzugreifen, Sie brauchen, um sich online anzumelden.",
		"forgot":"PASSWORT VERGESSEN?"
	}
};
var LOGIN_ID = "test";
var PASSWORD = "test";
var dropdownValues = {
	"CT 0369": {
		"10 FS": ["WHQ UN001", "WHQ UN002"],
		"1 FS": ["NAA UN001", "NAA UN002"],
		"5 FS": ["ENG UN001"]
	},
	"TX 3991": {
		"BLDG 36": ["T1393"]
	}
}

$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = "none";

	// load images
	var imgs = ["bg-checkbox.png", "bg-fc-header.png", "bg-filter-shadow-bottom.png", "bg-filter-shadow.png", "bg-handle.png", "bg-indicator.png", "bg-menu-active.png", "bg-menu-bottom.png", "bg-menu-shadow.png", "bg-menu.png", "bg-next-btn.png", "bg-prev-btn.png", "bg-sep-line.png", "bg-slider-text.png", "bg-slider.png", "bg-texture.png", "btn-arrow.png", "btn-back.png", "btn-close.png", "btn-login.png", "btn-reset.png", "btn-submit.png", "btn-toggle.png", "icon-add.png", "icon-arrow.png", "icon-cancel.png", "icon-delete.png", "icon-done.png", "icon-edit.png", "icon-email.png", "icon-error.png", "icon-feedback.png", "icon-help.png", "icon-home-ca-active.png", "icon-home-ca.png", "icon-home-co-active.png", "icon-home-co.png", "icon-home-lsc-active.png", "icon-home-lsc.png", "icon-home-osc-active.png", "icon-home-osc.png", "icon-home-pd-active.png", "icon-home-pd.png", "icon-home-settings-active.png", "icon-home-settings.png", "icon-logo.png", "icon-maintenance.png", "icon-menu-ca-active.png", "icon-menu-ca.png", "icon-menu-co-active.png", "icon-menu-co.png", "icon-menu-help-active.png", "icon-menu-help.png", "icon-menu-home-active.png", "icon-menu-home.png", "icon-menu-lo-active.png", "icon-menu-lo.png", "icon-menu-lsc-active.png", "icon-menu-lsc.png", "icon-menu-osc-active.png", "icon-menu-osc.png", "icon-menu-pd-active.png", "icon-menu-pd.png", "icon-menu-settings-active.png", "icon-menu-settings.png", "icon-phone.png", "icon-repair.png", "icon-sc.png", "icon-sent.png", "icon-small-logo.png", "list-style.png"];
	var loaded = 0;
	for(var i = 0; i < imgs.length; i++) {
		var image = new Image();
		$(image).bind("load", function() {
			loaded++;
			$(".loading span").html(Math.round(loaded / imgs.length * 100) + " %");
			if(loaded >= imgs.length) {
				$("#loading .hidden").trigger("click");
			}
		});
		image.src = "i/" + imgs[i];
	}

	$("#country-language").live("change", function(e) {
        var lang = $(this).val();
		for(var i in localize[lang]) {
			if($("#login-page .l-" + i).find(".ui-btn-text").length > 0) {
				$("#login-page .l-" + i + " .ui-btn-text").html(localize[lang][i]);
			} else {
				$("#login-page .l-" + i).html(localize[lang][i]);
			}
		}
    });
	$("#login-page .login-btn").live("click", function() {
		if($("#login-id").val() == LOGIN_ID && $("#password").val() == PASSWORD) {
			if(!loginState) {
				$("#door-sound").get(0).load();
			}
			var self = $(this);
			window.scrollTo(0, 1);
			setTimeout(function() {
				self.attr("href", loginState ? "#home-page" : "#contact-info-page");
				self.trigger("click");
				self.attr("href", "javascript:;");
				$("#login-id").val("");
				$("#password").val("");
				$("#login-box p.error").css("display", "none");
				$("#login-box .text").removeClass("error");
			}, 100);
		} else {
			$("#login-box p.error").css("display", "block");
			$("#login-box .text").addClass("error");
		}
	});
	$(".logout-btn, .lo").live("click", function() { loginState = true; });
	$("#contact-info-page .edit-btn").live("click", function() {
		$("#contact-info-page .select-l").addClass("selectLabel");
		$("#contact-info-page .contact-info .form-info").addClass("edit-mode");
		$("#contact-info-page .header h1").html("Edit Info");
		$("#contact-info-page .note").addClass("hide");
		$("#contact-info-page .contact-info .data, #contact-info-page .footer .edit-btn, #contact-info-page .footer .done-btn").addClass("hide");
		$("#contact-info-page .contact-info .form-element, #contact-info-page .footer .cancel-btn, #contact-info-page .footer .save-btn").removeClass("hide");
	});
	$("#contact-info-page .cancel-btn").live("click", function() {
		$("#contact-info-page .select-l").removeClass("selectLabel");
		$("#contact-info-page .contact-info .form-info").removeClass("edit-mode");
		$("#contact-info-page .contact-info .form-info li.error").removeClass("error");
		$("#contact-info-page .header h1").html("Contact Info");
		$("#contact-info-page .note").removeClass("hide");
		$("#contact-info-page .contact-info .form-element, #contact-info-page .footer .cancel-btn, #contact-info-page .footer .save-btn").addClass("hide");
		$("#contact-info-page .contact-info .data, #contact-info-page .footer .edit-btn, #contact-info-page .footer .done-btn").removeClass("hide");
	});
	$("#contact-info-page .save-btn").live("click", function() {
		$("#edit-city, #edit-postal-code").val("").parent().addClass("error");
	});
	$(".filter .filter-header td.btn").live("click", function() {
		var btn = $(this).find(".toggle-btn");
		if(btn.hasClass("expand")) {
			btn.removeClass("expand");
			btn.parents(".filter").children(".filter-content").addClass("hide");
		} else {
			btn.addClass("expand");
			btn.parents(".filter").children(".filter-content").removeClass("hide");
			if(!("onorientationchange" in window)) {
				$.each($(this).parents(".filter-header").siblings(".filter-content").find("p .select"), function() {
					var p = $(this).parent();
					var pts = p.css("padding-left");
					var pt = parseInt(pts.substring(0, pts.indexOf("p")));
					var pbs = p.css("padding-right");
					var pb = parseInt(pbs.substring(0, pbs.indexOf("p")));
					padding = pt + pb;
					var w = $(this).parent().width() - $(this).siblings("label").width() - padding;
					$(this).width(w);
				});
			}
		}
	});
	$(".filter .filter-content .cancel-btn").live("click", function() {
		$(this).parents(".filter-content").prev().find("td.btn").trigger("click");
	});
	var menuStates = {
		"open-calls-page": false,
		"completed-activities-page": false,
		"log-service-call-page": false,
		"performance-dashboard-page": false,
		"contact-otis-page": false,
		"settings-page": false
	};
	var loginState = false;
	$(".menu-btn").live("click", function() {
		if($(this).hasClass("active")) {
			menuStates[$(this).parents("[data-role='page']").attr("id")] = false;
			$(this).removeClass("active");
			$(this).parent().next().find(".menu").addClass("hide");
		} else {
			menuStates[$(this).parents("[data-role='page']").attr("id")] = true;
			$(this).addClass("active");
			$(this).parent().next().find(".menu").removeClass("hidden").removeClass("hide");
		}
	});
	$(".home").live("click", function() {
		for(var i in menuStates) {
			menuStates[i] = false;
		}
	});
	// mock pagination
	var currentPage = 1;
	$(".pager .prev-btn").live("click", function() {
		var text = $(this).siblings("strong");
		var splited = text.text().split(" ");
		var totalPage = splited[splited.length - 1];
		if(text.text() != "1 - 10 of " + totalPage) {
			currentPage--;
			text.text(((currentPage - 1) * 10 + 1) + " - " + (currentPage * 10) + " of " + totalPage);
		}
	});
	$(".pager .next-btn").live("click", function() {
		var text = $(this).siblings("strong");
		var splited = text.text().split(" ");
		var totalPage = splited[splited.length - 1];
		if(text.text() != ((currentPage - 1) * 10 + 1) + " - " + totalPage + " of " + totalPage) {
			currentPage++;
			text.text(((currentPage - 1) * 10 + 1) + " - " + (currentPage * 10) + " of " + totalPage);
		}
	});
	$(".popup .close-btn").live("click", function() {
		$(this).parent().addClass("hide");
		$(".alpha").addClass("hide")
	});
	$("#log-service-call-page .footer .done-btn").live("click", function() {
		var popup = $("#log-service-call-page .error-popup");
		popup.css({ marginLeft: -popup.outerWidth() / 2 + "px", marginTop: -popup.outerHeight() / 2 + "px" });
		$(".alpha").removeClass("hide");
		popup.removeClass("hide");
	});
	$("#log-service-call-page .success-popup .gray-btn").live("click", function() {
		$("#log-service-call-page .success-popup").addClass("hide");
		$(".alpha").addClass("hide");
	});
	$("#log-service-call-page .error-popup .try-again-btn").live("click", function() {
		$("#log-service-call-page .error-popup").addClass("hide");
		var popup = $("#log-service-call-page .success-popup");
		popup.css({ marginLeft: -popup.outerWidth() / 2 + "px", marginTop: -popup.outerHeight() / 2 + "px" });
		$(".alpha").removeClass("hide");
		popup.removeClass("hide");
	});
	$(".data-table td.btn").live("click", function() {
		var btn = $(this).find(".toggle-btn");
		if(btn.hasClass("expand")) {
			btn.removeClass("expand");
			btn.parents("tr").next(".detail").addClass("hide");
		} else {
			btn.addClass("expand");
			btn.parents("tr").next(".detail").removeClass("hide");
		}
	});
	$("#unit-details-page .view-nav li.first a").live("click", function() {
		$("#unit-details-page #calendar, #unit-details-page .calendar-view").addClass("hide");
		$("#unit-details-page .event-view").removeClass("hide");
	});
	$("#unit-details-page .view-nav li.last a").live("click", function() {
		$("#unit-details-page .event-view").addClass("hide");
		$("#unit-details-page #calendar").removeClass("hide");
		if($("#unit-details-page .calendar-view tbody tr").length > 0) {
			$("#unit-details-page .calendar-view").removeClass("hide");
		}
		$("#unit-details-page #calendar").fullCalendar("render");
		$("#unit-details-page .filter-btn").trigger("click");
	});
	var eventJSON = [
		{
			title: "",
			start: new Date(2012, 0, 3),
			className: "icon-call",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Service Call"
		},
		{
			title: "",
			start: new Date(2012, 0, 5),
			className: "icon-repair",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Repair"
		},
		{
			title: "",
			start: new Date(2012, 0, 5),
			className: "icon-call",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Service Call"
		},
		{
			title: "",
			start: new Date(2012, 0, 18),
			allDay : false,
			className: "icon-maintenance",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Maintenance"
		},
		{
			title: "",
			start: new Date(2012, 0, 18),
			className: "icon-repair",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Repair"
		},
		{
			title: "",
			start: new Date(2012, 0, 18),
			className: "icon-call",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Service Call"
		},
		{
			title: "",
			start: new Date(2012, 0, 20),
			className: "icon-maintenance",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Maintenance"
		},
		{
			title: "",
			start: new Date(2012, 0, 20),
			className: "icon-repair",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Repair"
		},
		{
			title: "",
			start: new Date(2012, 0, 23),
			className: "icon-call",
			eventUnit: "1234 / ABCDUnit",
			eventType: "Service Call"
		}
	];
	$("#unit-details-page").live( 'pageinit',function(event){
		// calculate
		var hasEventDays = [];
		var dateCount = 0;
		$('#calendar').fullCalendar({
			header: {
				left:   'prev',
				center: 'title',
				right:  'next'
			},
			weekMode: "variable",
			year: 2012,
			month: 0,
			height: 214,
			editable: false,
			events: eventJSON,
			eventRender: function(event, element) { hasEventDays = [] },
			eventAfterRender: function(event, element, view) {
				var cssTop = $(element).css("top");
				var cssLeft = $(element).css("left");
				var offsetTop = parseFloat(cssTop.substring(0, cssTop.indexOf("p")));
				var offsetLeft = parseFloat(cssLeft.substring(0, cssLeft.indexOf("p")));
				var isNewDay = true;
				var currentDay;
				for(var i in hasEventDays) {
					if(event.start.toString() == i) {
						isNewDay = false;
						currentDay = hasEventDays[i];
						break;
					}
				}
				if(!isNewDay) {
					$(element).css({ left: (offsetLeft + $(element).width() - 9 - 14 * currentDay.total) + "px", top: currentDay.offsetTop + "px" });
					currentDay.total++;
					$(element).attr("temp", "l" + currentDay.c);
				} else {
					dateCount++;
					hasEventDays[event.start.toString()] = { total: 1, offsetTop: offsetTop, c: dateCount };
					$(element).css("left", (offsetLeft + $(element).width() - 9) + "px");
					$(element).attr("temp", "l" + dateCount);
				}
				$(element).width(11);
			},
			eventClick: function(event, jsEvent, view) {
				var x = jsEvent.pageX;
				var y = jsEvent.pageY;
				$.each($("#calendar td"), function() {
					var offset = $(this).offset();
					var left = offset.left;
					var right = left + $(this).width();
					var top = offset.top;
					var bottom = top + $(this).height();
					if(x >= left && x <= right && y >= top && y <= bottom) {
						$(this).trigger("click");
					}
				});
			},
			dayClick: function(date, allDay, jsEvent, view) {
				$("#calendar td.current").removeClass("current");
				$(this).addClass("current");
				var events = $('#calendar').fullCalendar("clientEvents");
				$("#unit-details-page .calendar-view tbody").html("");
				for(var i in events) {
					var evt = events[i];
					var evtDate = evt.start;
					if(evtDate.toString() == date) {
						var dateString = evtDate.getDate() + "/" + (evtDate.getMonth() + 1) + "/" + evtDate.getFullYear();
						var icon, url;
						switch(evt.eventType) {
							case "Service Call":
								icon = "sc";
								url = "#service-call-detail-page-detail?from=pd"
								break;
							case "Repair":
								icon = "repair";
								url = "#repair-detail-page-detail?from=pd"
								break;
							case "Maintenance":
								icon = "maintenance";
								url = "#maintenance-detail-page-detail?from=pd"
								break;
							default:
								break;
						}
						var content = '<tr><td><img src="i/icon-' + icon + '.png" alt="" /></td><td>01/03/2012</td><td>' + evt.eventUnit + '</td><td class="left-align">' + evt.eventType + '</td><td><a href="' + url + '" data-role="none" class="btn-arrow">&gt;</a></td></tr>';
						$("#unit-details-page .calendar-view tbody").prepend(content);
						$("#unit-details-page .calendar-view").removeClass("hide");
					}
				}
				$("#unit-details-page .filter-btn").trigger("click");
			}
		});
	});
	$("#service-call-detail-page-detail .back-btn, #repair-detail-page-detail .back-btn, #maintenance-detail-page-detail .back-btn").live("click", function() {
		$(this).attr("href", window.location.toString().indexOf("?from=pd") != -1 ? "#unit-details-page" : "#completed-activities-page");
	});
	$(".filter-btn").live("click", function() {
		var data = $(this).parents(".filter").siblings(".data-table");
		var head = $(this).parents(".filter-content").prev();
		var showSC = $(this).parent().prev().prev().prev().find("input").attr("checked") == "checked";
		var showR = $(this).parent().prev().prev().find("input").attr("checked") == "checked";
		var showM = $(this).parent().prev().find("input").attr("checked") == "checked";
		data.find("tbody tr").removeClass("hide");
		if(!showSC) {
			head.find("td:eq(1)").addClass("hide");
			$.each(data.find("tbody tr"), function() {
				if($(this).find("img[src='i/icon-sc.png']").length > 0) {
					$(this).addClass("hide");
				}
			});
			$(".icon-call").addClass("hide");
		} else {
			head.find("td:eq(1)").removeClass("hide");
			$(".icon-call").removeClass("hide");
		}
		if(!showR) {
			head.find("td:eq(2)").addClass("hide");
			$.each(data.find("tbody tr"), function() {
				if($(this).find("img[src='i/icon-repair.png']").length > 0) {
					$(this).addClass("hide");
				}
			});
			$.each($(".icon-repair"), function() {
				if(!$(this).hasClass("hide")) {
					$(this).addClass("hide");
					var t = $(this).attr("temp");
					$.each($(this).siblings("[temp='" + t + "']"), function() {
						if($(this).hasClass("icon-call")) {
							var ls = $(this).css("left");
							var l = parseInt(ls.substring(0, ls.indexOf("p")));
							l += 14;
							$(this).css("left", l + "px");
						}
					});
				}
			});
		} else {
			head.find("td:eq(2)").removeClass("hide");
			$.each($(".icon-repair"), function() {
				if($(this).hasClass("hide")) {
					var t = $(this).attr("temp");
					$.each($(this).siblings("[temp='" + t + "']"), function() {
						if($(this).hasClass("icon-call")) {
							var ls = $(this).css("left");
							var l = parseInt(ls.substring(0, ls.indexOf("p")));
							l -= 14;
							$(this).css("left", l + "px");
						}
					});
					$(this).removeClass("hide");
				}
			});
		}
		if(!showM) {
			head.find("td:eq(3)").addClass("hide");
			$.each(data.find("tbody tr"), function() {
				if($(this).find("img[src='i/icon-maintenance.png']").length > 0) {
					$(this).addClass("hide");
				}
			});
			$.each($(".icon-maintenance"), function() {
				if(!$(this).hasClass("hide")) {
					$(this).addClass("hide");
					var t = $(this).attr("temp");
					$.each($(this).siblings("[temp='" + t + "']"), function() {
						var ls = $(this).css("left");
						var l = parseInt(ls.substring(0, ls.indexOf("p")));
						l += 14;
						$(this).css("left", l + "px");
					});
				}
			});
		} else {
			head.find("td:eq(3)").removeClass("hide");
			$.each($(".icon-maintenance"), function() {
				if($(this).hasClass("hide")) {
					var t = $(this).attr("temp");
					$.each($(this).siblings("[temp='" + t + "']"), function() {
						var ls = $(this).css("left");
						var l = parseInt(ls.substring(0, ls.indexOf("p")));
						l -= 14;
						$(this).css("left", l + "px");
					});
					$(this).removeClass("hide");
				}
			});
		}
		if(!showSC && !showR && !showM) {
			head.find("td:eq(4)").removeClass("hide");
		} else {
			head.find("td:eq(4)").addClass("hide");
		}
	});
	$("#add-building-page .add-btn").live("click", function() {
		var firstLi = $("#add-building-page .building-list li.first");
		firstLi.removeClass("first");
		$("#add-building-page .building-list ul").find(".delete").removeClass("delete");
		$("#add-building-page .building-list ul").find(".delete-prev").removeClass("delete-prev");
		$("#add-building-page .building-list ul").find(".highlight").removeClass("highlight");
		$("#add-building-page .building-list ul").find(".highlight-prev").removeClass("highlight-prev");
		firstLi.before('<li class="first highlight"><span class="name">Building12345</span><a href="javascript:;" data-role="none" class="delete-btn">DELETE</a><span class="confirm">Remove? <a href="javascript:;" data-role="none" class="yes-btn">YES</a> <span>|</span> <a href="javascript:;" data-role="none" class="no-btn">NO</a></span><div class="clear"></div></li>');
	});
	$("#add-building-page .building-list li").live("click", function() {
		$(this).parent("ul").find(".highlight").removeClass("highlight");
		$(this).parent("ul").find(".highlight-prev").removeClass("highlight-prev");
		$(this).prev().addClass("highlight-prev");
		$(this).addClass("highlight");
	});
	$("#add-building-page .building-list .delete-btn").live("click", function() {
		$(this).parents("ul").find(".delete").removeClass("delete");
		$(this).parents("ul").find(".delete-prev").removeClass("delete-prev");
		$(this).parents("li").addClass("delete");
		$(this).parents("li").prev().addClass("delete-prev");
	});
	$("#add-building-page .building-list .yes-btn").live("click", function() {
		var li = $(this).parents("li");
		if(li.hasClass("first")) {
			li.next().addClass("first");
		}
		if(li.hasClass("last")) {
			li.prev().addClass("last");
		}
		$(this).parents("ul").find(".delete-prev").removeClass("delete-prev");
		$(this).parents("ul").find(".highlight-prev").removeClass("highlight-prev");
		li.remove();
	});
	$("#add-building-page .building-list .no-btn").live("click", function() {
		$(this).parents("li").removeClass("delete");
		$(this).parents("li").prev().removeClass("delete-prev");
	});

	$("#sales-contact-info-page .view-nav li.first a").live("click", function() {
		$("#sales-contact-info-page .cancel-btn").trigger("click");
		$("#sales-contact-info-page .footer a").addClass("hide");
		$("#sales-contact-info-page .contact-info:eq(1)").addClass("hide");
		$("#sales-contact-info-page .contact-info:eq(0)").removeClass("hide");
	});
	$("#sales-contact-info-page .view-nav li.last a").live("click", function() {
		$("#sales-contact-info-page .footer .edit-btn").removeClass("hide");
		$("#sales-contact-info-page .contact-info:eq(0)").addClass("hide");
		$("#sales-contact-info-page .contact-info:eq(1)").removeClass("hide");
		if(!("onorientationchange" in window)) {
			$.each($("#sales-contact-info-page .contact-info:eq(1) .text, #sales-contact-info-page .contact-info:eq(1) .select"), function() {
				var li = $(this).parent();
				var pts = li.css("padding-left");
				var pt = parseInt(pts.substring(0, pts.indexOf("p")));
				var pbs = li.css("padding-right");
				var pb = parseInt(pbs.substring(0, pbs.indexOf("p")));
				padding = pt + pb;
				var w = $(this).parent().width() - $(this).siblings("label").width() - padding;
				if(!$(this).hasClass("tel") && !$(this).hasClass("tel-long")) {
					$(this).width(w);
				} else {
					w /= 7;
					$(this).width($(this).hasClass("tel-long") ? w * 2.5 : w * 2);
				}
			});
		}
	});
	$("#sales-contact-info-page .edit-btn").live("click", function() {
		$("#sales-contact-info-page .select-l").addClass("selectLabel");
		$("#sales-contact-info-page .contact-info .form-info").addClass("edit-mode");
		$("#sales-contact-info-page .header h1").html("Edit Info");
		$("#sales-contact-info-page .contact-info .data, #sales-contact-info-page .footer .edit-btn, #sales-contact-info-page .footer .done-btn").addClass("hide");
		$("#sales-contact-info-page .contact-info .form-element, #sales-contact-info-page .footer .cancel-btn, #sales-contact-info-page .footer .save-btn").removeClass("hide");
	});
	$("#sales-contact-info-page .cancel-btn").live("click", function() {
		$("#sales-contact-info-page .select-l").removeClass("selectLabel");
		$("#sales-contact-info-page .contact-info .form-info").removeClass("edit-mode");
		$("#sales-contact-info-page .contact-info .form-info li.error").removeClass("error");
		$("#sales-contact-info-page .header h1").html("Contact Info");
		$("#sales-contact-info-page .contact-info .form-element, #sales-contact-info-page .footer .cancel-btn, #sales-contact-info-page .footer .save-btn").addClass("hide");
		$("#sales-contact-info-page .contact-info .data, #sales-contact-info-page .footer .edit-btn, #sales-contact-info-page .footer .done-btn").removeClass("hide");
	});
	$("#sales-contact-info-page .save-btn").live("click", function() {
		$("#edit-city1, #edit-postal-code1").val("").parent().addClass("error");
	});
	var scrollTop = 0;
	$("#home-page").live("pagebeforehide", function() {
		scrollTop = $(window).scrollTop();
	});
	$("#open-calls-page, #completed-activities-page, #log-service-call-page, #performance-dashboard-page, #contact-otis-page, #settings-page").live("pageshow", function(e, ui) {
		var menu = $(this).find(".menu");
		if(!menu.hasClass("is")) {
			var myScroll = new iScroll(menu.get(0), { snap: "li", hScrollbar: false, vScrollbar: false, vScroll: false, bounce: false });
			var pageX;
			if($(this).attr("id") == "completed-activities-page") {
				myScroll.scrollToPage(1, 0, 1);
			}
			if($(this).attr("id") == "log-service-call-page") {
				myScroll.scrollToPage(2, 0, 1);
			}
			if($(this).attr("id") == "performance-dashboard-page") {
				myScroll.scrollToPage(3, 0, 1);
			}
			if($(this).attr("id") == "contact-otis-page") {
				myScroll.scrollToPage(4, 0, 1);
			}
			if($(this).attr("id") == "settings-page") {
				myScroll.scrollToPage(5, 0, 1);
			}
			menu.addClass("is");
		}
		$(".alpha, .popup").addClass("hide");
		if(menuStates[$(this).attr("id")] != $(this).find(".menu-btn").hasClass("active")) {
			$(this).find(".menu-btn").trigger("click");
		}
		if(ui.prevPage.attr("id") == "home-page") {
			var door = $(".door").clone();
			$(this).append(door);
			door.height($(this).height());
			door.find(".contentWrap").css("top", -scrollTop + "px");
			door.css("display", "block");
			door.find(".door-left, .lheader, .lfooter").animate({ "left": "-50%" }, 500, null, function() { door.remove() });
			door.find(".door-right, .rheader, .rfooter").animate({ "right": "-50%" }, 500);
		}
	});
	var peh, wrapWidth;
	$("#login-page").live("pageshow", function() {
		var slideSpeed = 400;
		if(peh == null) {
			peh = $("#password-expired").height() - 95;
		}
		wrapWidth = $("#login-page .login-wrapper").width();
		$("#password-expired, #forgot-password, #email-sent").width(wrapWidth - 32);
		$(".l-forgot").live("click", function() {
			$("#login-page .login-wrapper").css("min-height", peh + "px");
			$(this).addClass("hide");
			$(".login-box-wrapper").animate({ "left": "-" + wrapWidth + "px" }, slideSpeed);
			$("#password-expired").animate({ "margin-left": "-" + wrapWidth + "px" }, slideSpeed);
		});
		$("#password-expired .submit-btn").live("click", function() {
			$("#login-page .back-link").removeClass("hide");
			$("#password-expired").animate({ "margin-left": "-" + wrapWidth * 2 + "px" }, slideSpeed);
			$("#forgot-password").animate({ "margin-left": "-" + wrapWidth * 2 + "px" }, slideSpeed);
		});
		$("#login-page .back-link").live("click", function() {
			$("#login-page .login-wrapper").css("min-height", "0");
			$(this).addClass("hide");
			$("#login-page .l-forgot").removeClass("hide");
			$(".login-box-wrapper").animate({ "left": "0" }, slideSpeed);
			$("#forgot-password").animate({ "margin-left": "0" }, slideSpeed);
			$("#password-expired").css("margin-left", "0");
			$("#email-sent").animate({ "margin-left": "0" }, slideSpeed);
		});
		$("#forgot-password .reset-btn").live("click", function() {
			$("#login-page .login-wrapper").css("min-height", "0");
			$("#login-page .back-link").addClass("hide");
			$("#forgot-password").animate({ "margin-left": "-" + wrapWidth * 3 + "px" }, slideSpeed);
			$("#email-sent").animate({ "margin-left": "-" + wrapWidth * 3 + "px" }, slideSpeed);
		});
		$("#email-sent .back-btn").live("click", function() {
			$("#login-page .login-wrapper").css("min-height", "0");
			$("#login-page .l-forgot").removeClass("hide");
			$(".login-box-wrapper").animate({ "left": "0" }, slideSpeed);
			$("#password-expired").css("margin-left", "0");
			$("#forgot-password").css("margin-left", "0");
			$("#email-sent").animate({ "margin-left": "0" }, slideSpeed);
		});
	});
	$("#contract, #contract1").live("change", function() {
		var val = $(this).val();
		$(this).parents(".filter-content").prev().find("td:eq(1) span").html(val);
		var buildingVal = '<option>All</option>';
		if(dropdownValues[val]) {
			for(var i in dropdownValues[val]) {
				buildingVal += '<option>' + i + '</option>';
			}
		}
		$(this).parents("p").next().find("select").html(buildingVal).trigger("change");
	});
	$("#building, #building1").live("change", function() {
		var val = $(this).val();
		$(this).parents(".filter-content").prev().find("td:eq(2) span").html(val);
		var unitVal = '<option>All</option>';
		var ddv = dropdownValues[$(this).parents("p").prev().find("select").val()];
		if(ddv) {
			ddv = ddv[val];
			for(var i in ddv) {
				unitVal += '<option>' + ddv[i] + '</option>';
			}
		}
		$(this).parents("p").next().find("select").html(unitVal).trigger("change");
	});
	$("#unit, #unit1").live("change", function() {
		$(this).parents(".filter-content").prev().find("td:eq(3) span").html($(this).val());
	});
	$("div[data-role='page']").live('pageshow', function() {
		var header = $(this).find("div[data-role='header']");
		var content = $(this).find("div[data-role='content']");
		var footer = $(this).find("div[data-role='footer']");
		var mts = content.css("margin-top");
		var mt = parseInt(mts.substring(0, mts.indexOf("p")));
		var headerHeight = header.hasClass("login-header") ? header.outerHeight() + mt : header.outerHeight();
		var footerHeight = footer.length > 0 ? footer.outerHeight() : 0;
		$.each(content, function() {
			var pts = $(this).css("padding-top");
			var pt = parseInt(pts.substring(0, pts.indexOf("p")));
			var pbs = $(this).css("padding-bottom");
			var pb = parseInt(pbs.substring(0, pbs.indexOf("p")));
			var padding = pt + pb;
			if($(this).parent().parent().hasClass("contentWrap")) {
				padding += 39;
			}
			$(this).css("min-height", $(window).height() - headerHeight - footerHeight - padding + "px");
		});
		if(!("onorientationchange" in window)) {
			$("#settings-page fieldset:eq(0)").addClass("single-line");
			resizeForm();
		}
	});
	$("#home-page table a").live("click", function() {
		$("#door-sound").get(0).volume = 1;
		$("#door-sound").get(0).play();
	});
	var resizeForm = function() {
		$.each($(".contact-info .text, .contact-info .select"), function() {
			if(!$(this).hasClass("exclude")) {
				var li = $(this).parent();
				var pts = li.css("padding-left");
				var pt = parseInt(pts.substring(0, pts.indexOf("p")));
				var pbs = li.css("padding-right");
				var pb = parseInt(pbs.substring(0, pbs.indexOf("p")));
				padding = pt + pb;
				var w = $(this).parent().width() - $(this).siblings("label").width() - padding;
				if(!$(this).hasClass("tel") && !$(this).hasClass("tel-long")) {
					$(this).width($(this).attr("id") == "building-name-id" ? w - 20 : w);
				} else {
					w /= 7;
					$(this).width($(this).hasClass("tel-long") ? w * 2.5 : w * 2);
				}
			}
		});
		$.each($(".filter-content p .select"), function() {
			var p = $(this).parent();
			var pts = p.css("padding-left");
			var pt = parseInt(pts.substring(0, pts.indexOf("p")));
			var pbs = p.css("padding-right");
			var pb = parseInt(pbs.substring(0, pbs.indexOf("p")));
			padding = pt + pb;
			var w = $(this).parent().width() - $(this).siblings("label").width() - padding;
			$(this).width(w);
		});
	};
	if(!("onorientationchange" in window)) {
		$(window).bind("resize", function() {
			resizeForm();
			var header = $.mobile.activePage.find("div[data-role='header']");
			var content = $.mobile.activePage.find("div[data-role='content']");
			var footer = $.mobile.activePage.find("div[data-role='footer']");
			var mts = content.css("margin-top");
			var mt = parseInt(mts.substring(0, mts.indexOf("p")));
			var headerHeight = header.hasClass("login-header") ? header.outerHeight() + mt : header.outerHeight();
			var footerHeight = footer.length > 0 ? footer.outerHeight() : 0;
			$.each(content, function() {
				var pts = $(this).css("padding-top");
				var pt = parseInt(pts.substring(0, pts.indexOf("p")));
				var pbs = $(this).css("padding-bottom");
				var pb = parseInt(pbs.substring(0, pbs.indexOf("p")));
				var padding = pt + pb;
				if($(this).parent().parent().hasClass("contentWrap")) {
					padding += 39;
				}
				$(this).css("min-height", $(window).height() - headerHeight - footerHeight - padding + "px");
			});
			wrapWidth = $("#login-page .login-wrapper").width();
			$("#password-expired, #forgot-password, #email-sent").width(wrapWidth - 32);
		});
	}
	// lock orientation
	var checkOrientation = function() {
		if (window.orientation % 180 == 0){
			$("body").css("-webkit-transform-origin", "").css("-webkit-transform", "");
		}
		else {
			if (window.orientation > 0) {
				$("body").css("-webkit-transform-origin", "160px 160px").css("-webkit-transform",  "rotate(-90deg)");
			}
			else {
				$("body").css("-webkit-transform-origin", "240px 240px").css("-webkit-transform",  "rotate(90deg)");
			}
		}
	};
	//$(window).bind("onorientationchange" in window ? "orientationchange" : "resize", checkOrientation);
	setTimeout(function() {
		//checkOrientation();
	}, 100);
	// load json
	$.ajax({
		type: "GET",
		url: "data/data.json",
		contentType: "json",
		success: function(msg) {
			var openCalls = msg["open-calls"];
			var ocContent = "";
			for(var i in openCalls) {
				var d = openCalls[i];
				ocContent += '<tr><td>' + d["Building"] + '</td><td>' + d["Unit"] + '</td><td>' + d["Placed"] + '</td><td><a href="#open-call-detail-page-detail" data-role="none" class="btn-arrow">&gt;</a></td></tr>';
			}
			$("#open-calls-page .data-table tbody").html(ocContent);

			var completedActivities = msg["completed-activities"];
			var caContent = "";
			for(var i in completedActivities) {
				var d = completedActivities[i];
				var imgName;
				var linkName;
				switch(d["Event"]) {
					case "Service Call":
						imgName = "i/icon-sc.png";
						linkName = "#service-call-detail-page-detail";
						break;
					case "Repair":
						imgName = "i/icon-repair.png";
						linkName = "#repair-detail-page-detail";
						break;
					case "Maintenance":
						imgName = "i/icon-maintenance.png";
						linkName = "#maintenance-detail-page-detail";
						break;
					default:
						break;
				}
            	caContent += '<tr><td><img src="' + imgName + '" alt="" /></td><td>' + d["Date"] + '</td><td>' + d["Unit"] + '</td><td class="left-align">' + d["Event"] + '</td><td><a href="' + linkName + '" data-role="none" class="btn-arrow">&gt;</a></td></tr>';
			}
			$("#completed-activities-page .data-table tbody").html(caContent);

			var performanceDashboard = msg["performance-dashboard"];
			var pdContent = "";
			for(var i in performanceDashboard) {
				var d = performanceDashboard[i];
            	pdContent += '<tr><td class="btn"><a href="javascript:;" data-role="none" class="toggle-btn">+</a></td><td>' + d["Unit"] + '</td><td>' + d["Service Call"] + '</td><td>' + d["Main. Visit"] + '</td><td><span class="avail ' + (parseFloat(d["Avail"]) > 90 ? "high" : "low") + '">' + d["Avail"] + '</span></td><td><a href="#unit-details-page" data-role="none" class="btn-arrow">&gt;</a></td></tr><tr class="detail hide"><td></td><td colspan="4"><table><tbody><tr class="first"><th>Contract</th><th>Unit Type</th><th>Building</th></tr><tr><td>' + d["Contract"] + '</td><td>' + d["Unit Type"] + '</td><td>' + d["Building"] + '</td></tr><tr><th colspan="3">Sale Representative</th></tr><tr><td colspan="3"><a href="tel:' + d["Sale Representative"]["Telephone"].split(" ").join("") + '" data-role="none" class="phone">' + d["Sale Representative"]["Name"] + ' | ' + d["Sale Representative"]["Telephone"] + '</a></td></tr><tr><td colspan="3"><a href="mailto:' + d["Sale Representative"]["Email"] + '" data-role="none" class="email">' + d["Sale Representative"]["Email"] + '</a></td></tr><tr class="last"><td colspan="3"><a href="#log-service-call-page" class="gray-btn" data-role="none">Log Service Call</a></td></tr></tbody></table></td><td></td></tr>';
			}
			$("#performance-dashboard-page .data-table:eq(0) tbody").html(pdContent);

			var unitDetails = msg["unit-details"];
			var udContent = "";
			for(var i in unitDetails) {
				var d = unitDetails[i];
				var imgName;
				var linkName;
				switch(d["Event"]) {
					case "Service Call":
						imgName = "i/icon-sc.png";
						linkName = "#service-call-detail-page-detail?from=pd";
						break;
					case "Repair":
						imgName = "i/icon-repair.png";
						linkName = "#repair-detail-page-detail?from=pd";
						break;
					case "Maintenance":
						imgName = "i/icon-maintenance.png";
						linkName = "#maintenance-detail-page-detail?from=pd";
						break;
					default:
						break;
				}
            	udContent += '<tr><td><img src="' + imgName + '" alt="" /></td><td>' + d["Date"] + '</td><td>' + d["Unit"] + '</td><td class="left-align">' + d["Event"] + '</td><td><a href="' + linkName + '" data-role="none" class="btn-arrow">&gt;</a></td></tr>';
			}
			$("#unit-details-page .data-table.event-view tbody").html(udContent);
		}
	})
});