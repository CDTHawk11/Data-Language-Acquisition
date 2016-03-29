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
		            width: 500,
		            height: 575,
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch(request.type) {
	    case "translation":
	        return getTranslations(request.requestObj, sender, sendResponse);
        case "tts":
            speakTranslation(request.requestObj);
        break;
    }
});

function speakTranslation(text) {
    chrome.storage.sync.get("TRAN_VOICE", function (obj) {
    	console.log(obj["TRAN_VOICE"]);
        chrome.tts.speak(text,
	    {
        	voiceName: obj["TRAN_VOICE"],
	    	rate: 0.8,
	    	pitch: 1.3
	    });
    });
}

function getTranslations(request, sender, sendResponse) {

    var deferred = $.Deferred();
    translate(request.json_parse, deferred);
    deferred.done(function (merged) {
        chrome.storage.sync.get("SPKESY_TRAN", function (obj) {
        	if (!(obj["SPKESY_TRAN"]) || obj["SPKESY_TRAN"] === "") {
        		chrome.storage.sync.set({"SPKESY_TRAN":"ON"}, function() {
        		});
                sendResponse({merged_words: merged});
        	} else if (obj["SPKESY_TRAN"] === "ON") {
        		sendResponse({merged_words: merged});
        	} else if (obj["SPKESY_TRAN"] === "OFF") {
        		return false;
        	}    
        });
    });

    return true;
}

function translate(original_text, dfrd) {
	var jsonParameter = {};
	
    chrome.storage.sync.get("TRAN_USER_EMAIL", function (emailObj) {
    	if (!(emailObj["TRAN_USER_EMAIL"]) || emailObj["TRAN_USER_EMAIL"] == "") {
    		return false;
    	} else {
    		userEmail = emailObj["TRAN_USER_EMAIL"];
    		jsonParameter = {"q":original_text, "email":userEmail};
    	}
    });
    
	var targetURL = "http://ec2-52-35-34-105.us-west-2.compute.amazonaws.com:8080/translator/rest/trans/";
	
    chrome.storage.sync.get("TRAN_TARGET", function (obj) {
    	if (!(obj["TRAN_TARGET"]) || obj["TRAN_TARGET"] == "") {
    		return false;
    	} else {
    		targetURL = targetURL + obj["TRAN_TARGET"];
    		
    		setVoice(obj["TRAN_TARGET"]);

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
    	            console.log(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
    	        }
    	    });
    	}
    });	
}

function setVoice(targetLang) {
	chrome.tts.getVoices(function(voices) {
		var voice = "native";
		for (i in voices) {
	        if(voices[i].lang && voices[i].lang.search(targetLang) > -1) {
	        	voice = voices[i].voiceName;
	    		break;
	        }
	     }
				
		chrome.storage.sync.set({"TRAN_VOICE":voice}, function() {
		});
	});
}