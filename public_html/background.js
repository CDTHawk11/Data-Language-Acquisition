// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
	chrome.windows.getCurrent(function(win) {
		if (details.reason == "install") {
			var tran_data = ["TRAN_TARGET", "TRAN_LEVEL"];
			chrome.storage.sync.remove(tran_data, function() {
				var leftPos = win.left + win.width - 635;
				var topPos = win.top + 70;
		        chrome.windows.create({
		            type: "popup",
		            width: 610,
		            height: 440,
		            top: topPos,
		            left: leftPos,
		            focused: true
		        }, function(window) {
		        	chrome.tabs.create({
		                url: "http://ec2-52-35-34-105.us-west-2.compute.amazonaws.com:8080/translator/rest/user/profile",
		                windowId: window.id
		            });
		        });
			});
	    } else if(details.reason == "update") {
	        var thisVersion = chrome.runtime.getManifest().version;
	        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
	    }
	});    		
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
	
    chrome.storage.sync.get("TRAN_TARGET", function (obj) {
    	if (!(obj["TRAN_TARGET"]) || obj["TRAN_TARGET"] == "") {
    		return false;
    	} else {
    		targetURL = targetURL + obj["TRAN_TARGET"];

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