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

	$('#feedbackForm').submit(function(event) {
		event.preventDefault();
		$.ajax({
			url : "http://ec2-52-35-34-105.us-west-2.compute.amazonaws.com:8080/translator/rest/submit/feedback",
			type : "POST",
			contentType: "application/x-www-form-urlencoded",
			data : $('#feedbackForm').serialize(),
			success : function(result, status, xhr) {
				alert(result);
				$('#feedbackDiv').html(result);
			}
		});
	});
});

function disappear(event){
	  
	event.preventDefault();
	  
	document.GetElementsByClassName("question").innerHTML="<p>Thanks you!</p>";
		  
	return false;	  
	 };