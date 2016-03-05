// This function gets all the text in browser
function getText(words, sentences) {
	$("body :not(iframe)").textFinder(function() {
		var str = this.data.replace(/\s+/gm, " ");
		Array.prototype.push.apply(words, str.match(/([^\u0000-\u007F]|\w)+/g));
		Array.prototype.push.apply(sentences, str.match(/[^\r\n.!?:,"]+(:?(:?\r\n|[\r\n]|[.!?:,"])+|$)/gm));
	});
}

// Get the saved translation level.
var tranLimit = 5;
chrome.storage.sync.get("TRAN_LEVEL", function (limit) {
	if(limit["TRAN_LEVEL"]) {
		tranLimit = parseInt(limit["TRAN_LEVEL"]);
	}
	
	var words = [], sentences = [];
	getText(words, sentences); // gets browser text into words and sentences
		
	if(sentences.length == 0 || words.length == 0) {
		return;
	}
	
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
	// Extracts the most frequently occurring words from the arrays_to
	// dictionary and places them in a list
	words_to = [];
	for (var key in arrays_to)
	    words_to.push([arrays_to[key][0]]);
	var to_Translate = [].concat.apply([], words_to);

	// CONJUGATION CODE:
	
	// Regex for finding sentences:
	/*
	var result1= allText.match( /["']?[A-Z][^.?!]+((?![.?!]['"]?\s\n["']?[A-Z][^.?!]).)+[.?!'"]+/g );
	
	var res_split=[];
	
	// Regex for creating variables based upon line breaks:
	
	for (i in result1) {
	    res_split.push(result1[i].split(/(\r\n|\n|\r)/gm));
	};
		
	cleanArray=[];
	
	// Clean-up excess spaces and line breaks:
	
	for (i in res_split) {
		for (t in res_split[i]) {
			res_split[i][t]=res_split[i][t].replace(/(\r\n|\n|\r)/gm,"")
			if (res_split[i][t]) {
		       	cleanArray.push(res_split[i][t]);
		      }		
		};
	}
	*/
	var cleanArray = [];
	for (i in sentences){
		if(sentences[i].trim() === "") {
			continue;
		}
		
		cleanArray.push(sentences[i].trim());
	};
	
	console.log(cleanArray);	
	// find collocated words for translation and group them together for proper
	// conjugation
	var mergedConsPlus=[];
	
loop1:	
	for (i in cleanArray){
loop2:
		t=0;
		for (t; t<=cleanArray[i].length; t++){
			var joinedCons=[];
			var conjugs=[];
			var z=0;
			var x=0;
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
	var pattern = new RegExp('\\b' + matcher.replace(" ", "\\s") + '\\b', "i");
    var match;
    var curNode = node;
    while (match = pattern.exec(curNode.data)) {
        // Create the wrapper span and add the matched text to it.
		var span = document.createElement('span');
		$(span).attr("title", matcher);
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

		var middlebit = curNode.splitText(match.index);
        var endbit = middlebit.splitText(match[0].length);
        span.appendChild(document.createTextNode(replacement));
        middlebit.parentNode.replaceChild(span, middlebit);
        curNode = endbit;
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