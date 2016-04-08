$(document).ready(function() {

	var tranLimit = 5;

	chrome.storage.sync.get("TRAN_LIMIT", function(limit) {

		if (!(limit["TRAN_LIMIT"])) {
			chrome.storage.sync.set({
				'TRAN_LIMIT' : tranLimit
			}, function() {
			});
		} else {
			tranLimit = limit["TRAN_LIMIT"];
		}

		$('#application-progress').slider({
			step : 15,
			min : 5,
			value : tranLimit,
			max : 35,
			animate : true,
			slide : function(event, ui) {
				$("#progress").val(ui.value);
				var translationLimit = $("#progress").val();
				chrome.storage.sync.set({
					'TRAN_LIMIT' : translationLimit
				}, function() {
				});
			},
		});

		$("#progress").val($("#application-progress").slider("value"));

	});

    chrome.storage.sync.get("SPKESY_LRND", function (obj) {
		if (!obj["SPKESY_LRND"] || obj["SPKESY_LRND"] == "") {
			$("#wordsLearned").val(0);
		} else {
			$("#wordsLearned").val(obj["SPKESY_LRND"]);
		}
    });

    chrome.storage.sync.get("SPKESY_LRNG", function (obj) {
		if (!obj["SPKESY_LRNG"] || obj["SPKESY_LRNG"] == "") {
			$("#wordsLearning").val(0);
		} else {
			$("#wordsLearning").val(obj["SPKESY_LRNG"]);
		}
    });

    chrome.storage.sync.get("TRAN_TARGET", function (obj) {
		if (!obj["TRAN_TARGET"] || obj["TRAN_TARGET"] == "") {
			$("#setupTarget").css("display", "block");
			$("#regularTarget").css("display", "none");
		} else {
			$("#setupTarget").css("display", "none");
			$("#regularTarget").css("display", "block");
			$("#target").val(obj["TRAN_TARGET"]);
		}
    });

    chrome.storage.sync.get("TRAN_LEVEL", function (obj) {
		if (!obj["TRAN_LEVEL"] || obj["TRAN_LEVEL"] == "") {
			$("#setupLevel").css("display", "block");
			$("#regularLevel").css("display", "none");
		} else {
			$("#setupLevel").css("display", "none");
			$("#regularLevel").css("display", "block");
			$("#difficulty").val(obj["TRAN_LEVEL"]);
		}
    });
	
    chrome.storage.sync.get("SPKESY_TRAN", function (obj) {
    	if (!obj["SPKESY_TRAN"] || obj["SPKESY_TRAN"] === "") {
    		chrome.storage.sync.set({"SPKESY_TRAN":"ON"}, function() {
    		});
			$("#on").css("display", "block");
			$("#off").css("display", "none");
		} else if (obj["SPKESY_TRAN"] && obj["SPKESY_TRAN"] === "ON") {
			$("#on").css("display", "block");
			$("#off").css("display", "none");
		} else if (obj["SPKESY_TRAN"] && obj["SPKESY_TRAN"] === "OFF") {
			$("#off").css("display", "block");
			$("#on").css("display", "none");
		}
    });
	
	// Save the selected target language on user's PC
	$("#target").change(function() {
		chrome.storage.sync.set({"TRAN_TARGET":$("#target option:selected").val()}, function() {
		});
	});

	$("#difficulty").change(function() {
		chrome.storage.sync.set({"TRAN_LEVEL":$("#difficulty option:selected").val()}, function() {
		});
	});

	// Attach a submit handler to feedback form
	$('#checkProgress').click(function(event) {
		
		event.preventDefault();
				
	    chrome.storage.sync.get("TRAN_USER_EMAIL", function (obj) {
	    	var tran_user_email = obj["TRAN_USER_EMAIL"];
		    chrome.storage.sync.get("TRAN_TARGET", function (obj) {
		    	var tran_target_lang = obj["TRAN_TARGET"];
				var jsonParameter = {"email":tran_user_email};
				var targetURL = "http://localhost:8080/translator/rest/view/progress/" + tran_target_lang;

				$.ajax({
					url : targetURL,
					type : "POST",
			        data: JSON.stringify(jsonParameter),
			        contentType: "application/json",
			        headers: {"Accept": "application/json"},
					success: function(result, status, xhr) {
						$("#languageDiv").hide("slide", { direction: "left" }, 400);
					    $("#feedbackDiv").show("slide", { direction: "right" }, 400);
					    $("#feedbackDiv").html(result);
					   
					},
					error: function (xhr, status, errorMsg) {
			            alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
			        }
				});
		    });
	    });
	});

	$("#feedbackButton").click(function() {
		$.ajax({
			url : "http://localhost:8080/translator/rest/view/survey",
			type : "GET",
			success: function(result, status, xhr) {
				$("#languageDiv").hide("slide", { direction: "left" }, 400);
			    $("#feedbackDiv").show("slide", { direction: "right" }, 400);
			    $("#feedbackDiv").html(result);
			},
			error: function (xhr, status, errorMsg) {
	            alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
	        }
		});
	});
	
	$("#off").click(function() {
		$("#off").hide();
	    $("#on").show();
		chrome.storage.sync.set({"SPKESY_TRAN":"ON"}, function() {
		});
	});
	
	$("#on").click(function() {
		$("#on").hide();
	    $("#off").show();
		chrome.storage.sync.set({"SPKESY_TRAN":"OFF"}, function() {
		});
	});
	
	$("#help").click(function() {
		window.open("http://spkeasy.weebly.com/help-page.html","_blank");
	});
	
	$("#facebook").click(function() {
		window.open("http://facebook.com/speakeasylanguagelearning","_blank");
	});

	$("#twitter").click(function() {
		window.open("http://twitter.com/speakeasyell","_blank");
	});

	$(".difficultyDescription").tooltip({
	      position: {
	          my: "center bottom-15",
	          at: "center top",
	          using: function( position, feedback ) {
	            $( this ).css( position );
	            $( "<div>" )
	              .addClass( "arrow" )
	              .addClass( feedback.vertical )
	              .addClass( feedback.horizontal )
	              .appendTo( this );
	          	}
	        }
		});
});