// This function gets all the text in browser
function getText() {
    return document.body.innerText;
}

var str = getText(); //stores into browser text into variable
var words = str.split(" "); //make a list of the words
//console.log(words);

var counts = [];

//counts number of words
for (var i = 0; i < words.length; i++) {
    var num = words[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
}

console.log(counts);

var unique_numbers = Object.keys(counts).length; //number unique words that appear on page

console.log(unique_numbers); 

//orders words from most occuring to least
var counts_new = [];
for (var key in counts)
    counts_new.push([key, counts[key]]);
counts_new.sort(function (a, b) {
    return b[1] - a[1]
});

console.log(counts_new);

var arrays_to = counts_new.splice(0, 4); //four most occuring words (temporary)

//Extracts most words from the dictionary and places them in a list
words_to = [];
for (var key in arrays_to)
    words_to.push([arrays_to[key][0]]);
var to_Translate = [].concat.apply([], words_to);

console.log(to_Translate);

//packaging list of words to be translated in JSON for transfer to background scripts
var json_to_Translate = JSON.stringify(to_Translate),
        json_parse = JSON.parse(json_to_Translate);

console.log(json_parse);

//$.ajax({
//    type: "POST",
//    url: "ajax/count.php",
//    data: { words_for_translation: json_parse },
//    dataType: 'json',
//    success: function(data){
//    
//    }
//});

//$.getJSON( "/url", {params }, function( data, status, xhr ) {
//    $.each(data.response, function(resKey, resValue){
//        if(resKey == "success"){
//             var _result = JSON.parse(resValue);
//        }
//    }
//}

chrome.runtime.sendMessage({json_parse}, function(response) {  
    alert(JSON.stringify(response.merged_words));
});

/*

wordDict = {"the": "piano", "and": "Hello", "a": "huh?"};

//$('body *').each(function (){
//    $(this).text();
//});

var items = document.getElementsByTagName("*");
console.log(items);
for (var i = 0; i < items.length; i++) {
    if (items[i].innerText && items[i].innerText != "") {
        for (word in wordDict) {
            items[i].innerText = items[i].innerText.replace(new RegExp('\\b' + word + '\\b', "gi"), wordDict[word]);
        }
    }else{
        console.log("complete");
    }
}

//for (word in wordDict) {
//    document.body.innerText = document.body.innerText.replace(new RegExp('\\b' + word + '\\b',"gi"), wordDict[word]);
//    document.body.innerText = document.body.innerText.replace(word,"gi"), wordDict[word])
//};

*/