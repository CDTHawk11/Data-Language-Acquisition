// This function gets all the text in browser
function getText(words, sentences) {
	$("body :not(iframe)").textFinder(function() {
		var str = this.data.replace(/\s{2,}/gm, " ").replace(/(\D*)(\d+)(\D*)/gi,"");
		Array.prototype.push.apply(words, str.split(/[\u0000-\u001F\u0021-\u0026\u0028-\u0040\u005B-\u0060\u007B-\u00BF\u2000-\u206F\u2E00-\u2E7F\s]+/));
		Array.prototype.push.apply(sentences, str.split(/[\u0000-\u001F\u0021-\u0026\u0028-\u0040\u005B-\u0060\u007B-\u00BF\u2000-\u206F\u2E00-\u2E7F]+/));
	});
}

// Get the saved translation level.
var tranLimit = 5;
chrome.storage.sync.get("TRAN_LEVEL", function (limit) {
	if(limit["TRAN_LEVEL"]) {
		tranLimit = parseInt(limit["TRAN_LEVEL"]);
	}
	
	var alltext = [], sentences = [];
	getText(alltext, sentences); // gets browser text into words and sentences
	
	if(sentences.length == 0 || alltext.length == 0) {
		return;
	}
	
	var words = [];
	for (i in alltext){
		if(alltext[i].trim() !== "") words.push(alltext[i].trim());
	};

	var counts = [];

	// counts number of words
	for (var i = 0; i < words.length; i++) {
	    var num = words[i];
	    counts[num] = counts[num] ? counts[num] + 1 : 1;
	}

	var unique_numbers = Object.keys(counts).length; // number unique words
														// that
														// appear on page
	// orders words from most occurring to least
	var counts_new = [];
	for (var key in counts)
	    counts_new.push([key, counts[key]]);
	counts_new.sort(function (a, b) {
	    return b[1] - a[1]
	});

	// var arrays_to = counts_new.splice(0, 4); // four most occurring words
												// (temporary)
	var arrays_to = counts_new.splice(0, tranLimit-1);
	console.log(arrays_to);
	// Extracts the most frequently occurring words from the arrays_to
	// dictionary and places them in a list
	words_to = [];
	for (var key in arrays_to)
	    words_to.push([arrays_to[key][0]]);
	var to_Translate = [].concat.apply([], words_to);

	// CONJUGATION CODE:
	
	var cleanArray = [];
	for (i in sentences){
		if(sentences[i].trim() !== "") cleanArray.push(sentences[i].trim());
	};
	
	//split each "sentence" on space
	cleanSplit=[];
	for (i in cleanArray){
		cleanSplit.push(cleanArray[i].split(" "));
	}
	
	// find collocated words for translation and group them together for proper conjugation
	var mergedConsPlus=[];
	
	
loop1:	
	for (i in cleanSplit){
loop2:
		t=0;
		for (t; t<=cleanSplit[i].length; t++){
			//console.log(cleanArray[i].length);
			var joinedCons=[];
			var conjugs=[];
			var z=0;
			var x=0;
			var mergedCons=[];
loop3:
			for (word in to_Translate){
				if (cleanSplit[i][t]===to_Translate[word]){
					var limit=cleanSplit[i].length-1;
					if (t < limit){
						t=parseInt(t);
						var a=t+1;
						var conjugsPlus=[];
loop4:						
						for (a; a<=limit; a++){
loop5:
							for (w in to_Translate){
								if (to_Translate[w]===cleanSplit[i][a]){
									z=z+1;
								};
							};	
							if(z>x){
								x=x+1;
							} else {break loop4;}
						conjugsPlus.push(cleanSplit[i][a]);
						};
					};	
				};					
			};
		if (z>0){
			conjugs.push(cleanSplit[i][t]);
			conjugs.push(conjugsPlus);
			mergedCons.push(conjugs);
			mergedCons = [].concat.apply([], conjugs);
			joinedCons=mergedCons.join(' ');
			mergedConsPlus.push(joinedCons);
			if (a<limit){
				t=a+1;
				}
			}
		};	
	};
	
	// Array consisting of all collections that require conjugation:
	
	// CONJUGATION CODE END

	// packaging list of words to be translated in JSON for transfer to
	// background scripts
	
	forTranslation=[];
	forTranslation=mergedConsPlus.concat(to_Translate);
	
	// delete duplicates
	var uniqueTrans = [];
	$.each(forTranslation, function(i, el){
	    if($.inArray(el, uniqueTrans) === -1) uniqueTrans.push(el);
	});
	
	// send to background scripts/server
	console.log(uniqueTrans);
	var json_to_Translate = JSON.stringify(uniqueTrans),
	        json_parse = JSON.parse(json_to_Translate);


	chrome.runtime.sendMessage({json_parse}, function(response) { 
		var jsonArr = response.merged_words;
		
		// change jsonArr from object to array in order to enable sorting
		var makeArray = Object.keys(jsonArr).map(function(index){
	        return [index,jsonArr[index]];
		});
		
		// sort array from longest string to shortest string thereby ensuring the
		// longest strings are replaced first
		
		makeArray.sort(function (a, b) {
			return b[0].length - a[0].length;
		});
		console.log(makeArray);
	    replaceText(makeArray);
	});
});

// replace function

function replaceText(makeArray) {
	$("body :not(iframe)").textFinder(function() {
		for (d in makeArray){				
			if(this.nodeType === 3) { // first pass of the iteration
				findAndReplace(this, makeArray[d][0], makeArray[d][1]);
			} else if(this.nodeType === 1 && this.childNodes && this.childNodes[0]) { // all other passes after the first iteration
				$(this).textFinder(function() {
					findAndReplace(this, makeArray[d][0], makeArray[d][1]);
				});
			}
		}
	});
}

function findAndReplace(node, matcher, replacement) {
	matcher = matcher.trim();
	var pattern = new RegExp("(^\|[\\u0000-\\u001F\\u0021-\\u0026\\u0028-\\u0040\\u005B-\\u0060\\u007B-\\u00BF\\u2000-\\u206F\\u2E00-\\u2E7F\\s])" + matcher + "(?=[\\u0000-\\u001F\\u0021-\\u0026\\u0028-\\u0040\\u005B-\\u0060\\u007B-\\u00BF\\u2000-\\u206F\\u2E00-\\u2E7F\\s]\|$)", "i");
    var match;
    var curNode = node;
    while (match = pattern.exec(curNode.data)) {
    	// check if text is already wrapped
    	if (curNode.parentNode.className === "spkeasy"){
    		return;
    	}
    	else{		
	        // Create the wrapper span and add the matched text to it.
			var span = document.createElement('span');
			$(span).attr("title", matcher);
			$(span).attr("class","spkeasy");
			$(span).tooltip({
		      position: {
		          my: "center bottom-15",
		          at: "center top",
		          using: function( position, feedback ) {
		            $( this ).css( position );
		            $( "<div>" )
		              .addClass( "arrow" )
		              .addClass( feedback.vertical )
		              .addClass( feedback.horizontal )
		              .appendTo( this );
		          	}
		        }
			});
			var middlebit, endbit;
			if(match[0].search(/[\u0000-\u001F\u0021-\u0026\u0028-\u0040\u005B-\u0060\u007B-\u00BF\u2000-\u206F\u2E00-\u2E7F\s]/g) == 0) {
				middlebit = curNode.splitText(match.index + 1);
				endbit = middlebit.splitText(match[0].length - 1);
			} else {
				middlebit = curNode.splitText(match.index);
				endbit = middlebit.splitText(match[0].length);
			}
	        span.appendChild(document.createTextNode(replacement));
	        middlebit.parentNode.replaceChild(span, middlebit);
	        curNode = endbit;
    	}
    }
}

// jQuery plugin to find and replace text
jQuery.fn.textFinder = function( fn ) {
    this.contents().each( scan );
    // callback function to scan through the child nodes recursively
    function scan() {
        var node = this.nodeName.toLowerCase();
        if( node === '#text' ) {
            fn.call(this);
        } else if( this.nodeType === 1 && this.childNodes && this.childNodes[0] && node !== 'script' && node !== 'textarea' && node !== 'iframe' ) {
            $(this).contents().each( scan );
        }
    }
    return this;
};