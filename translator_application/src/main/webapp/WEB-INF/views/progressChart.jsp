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
	var remainingBeginner= ${progressInfo.remainingBeginner};
	var remainingElementary= ${progressInfo.remainingElementary};
	var remainingConversational= ${progressInfo.remainingConversational};
	var remainingThreshold= ${progressInfo.remainingThreshold};
	var remainingIntermediate= ${progressInfo.remainingIntermediate};
	var remainingOperational= ${progressInfo.remainingOperational};
	var remainingFluent= ${progressInfo.remainingFluent};
	var remainingAdvanced= ${progressInfo.remainingAdvanced};

	function createBeginnerArray(levelName) {
		var valueArr = new Array();
		
		valueArr.push(learned);
		
		if(learningBeginner > 0){
			valueArr.push(learningBeginner);
		}
		if(remainingBeginner > 0){
			valueArr.push(remainingBeginner);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Beginner'];
		}
		return [valueArr,'Beginner'];
	}

	function createElementaryArray(levelName) {
		var valueArr = new Array();

		if (levelName === "No Proficiency" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Beginner") {
			
			valueArr.push(learned);
		} 
		if(learningElementary > 0){
			valueArr.push(learningElementary);
		}
		if(remainingElementary > 0){
			valueArr.push(remainingElementary);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Elementary'];
		}
		return [valueArr,'Elementary'];
	}
	function createConversationArray(levelName) {
		if (levelName !== "No Proficiency" && levelName !== "Beginner" && levelName !== "Elementary") {
			return [500];
		}
		var valueArr = new Array();

		if (levelName === "No Proficiency" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Beginner") {
			
			valueArr.push(0);
		} 
		if (levelName === "Elementary") {
			
			valueArr.push(learned);
		} 
		if(learningConversational > 0){
			valueArr.push(learningConversational);
		}
		if(remainingConversational > 0){
			valueArr.push(remainingConversational);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Conversation'];
		}
		return [valueArr,'Conversation'];
	}
	
	function createThresholdArray(levelName) {
		if (levelName !== "No Proficiency" && levelName !== "Beginner" && levelName !== "Elementary" && levelName !== "Conversational") {
			return [1250];
		}
		var valueArr = new Array();

		if (levelName === "Beginner" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Elementary" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Conversational") {
			
			valueArr.push(learned);
		} 
		if(learningThreshold > 0){
			valueArr.push(learningThreshold);
		}
		if(remainingThreshold > 0){
			valueArr.push(remainingThreshold);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Threshold'];
		}
		return [valueArr,'Threshold'];
	}

	function createIntermediateArray(levelName) {
		if (levelName === "Intermediate" || levelName === "Operational" || levelName === "Fluent" || levelName === "Advanced") {
			return [2500];
		}
		var valueArr = new Array();

		if (levelName === "Elementary" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Conversational" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Threshold") {
			
			valueArr.push(learned);
		} 
		if(learningIntermediate > 0){
			valueArr.push(learningIntermediate);
		}
		if(remainingIntermediate > 0){
			valueArr.push(remainingIntermediate);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Intermediate'];
		}
		return [valueArr,'Intermediate'];
	}

	function createOperationalArray(levelName) {
		if (levelName === "Operational" || levelName === "Fluent" || levelName === "Advanced") {
			return [6000];
		}
		var valueArr = new Array();

		if (levelName === "Conversational" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Threshold" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Intermediate") {
			
			valueArr.push(learned);
		} 
		if(learningOperational > 0){
			valueArr.push(learningOperational);
		}
		if(remainingOperational > 0){
			valueArr.push(remainingOperational);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Operational'];
		}
		return [valueArr,'Operational'];
	}

	function createFluentArray(levelName) {
		if (levelName === "Fluent" || levelName === "Advanced") {
			return [12000];
		}
		var valueArr = new Array();

		if (levelName === "Threshold" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Intermediate" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Operational") {
			
			valueArr.push(learned);
		} 
		if(learningFluent > 0){
			valueArr.push(learningFluent);
		}
		if(remainingFluent > 0){
			valueArr.push(remainingFluent);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Fluent'];
		}
		return [valueArr,'Fluent'];
	}

	function createAdvancedArray(levelName) {
		if (levelName === "Advanced") {
			return [20000];
		}
		var valueArr = new Array();

		if (levelName === "Threshold" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Intermediate" ) {
			
			valueArr.push(0);
		} 
		if (levelName === "Operational") {
			
			valueArr.push(learned);
		} 
		if(learningFluent > 0){
			valueArr.push(learningFluent);
		}
		if(remainingFluent > 0){
			valueArr.push(remainingFluent);
		}
		if((valueArr.length == 0) || (valueArr.length == 1 && valueArr[0] == 0)){
			return ['Fluent'];
		}
		return [valueArr,'Fluent'];
	}
	
    switch(levelName) {
	    case "No Proficiency":
	    	arrayOfData = new Array(
	    			createBeginnerArray(levelName),
	    		   	createElementaryArray(levelName),
	    		   	createConversationArray(levelName),
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
	    		   	createElementaryArray(levelName),
	    		   	createConversationArray(levelName),
	    		   	createThresholdArray(levelName),
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
	    		   	createConversationArray(levelName),
	    		   	createThresholdArray(levelName),
	    		   	createIntermediateArray(levelName),
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
	    		   	createThresholdArray(levelName),
	    		   	createIntermediateArray(levelName),
	    		   	createOperationalArray(levelName),
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
	    		   	createIntermediateArray(levelName),
	    		   	createOperationalArray(levelName),
	    		   	createFluentArray(levelName),
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
	    		   	createOperationalArray(levelName),
	    		   	createFluentArray(levelName),
	    		   	createAdvancedArray(levelName)
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
	    		   	createFluentArray(levelName),
	    		   	createAdvancedArray(levelName)
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
	    		   	createAdvancedArray(levelName)
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
