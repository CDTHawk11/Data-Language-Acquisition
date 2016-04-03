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

    switch(levelName) {
	    case "No Proficiency":
	    	arrayOfData = new Array(
	    		   	[[learned,learning,((learned+learning)>75)?0:(75-learned-learning)],'Beginner'],
	    		   	[[0,0,200],'Elementary'],
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
	    		   	[[75,0,75],'Beginner'],
	    		   	[[learned,learning,((learned+learning)>200)?0:(200-learned-learning)],'Elementary'],
	    		   	[[0,0,500],'Conversation'],
	    		   	['Threshold'],
	    		   	['Intermediate'],
	    		   	['Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Elementary":
	    	arrayOfData = new Array(
	    		   	[[75,0,75],'Beginner'],
	    		   	[[200,0,200],'Elementary'],
	    		   	[[learned,learning,((learned+learning)>500)?0:(500-learned-learning)],'Conversation'],
	    		   	[[0,0,1250],'Threshold'],
	    		   	['Intermediate'],
	    		   	['Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Conversational":
	    	arrayOfData = new Array(
	    		   	[[75,0,75],'Beginner'],
	    		   	[[200,0,200],'Elementary'],
	    		   	[[500,0,500],'Conversation'],
	    		   	[[learned,learning,((learned+learning)>1250)?0:(1250-learned-learning)],'Threshold'],
	    		   	[[0,0,2500],'Intermediate'],
	    		   	['Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Threshold":
	    	arrayOfData = new Array(
	    		   	[[75,0,75],'Beginner'],
	    		   	[[200,0,200],'Elementary'],
	    		   	[[500,0,500],'Conversation'],
	    		   	[[1250,0,1250],'Threshold'],
	    		   	[[learned,learning,((learned+learning)>2500)?0:(2500-learned-learning)],'Intermediate'],
	    		   	[[0,0,6000],'Operational'],
	    		   	['Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Intermediate":
	    	arrayOfData = new Array(
	    		   	[[75,0,75],'Beginner'],
	    		   	[[200,0,200],'Elementary'],
	    		   	[[500,0,500],'Conversation'],
	    		   	[[1250,0,1250],'Threshold'],
	    		   	[[2500,0,2500],'Intermediate'],
	    		   	[[learned,learning,((learned+learning)>6000)?0:(6000-learned-learning)],'Operational'],
	    		   	[[0,0,12000],'Fluent'],
	    		   	['Advanced']
	    		); 
	    	break;
	    case "Operational":
	    	arrayOfData = new Array(
	    		   	[[75,0,75],'Beginner'],
	    		   	[[200,0,200],'Elementary'],
	    		   	[[500,0,500],'Conversation'],
	    		   	[[1250,0,1250],'Threshold'],
	    		   	[[2500,0,2500],'Intermediate'],
	    		   	[[6000,0,6000],'Operational'],
	    		   	[[learned,learning,((learned+learning)>12000)?0:(12000-learned-learning)],'Fluent'],
	    		   	[[0,0,20000],'Advanced']
	    		); 
	    	break;
	    case "Fluent":
	    	arrayOfData = new Array(
	    		   	[[75,0,75],'Beginner'],
	    		   	[[200,0,200],'Elementary'],
	    		   	[[500,0,500],'Conversation'],
	    		   	[[1250,0,1250],'Threshold'],
	    		   	[[2500,0,2500],'Intermediate'],
	    		   	[[6000,0,6000],'Operational'],
	    		   	[[12000,0,12000],'Fluent'],
	    		   	[[learned,learning,((learned+learning)>20000)?0:(20000-learned-learning)],'Advanced']
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
	</script>
