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
	}
	
	for (i in cleanArray){
		cleanArray[i]=cleanArray[i].split(/\s+/);
	};

	//find collocated words for translation and group them together for proper conjugation
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
	
	//Array consisting of all collections that require conjugation:
	//console.log(mergedConsPlus);
	
	//CONJUGATION CODE END
	
	
	// packaging list of words to be translated in JSON for transfer to background scripts
	
	forTranslation=[];
	forTranslation=mergedConsPlus.concat(to_Translate);
	
	//delete duplicates
	var uniqueTrans = [];
	$.each(forTranslation, function(i, el){
	    if($.inArray(el, uniqueTrans) === -1) uniqueTrans.push(el);
	});
	
	//send to background scripts/server
	
	var json_to_Translate = JSON.stringify(uniqueTrans),
	        json_parse = JSON.parse(json_to_Translate);

	chrome.runtime.sendMessage({json_parse}, function(response) {  
	    replaceText(response.merged_words);
	});
});


//replace function

function replaceText(jsonArr) {
	
	//change jsonArr from object to array in order to enable sorting
	
	var makeArray = Object.keys(jsonArr).map(function(index){
        return [index,jsonArr[index]];
	});
	
	//sort array from longest string to shortest string thereby ensuring the longest strings are replaced first
	
	makeArray.sort(function (a, b) {
		  return b[0].length - a[0].length;
		});
	
	//replace with translations .....
	
	$("body :not(iframe)").textFinder(function() {
		for (d in makeArray){	
			var matcher = new RegExp('\\b' + makeArray[d][0] + '\\b', "gi");
			
			this.data = this.data.replace(matcher, makeArray[d][1]);
		}
	});
	
	for (d in makeArray){
	
	wrapText(document.body, makeArray[d][1]);

	function wrapText(container, text) {
		  // Construct a regular expression that matches text at the start or end of a string or surrounded by non-word characters.
		  // Escape any special regex characters in text.
		  var textRE = new RegExp('(^|\\W)' + text.replace(/[\\^$*+.?[\]{}()|]/, '\\$&') + '($|\\W)', 'm');
		  var nodeText;
		  var nodeStack = [];

		  // Remove empty text nodes and combine adjacent text nodes.
		  container.normalize();

		  // Iterate through the container's child elements, looking for text nodes.
		  var curNode = container.firstChild;

		  while (curNode != null) {
		    if (curNode.nodeType == Node.TEXT_NODE) {
		      // Get node text in a cross-browser compatible fashion.
		      if (typeof curNode.textContent == 'string')
		        nodeText = curNode.textContent;
		      else
		        nodeText = curNode.innerText;

		      // Use a regular expression to check if this text node contains the target text.
		      var match = textRE.exec(nodeText);
		      if (match != null) {
		        // Create a document fragment to hold the new nodes.
		        var fragment = document.createDocumentFragment();

		        // Create a new text node for any preceding text.
		        if (match.index > 0)
		        	fragment.appendChild(document.createTextNode(match.input.substr(0, match.index)));
		        	console.log(match.index);
		        	console.log(match);
		        	console.log(match.input.substr(0));
		        	console.log(match.input.substr(0, match.index));
		        	console.log(match[0]);
		        // Create the wrapper span and add the matched text to it.
		        var spanNode = document.createElement('span');
		        spanNode.style.backgroundColor = "blue";
		        spanNode.appendChild(document.createTextNode(match[0]));
		        //console.log(spanNode.appendChild(document.createTextNode(match[0])));
		        fragment.appendChild(spanNode);
		        //console.log(fragment.appendChild(spanNode));
		        // Create a new text node for any following text.
		        if (match.index + match[0].length < match.input.length)
		          fragment.appendChild(document.createTextNode(match.input.substr(match.index + match[0].length)));

		        // Replace the existing text node with the fragment.
		        curNode.parentNode.replaceChild(fragment, curNode);

		        curNode = spanNode;
		      }
		    } else if (curNode.nodeType == Node.ELEMENT_NODE && curNode.firstChild != null) {
		      nodeStack.push(curNode);
		      curNode = curNode.firstChild;
		      // Skip the normal node advancement code.
		      continue;
		    }

		    // If there's no more siblings at this level, pop back up the stack until we find one.
		    while (curNode != null && curNode.nextSibling == null)
		      curNode = nodeStack.pop();

		    // If curNode is null, that means we've completed our scan of the DOM tree.
		    // If not, we need to advance to the next sibling.
		    if (curNode != null)
		      curNode = curNode.nextSibling;
		  }
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



