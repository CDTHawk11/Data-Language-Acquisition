$(document).ready(function() {
	$("#completeSetup").click(function() {
		if($("#occupation option:selected").val() === "") {
			$("#occupation").addClass("errorSelect");
			return false;
		}
		if($("#current option:selected").val() === "") {
			$("#current").addClass("errorSelect");
			return false;
		}
		if($("#target option:selected").val() === "") {
			$("#target").addClass("errorSelect");
			return false;
		}
		if($("#difficulty option:selected").val() === "") {
			$("#difficulty").addClass("errorSelect");
			return false;
		}

		window.open("http://spkeasy.weebly.com/help-page.html");

		var array = $("#userProfileForm").serializeArray();
		var jsonParameter = {};
		
		jQuery.each(array, function() {
			jsonParameter[this.name] = this.value || '';
	    });

		$.ajax({
			url : "http://localhost:8080/translator/rest/user/save",
			type : "POST",
	        data: JSON.stringify(jsonParameter),
	        contentType: "application/json",
	        headers: {"Accept": "application/json"},
			success: function(result, status, xhr) {
				if(result["message"] && result["message"] == "done") {
					window.close();
				}
			},
			error: function (xhr, status, errorMsg) {
	            alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
	        }
		});
	});

	$("#occupation").change(function() {
		$("#occupation").removeClass("errorSelect");
	});

	$("#current").change(function() {
		$("#current").removeClass("errorSelect");
	});

	$("#email").change(function() {
		$("#email").css("border-color", "#00b3b3");
	});

});