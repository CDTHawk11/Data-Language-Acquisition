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
    $.ajax({
        type: "POST",
        url: "http://ec2-52-11-228-170.us-west-2.compute.amazonaws.com:8080/translator/rest/trans/es",
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
/*
function translate(original_text, dfrd) {
    
    var my_Key = "AIzaSyDGcpNr1_IzF5aEeS5TIF8Sf7NFpBBtjf8";
    var translated = [];

    for (word in original_text) {
        
        $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/language/translate/v2?",
            data: {key: my_Key, source: "en", target: "es", q: original_text[word]},
            dataType: 'json',
            success: function (result, status, xhr) {
                translated.push(result.data.translations[0].translatedText);

                if (translated.length === original_text.length) {
                    var merged = {};
                    for (word in original_text) {
                        merged[original_text[word]] = translated[word];
                    }
                    
                    dfrd.resolve(JSON.stringify(merged));
                }
            },
            error: function (xhr, status, errorMsg) {
                alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
            }

        });
    }
}
*/