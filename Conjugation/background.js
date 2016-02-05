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
        url: "http://ec2-52-35-34-105.us-west-2.compute.amazonaws.com:8080/translator/rest/trans/es",
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
