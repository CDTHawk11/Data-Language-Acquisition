// This function gets all the text in browser
function getText() {
    return document.body.innerText;
}

// Get the saved limit of translation that has been configured through slider
// and saved within user's computer.
var tranLimit = 10;
chrome.storage.sync.get("TRAN_LIMIT", function (limit) {
	if(limit["TRAN_LIMIT"]) {
		tranLimit = parseInt(limit["TRAN_LIMIT"]);
	}
	
	var allText = getText(); // stores into browser text into variable
	var words = allText.match((/\b[a-zA-Z]+\b/g)); // filter all text to only words
	
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

	// orders words from most occurring to least
	var counts_new = [];
	for (var key in counts)
	    counts_new.push([key, counts[key]]);
	counts_new.sort(function (a, b) {
	    return b[1] - a[1]
	});

	console.log(counts_new);

	var arrays_to = counts_new.splice(0, 4); // four most occurring words
												// (temporary)

	// Extracts the most frequently occurring words from the arrays_to dictionary and places them in a list
	words_to = [];
	for (var key in arrays_to)
	    words_to.push([arrays_to[key][0]]);
	var to_Translate = [].concat.apply([], words_to);

//Regex for finding sentences:
//Website I pulled regex from: https://www.sitepoint.com/community/t/choose-whole-sentences-and-only-whole-sentences-reliably-with-regex/8075/16	

	//var rx=/["'“]?(un-Z[.?!]+["']?\s+["']?[un-Z]).))(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!]['"]?\s+["']?[un-Z]).))?)((?![.?!]["']?\s+["']?[un-Z]).)[.?!]+["'”]?+/g,
	
		
	str="Hello, my name is Lance.  How are you? I am in the F.B.I." 

	//This works but includes the first two sentences as one sentence:	
	
	//var res= str.match( /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g );	
		
	var res= allText.match( /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g );
	
	//This also works: var result = str.match( /[^\.!\?]+[\.!\?]+/g ); but messes up on FBI
	
	//I cannot get this regex code to work.  I am getting a regex error:
	//var res= str.match(/["'“]?(un-Z[.?!]+["']?\s+["']?[un-Z]).))(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!]['"]?\s+["']?[un-Z]).))?)((?![.?!]["']?\s+["']?[un-Z]).)[.?!]+["'”]?/);

	
	console.log(res)

	// packaging list of words to be translated in JSON for transfer to background
	// scripts
	var json_to_Translate = JSON.stringify(to_Translate),
	        json_parse = JSON.parse(json_to_Translate);

	console.log(json_parse);

	chrome.runtime.sendMessage({json_parse}, function(response) {  
	    replaceText(response.merged_words);
	});
});

function replaceText(jsonArr) {
	$("body *").textFinder(function() {
		for (var key in jsonArr) {
			
			var matcher = new RegExp('\\b' + key + '\\b', "gi");
			//var replacer = jsonArr[key].split(" ");
			this.data = this.data.replace(matcher, jsonArr[key]);
			
		}
	});
}

// jQuery plugin to find and replace text
jQuery.fn.textFinder = function( fn ) {
    this.contents().each( scan );
    // callback function to scan through the child nodes recursively
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
