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
		                //url: "http://localhost:9080/langacquisitionapp/rest/user/register",
		                url: "http://ec2-52-34-38-44.us-west-2.compute.amazonaws.com:9080/langacquisitionapp/rest/user/register",
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
    	var learnedWords = merged.LearnedWordCount;
    	var learningWords = merged.LearningWordCount;
		chrome.storage.sync.set({"SPKESY_LRND":learnedWords}, function() {
		});
		chrome.storage.sync.set({"SPKESY_LRNG":learningWords}, function() {
		});
    	delete merged.LearnedWordCount;
    	delete merged.LearningWordCount;
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
	//var targetURL = "http://localhost:9080/langacquisitionapp/rest/trans/";
	var targetURL = "http://ec2-52-34-38-44.us-west-2.compute.amazonaws.com:9080/langacquisitionapp/rest/trans/";
	var tran_data = ["TRAN_TARGET", "TRAN_LIMIT", "TRAN_USER_EMAIL"];
	
    chrome.storage.sync.get(tran_data, function (obj) {
    	var tran_target_lang = obj["TRAN_TARGET"];
    	var tran_user_email = obj["TRAN_USER_EMAIL"];
    	var tran_immersion_limit = obj["TRAN_LIMIT"];

    	if (!tran_target_lang || !tran_user_email || tran_target_lang === "" || tran_user_email === "") {
    		return false;
    	} else {
    		targetURL = targetURL + tran_target_lang;
    		
    		setVoice(tran_target_lang);

    		var sourceLang;
    		chrome.tabs.getSelected(null, function(tab) {
    			  chrome.tabs.detectLanguage(tab.id, function(language) {
    		    		console.log(language);
    				  	jsonParameter = {"q":original_text, "email":tran_user_email, "sourceLang":language, "tranLimit":tran_immersion_limit};
 
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
    			  });
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