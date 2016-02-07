$(document).ready(function() {
	
	chrome.storage.sync.get("TRAN_TARGET", function(target) {
		if (!(target["TRAN_TARGET"])) {
			$("#languageDiv #firstInstallLabel").css("display", "block");
			$("#languageDiv #regularLabel").css("display", "none");
		} else {
			$("#languageDiv #firstInstallLabel").css("display", "none");
			$("#languageDiv #regularLabel").css("display", "block");
			$("#target").val(target["TRAN_TARGET"]);
		}
	});

	// Save the selected target language on user's PC
	$("#target").change(function() {
		chrome.storage.sync.set({
				'TRAN_TARGET' : $("#target option:selected").val()
			}, function() {
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
});