$(document).ready(function() {

	var tranLimit = "10%";

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
			range : "min",
			min : 0,
			value : parseInt(tranLimit),
			max : 100,
			animate : true,
			slide : function(event, ui) {
				$("#progress").val(ui.value + "%");
			},
			change : function(event, ui) {
				var translationLimit = $("#progress").val();
				chrome.storage.sync.set({
					'TRAN_LIMIT' : translationLimit
				}, function() {
				});
			}
		});

		$("#progress").val($("#application-progress").slider("value") + "%");

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