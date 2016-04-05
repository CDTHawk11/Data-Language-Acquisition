    <div id="userDiv" class="content">
    	<div id="progressDiv" style="font-size: 7pt;"></div>
    	<div style="margin: 25px 15px;">
    	<div style="font-size: 10pt; font-weight: bold; color: #ffff90">Current level:</div>
    	<div style="font-size: 10pt; font-weight: bold; padding-top: 5px">${progressInfo.level}</div>
		</div>
	</div>
	<script type="text/javascript">
	var learned = ${progressInfo.learnedCount};
	var learning = ${progressInfo.learningCount};
	var level = "${progressInfo.level}";
	var levelName = ((level.split("-"))[0]).trim();
	var learningBeginner= ${progressInfo.learningBeginner};
	var learningElementary= ${progressInfo.learningElementary};
	var learningConversational= ${progressInfo.learningConversational};
	var learningThreshold= ${progressInfo.learningThreshold};
	var learningIntermediate= ${progressInfo.learningIntermediate};
	var learningOperational= ${progressInfo.learningOperational};
	var learningFluent= ${progressInfo.learningFluent};
	var learningAdvanced= ${progressInfo.learningAdvanced};

    switch(levelName) {
	    case "No Proficiency":
	    	arrayOfData = new Array(
	    		   	[[learned,learningBeginner,((learned+learning)>75)?0:(75-learned-learning)],'Beginner'],
	    		   	[[0,learningElementary,((learned+learning)>75)?200-(learning+learned-75):200],'Elementary'],
	    		   	['Conversation'],
	    		   	['Threshold'],
	    		   	['Intermediate'],
	    		   	['Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Beginner":
	    	arrayOfData = new Array(
	    		   	[[75],'Beginner'],
	    		   	[[learned,((learned+learning)>200)?200-learned:learning,((learned+learning)>200)?0:(200-learned-learning)],'Elementary'],
	    		   	[[0,((learned+learning)>200)?learning+learned-200:0,((learned+learning)>200)?500-(learning+learned-200):500],'Conversation'],
	    		   	['Threshold'],
	    		   	['Intermediate'],
	    		   	['Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Elementary":
	    	arrayOfData = new Array(
	    		   	[[75],'Beginner'],
	    		   	[[200],'Elementary'],
	    		   	[[learned,((learned+learning)>500)?500-learned:learning,((learned+learning)>500)?0:(500-learned-learning)],'Conversation'],
	    		   	[[0,((learned+learning)>500)?learning+learned-500:0,((learned+learning)>500)?1250-(learning+learned-500):1250],'Threshold'],
	    		   	['Intermediate'],
	    		   	['Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Conversational":
	    	arrayOfData = new Array(
	    		   	[[75],'Beginner'],
	    		   	[[200],'Elementary'],
	    		   	[[500],'Conversation'],
	    		   	[[learned,((learned+learning)>1250)?1250-learned:learning,((learned+learning)>1250)?0:(1250-learned-learning)],'Threshold'],
	    		   	[[0,((learned+learning)>1250)?learning+learned-1250:0,((learned+learning)>1250)?2500-(learning+learned-1250):2500],'Intermediate'],
	    		   	['Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Threshold":
	    	arrayOfData = new Array(
	    		   	[[75],'Beginner'],
	    		   	[[200],'Elementary'],
	    		   	[[500],'Conversation'],
	    		   	[[1250],'Threshold'],
	    		   	[[learned,((learned+learning)>2500)?2500-learned:learning,((learned+learning)>2500)?0:(2500-learned-learning)],'Intermediate'],
	    		   	[[0,((learned+learning)>2500)?learning+learned-2500:0,((learned+learning)>2500)?6000-(learning+learned-2500):6000],'Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Intermediate":
	    	arrayOfData = new Array(
	    		   	[[75],'Beginner'],
	    		   	[[200],'Elementary'],
	    		   	[[500],'Conversation'],
	    		   	[[1250],'Threshold'],
	    		   	[[2500],'Intermediate'],
	    		   	[[learned,((learned+learning)>6000)?6000-learned:learning,((learned+learning)>6000)?0:(6000-learned-learning)],'Operational'],
	    		   	[[0,((learned+learning)>6000)?learning+learned-6000:0,((learned+learning)>6000)?12000-(learning+learned-6000):12000],'Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Operational":
	    	arrayOfData = new Array(
	    		   	[[75],'Beginner'],
	    		   	[[200],'Elementary'],
	    		   	[[500],'Conversation'],
	    		   	[[1250],'Threshold'],
	    		   	[[2500],'Intermediate'],
	    		   	[[6000],'Operational'],
	    		   	[[learned,((learned+learning)>12000)?12000-learned:learning,((learned+learning)>12000)?0:(12000-learned-learning)],'Fluent'],
	    		   	[[0,((learned+learning)>12000)?learning+learned-12000:0,((learned+learning)>12000)?20000-(learning+learned-12000):20000],'Advanced']
	    		); 
	    	break;
	    case "Fluent":
	    	arrayOfData = new Array(
	    		   	[[75],'Beginner'],
	    		   	[[200],'Elementary'],
	    		   	[[500],'Conversation'],
	    		   	[[1250],'Threshold'],
	    		   	[[2500],'Intermediate'],
	    		   	[[6000],'Operational'],
	    		   	[[12000],'Fluent'],
	    		   	[[learned,((learned+learning)>20000)?20000-learned:learning,((learned+learning)>20000)?0:(20000-learned-learning)],'Advanced']
	    		); 
	    	break;
    }

	$('#progressDiv').jqBarGraph({ 
		data: arrayOfData,
		width: 470, 
		height: 250, 
		barSpace: 15,
		showValuesColor: 'black',
		colors: ['#00b3b3','#ffff90','#E6EBEA']
	});

	chrome.storage.sync.set({"SPKESY_LRND":learned}, function() {
	});
	chrome.storage.sync.set({"SPKESY_LRNG":learning}, function() {
	});
	</script>
