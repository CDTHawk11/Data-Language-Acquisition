
chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            var deferred = $.Deferred();

            translate(request.to_Translate, deferred);

            deferred.done(function (translation) {
                sendResponse({translated_words: translation});
            });

            return true;
        });

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
                    dfrd.resolve(JSON.stringify(translated));
                }
            },
            error: function (xhr, status, errorMsg) {
                alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
            }

        });
    }
}

