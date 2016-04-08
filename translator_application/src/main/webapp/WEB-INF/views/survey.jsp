    <div id="userDiv" class="content">
		<form name="feedbackForm" id="feedbackForm"> 	    
		    	<div class="question"> 1. Gender
					<ul class="answers">
						<input type="radio" name="q1" value="a" id="q1a"><label for="q1a">Male</label><br/>
						<input type="radio" name="q1" value="b" id="q1b"><label for="q1b">Female</label><br/>
					</ul>
				</div>
				<div class="question">2. Age
					<ul class="answers">
						<input type="radio" name="q2" value="a" id="q2a"><label for="q2a">18-29</label><br/>
						<input type="radio" name="q2" value="b" id="q2b"><label for="q2b">30-49</label><br/>
						<input type="radio" name="q2" value="c" id="q2c"><label for="q2c">50+</label><br/>
					</ul>
				</div>
				<div class="question">3. Education
					<ul class="answers">
						<input type="radio" name="q3" value="a" id="q3a"><label for="q3a">No College</label><br/>
						<input type="radio" name="q3" value="b" id="q3b"><label for="q3b">Some College</label><br/>
						<input type="radio" name="q3" value="c" id="q3c"><label for="q3c">Advanced Degree</label><br/>
					</ul>
				</div>
				<div class="question">4. Are the foreign words distracting?
					<ul class="answers">
						<input type="radio" name="q4" value="a" id="q4a"><label for="q4a">Yes, very</label><br/>
						<input type="radio" name="q4" value="b" id="q4b"><label for="q4b">A little, but manageable</label><br/>
						<input type="radio" name="q4" value="c" id="q4c"><label for="q4c">Not distracting</label><br/>
					</ul>
				</div>
				<div class="question">5. Are you able to determine the meaning of the new words?
					<ul class="answers">
						<input type="radio" name="q5" value="a" id="q5a"><label for="q5a">Yes, with ease</label><br/>
						<input type="radio" name="q5" value="b" id="q5b"><label for="q5b">Sort of--takes time</label><br/>
						<input type="radio" name="q5" value="c" id="q5c"><label for="q5c">Not at all</label><br/>
					</ul>
				</div>
				<div class="question">6. When would you prefer to use a learning technique like this?
					<ul class="answers">
						<input type="radio" name="q6" value="a" id="q6a"><label for="q6a">From my desktop</label><br/>
						<input type="radio" name="q6" value="b" id="q6b"><label for="q6b">From my phone</label><br/>
						<input type="radio" name="q6" value="c" id="q6c"><label for="q6c">While reading an eBook</label><br/>	
					</ul>
				</div>
				<div class="question" style="padding-bottom: 5px;">7. What do you like about this product?
					<textarea name='q7' id='q7' rows="2" cols="55" maxlength="100" wrap="soft"></textarea></div>
		  		<div class="question" style="padding-bottom: 5px;">8. What do you not like about this product?
					<textarea name='q8' id='q8' rows="2" cols="55" maxlength="100" wrap="soft"></textarea></div>		
				<div class="question">9. How would you improve this product?
					<textarea name='q9' id='q9' rows="2" cols="55" maxlength="100" wrap="soft"></textarea></div>	
			<div id="footer" style="padding-top: 0;">
				<input type="button" value="Back" id="backButton" class="button" style="height: 30px; width: 90px; float: left; font-size: 10pt; margin-left: 20px; margin-top: 15px;"/>
				<input type="submit" value="Submit" id="submitButton" class="button" style="height: 30px; width: 90px; float: left; font-size: 10pt; margin-left: 230px; margin-top: 15px;"/>
		    </div>
		</form>
	</div>
	<script type="text/javascript">

	$("#backButton").click(function() {
		$("#feedbackDiv").hide("slide", { direction: "right" }, 400);
	    $("#languageDiv").show("slide", { direction: "left" }, 400);
	});

	// Attach a submit handler to check progress form
	$('#feedbackForm').submit(function(event) {
		
		event.preventDefault();
		
		var array = $(this).serializeArray();
		var jsonParameter = {};
		
		jQuery.each(array, function() {
			jsonParameter[this.name] = this.value || '';
	    });
		
		$.ajax({
			url : "http://localhost:8080/translator/rest/submit/feedback",
			type : "POST",
	        data: JSON.stringify(jsonParameter),
	        contentType: "application/json",
	        headers: {"Accept": "application/json"},
			success: function(result, status, xhr) {
				$("#feedbackDiv").html(result['message']);
			},
			error: function (xhr, status, errorMsg) {
	            alert(xhr.status + "::" + xhr.statusText + "::" + xhr.responseText);
	        }
		});
	});

</script>
