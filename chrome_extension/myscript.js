// This function gets all the text in browser
function getText() {
    return document.body.innerText;
}

var str = getText(); // stores into browser text into variable
var words = str.split(" "); // make a list of the words
// console.log(words);

var counts = [];

// counts number of words
for (var i = 0; i < words.length; i++) {
    var num = words[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
}

console.log(counts);

var unique_numbers = Object.keys(counts).length; // number unique words that
													// appear on page

console.log(unique_numbers); 

// orders words from most occuring to least
var counts_new = [];
for (var key in counts)
    counts_new.push([key, counts[key]]);
counts_new.sort(function (a, b) {
    return b[1] - a[1]
});

console.log(counts_new);

var arrays_to = counts_new.splice(0, 4); // four most occuring words
											// (temporary)

// Extracts most words from the dictionary and places them in a list
words_to = [];
for (var key in arrays_to)
    words_to.push([arrays_to[key][0]]);
var to_Translate = [].concat.apply([], words_to);

console.log(to_Translate);

// packaging list of words to be translated in JSON for transfer to background
// scripts
var json_to_Translate = JSON.stringify(to_Translate),
        json_parse = JSON.parse(json_to_Translate);

console.log(json_parse);

chrome.runtime.sendMessage({json_parse}, function(response) {  
    alert(response.merged_words);
    replaceText(JSON.parse(response.merged_words));
});

jQuery.fn.textFinder = function( fn ) {
    this.contents().each( scan );
    
    function scan() {
        var node = this.nodeName.toLowerCase();
        if( node === '#text' ) {
            fn.call( this );
        } else if( this.nodeType === 1 && this.childNodes && this.childNodes[0] && node !== 'script' && node !== 'textarea' ) {
            $(this).contents().each( scan );
        }
    }
    return this;
};

function replaceText(jsonArr) {
	$("body *").textFinder(function() {
		for (var key in jsonArr) {
			var matcher = new RegExp('\\b' + key + '\\b', "gi");
		    this.data = this.data.replace(matcher, jsonArr[key]);
		}
	});
}