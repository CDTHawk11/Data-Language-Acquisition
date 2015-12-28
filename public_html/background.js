
chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

            var my_Key = "AIzaSyDGcpNr1_IzF5aEeS5TIF8Sf7NFpBBtjf8"
            var orignal_text = request.to_Translate;
            
            $.ajax({
                type: "GET",
                url: "https://www.googleapis.com/language/translate/v2?",
                data: {key: my_Key, source: "en", target: "fr", q: orignal_text},
                dataType: 'json',
                success: function (result, status, xhr) {
                    alert(result.data.translations[0].translatedText);
                },
                error: function (xhr, status, errorMsg) {
                    alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
                }
            });
        });
