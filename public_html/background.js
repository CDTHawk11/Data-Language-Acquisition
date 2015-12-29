chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            var my_Key = "AIzaSyDGcpNr1_IzF5aEeS5TIF8Sf7NFpBBtjf8";
            var original_text = request.to_Translate;
            
            for (word in original_text) {
                $.ajax({
                    type: "GET",
                    url: "https://www.googleapis.com/language/translate/v2?",
                    data: {key: my_Key, source: "en", target: "es", q: original_text[word]},
                    dataType: 'json',
                    success: function (result, status, xhr) {
                        alert(result.data.translations[0].translatedText);
                    },
                    error: function (xhr, status, errorMsg) {
                        alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
                    }
                });
            };
        });
       
        