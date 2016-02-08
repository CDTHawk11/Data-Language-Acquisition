// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install") {
    	chrome.storage.sync.remove("TRAN_TARGET", function() {
    		chrome.windows.getCurrent(function(win) {
    			var leftPos = win.left + win.width - 450;
    			var topPos = win.top + 70;
        		window.open("popup.html", "Speak Easy", "width=425,height=150,left="+leftPos+",top="+topPos+",menubar=no,toolbar=no,titlebar=no,status=no,scrollbars=yes,resizable=no");
    		});
    	});
    } else if(details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            var deferred = $.Deferred();
            translate(request.json_parse, deferred);
            deferred.done(function (merged) {
                sendResponse({merged_words: merged});
            });

            return true;
        });

function translate(original_text, dfrd) {
	var jsonParameter = {"q":original_text};
	var targetURL = "http://ec2-52-35-34-105.us-west-2.compute.amazonaws.com:8080/translator/rest/trans/";
	
	chrome.storage.sync.get("TRAN_TARGET", function(target) {
		if (!(target["TRAN_TARGET"]) || target["TRAN_TARGET"] == "") {
			return false;
		} else {
			targetURL = targetURL + target["TRAN_TARGET"];

		    $.ajax({
		        type: "POST",
		        url: targetURL,
		        data: JSON.stringify(jsonParameter),
		        contentType: "application/json",
		        headers: {"Accept": "application/json"},
		        dataType: "json",
		        success: function (result, status, xhr) {
		               dfrd.resolve(result);
		        },
		        error: function (xhr, status, errorMsg) {
		            alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
		        }

		    });
		}
	});
	
}
