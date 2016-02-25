$(document).ready(function() {
	$("#next").click(function() {
		if($("#email").val() === "") {
			$("#email").css("border-color", "red");
			return false;
		}
		if($("#occupation option:selected").val() === "") {
			$("#occupation").addClass("errorSelect");
			return false;
		}
		$("#page1").hide("slide", { direction: "left" }, 400);
		$("#page2").show("slide", { direction: "right" }, 400);
	});

	$("#completeSetup").click(function() {
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

		var array = $("#userProfileForm").serializeArray();
		var jsonParameter = {};
		
		jQuery.each(array, function() {
			jsonParameter[this.name] = this.value || '';
	    });
		
		$.ajax({
			url : "http://ec2-52-35-34-105.us-west-2.compute.amazonaws.com:8080/translator/rest/user/save",
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

	$("#email").change(function() {
		$("#email").css("border-color", "#00b3b3");
	});

});