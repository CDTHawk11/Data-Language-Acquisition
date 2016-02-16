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
		$("#page1").animate({width:'toggle'},300);
	    $("#page2").animate({width:'toggle'},300);
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
	});

	$("#occupation").change(function() {
		$("#occupation").removeClass("errorSelect");
	});

	$("#email").change(function() {
		$("#email").css("border-color", "#00b3b3");
	});

});

function closeWindow(form) {
	form.submit();
	//window.close();
}