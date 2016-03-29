$(document).ready(function() {
	// Save the selected source language on user's PC
	$("#current").change(function() {
		$("#current").removeClass("errorSelect");
		chrome.storage.sync.set({"TRAN_SOURCE":$("#current option:selected").val()}, function() {
		});
	});

	// Save the selected target language on user's PC
	$("#target").change(function() {
		$("#target").removeClass("errorSelect");
		chrome.storage.sync.set({"TRAN_TARGET":$("#target option:selected").val()}, function() {
		});
	});

	// Save the selected target language on user's PC
	$("#difficulty").change(function() {
		$("#difficulty").removeClass("errorSelect");
		chrome.storage.sync.set({"TRAN_LEVEL":$("#difficulty option:selected").val()}, function() {
		});
	});

	// Save the Email ID on user's PC
	$("#next").click(function() {
		if($("#email").val() === "") {
			$("#email").css("border-color", "red");
			return false;
		}
		chrome.storage.sync.set({"TRAN_USER_EMAIL":$("#email").val()}, function() {
		});
		$("#page1").fadeOut(1000);
		$("#page2").fadeIn(1000);
	});

});
