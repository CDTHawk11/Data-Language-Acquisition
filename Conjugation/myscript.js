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

	//console.log(counts);

	var unique_numbers = Object.keys(counts).length; // number unique words that
														// appear on page

	//console.log(unique_numbers); 

	// orders words from most occurring to least
	var counts_new = [];
	for (var key in counts)
	    counts_new.push([key, counts[key]]);
	counts_new.sort(function (a, b) {
	    return b[1] - a[1]
	});

	//console.log(counts_new);

	var arrays_to = counts_new.splice(0, 5); // four most occurring words
												// (temporary)

	// Extracts the most frequently occurring words from the arrays_to dictionary and places them in a list
	words_to = [];
	for (var key in arrays_to)
	    words_to.push([arrays_to[key][0]]);
	var to_Translate = [].concat.apply([], words_to);

    
	//CONJUGATION CODE:
	
	
	//Regex for finding sentences:

	var result1= allText.match( /["']?[A-Z][^.?!]+((?![.?!]['"]?\s\n["']?[A-Z][^.?!]).)+[.?!'"]+/g );
	
	var res_split=[];
	
	//Regex for creating variables based upon line breaks:
	
	for (i in result1) {
	    res_split.push(result1[i].split(/(\r\n|\n|\r)/gm));
	};
		
	cleanArray=[];
	
	//Clean-up excess spaces and line breaks:
	
	for (i in res_split) {
		for (t in res_split[i]) {
			res_split[i][t]=res_split[i][t].replace(/(\r\n|\n|\r)/gm,"")
			if (res_split[i][t]) {
		       	cleanArray.push(res_split[i][t]);
		      }		
		};
	};
	
	//console.log(cleanArray);
	
	for (i in cleanArray){
		cleanArray[i]=cleanArray[i].split(/\s+/);
	};
	
	//console.log(cleanArray);

	var mergedConsPlus=[];

loop1:	
	for (i in cleanArray){
loop2:
		t=0;
		for (t; t<=cleanArray[i].length; t++){
			var conjugs=[];
			var z=0
			var x=0
			var mergedCons=[];
loop3:
			for (word in to_Translate){
				if (cleanArray[i][t]===to_Translate[word]){
					var limit=cleanArray[i].length-1;
					if (t < limit){
						t=parseInt(t);
						var a=t+1;
						var conjugsPlus=[];
loop4:						
						for (a; a<=limit; a++){
loop5:
							for (w in to_Translate){
								if (to_Translate[w]===cleanArray[i][a]){
									z=z+1;
								};
							};	
							if(z>x){
								x=x+1;
							} else {break loop4;}
						conjugsPlus.push(cleanArray[i][a]);
						};
					};	
				};					
			};
		if (z>0){
			conjugs.push(cleanArray[i][t]);
			conjugs.push(conjugsPlus);
			mergedCons = [].concat.apply([], conjugs);
			mergedConsPlus.push(mergedCons)
			if (a<limit){
				t=a+1;
				}
			}
		};
	};
	
	//Array consisting of all collections that require conjugation:
	console.log("mergedConsPlus.. " + mergedConsPlus);

	
	//CONJUGATION CODE END
	
	
	// packaging list of words to be translated in JSON for transfer to background scripts
	
	forTranslation=[];
	forTranslation=mergedConsPlus.concat(to_Translate);
	
	console.log("forTranslation.. " + forTranslation);
	
	var json_to_Translate = JSON.stringify(to_Translate),
	        json_parse = JSON.parse(json_to_Translate);

	console.log("json_parse.. " + json_parse);

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
