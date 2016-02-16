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
});