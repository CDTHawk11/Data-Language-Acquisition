$(document).ready(function() {
	
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
	$('#feedbackForm').submit(function(event) {
		
		event.preventDefault();
		
		var array = $(this).serializeArray();
		var jsonParameter = {};
		
		jQuery.each(array, function() {
			jsonParameter[this.name] = this.value || '';
	    });
		
		$.ajax({
			url : "http://ec2-52-35-34-105.us-west-2.compute.amazonaws.com:8080/translator/rest/submit/feedback",
			type : "POST",
	        data: JSON.stringify(jsonParameter),
	        contentType: "application/json",
	        headers: {"Accept": "application/json"},
			success: function(result, status, xhr) {
				$("#feedbackDiv").html(result['message']);
			},
			error: function (xhr, status, errorMsg) {
	            alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
	        }
		});
	});

	$("#feedbackButton").click(function() {
		$("#languageDiv").hide("slide", { direction: "left" }, 400);
	    $("#feedbackDiv").show("slide", { direction: "right" }, 400);
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