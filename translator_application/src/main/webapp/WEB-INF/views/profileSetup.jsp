<!DOCTYPE html>
<%@ page session="false" %>
<html>
    <head>
        <meta charset="utf-8">
        <title>Speak Easy</title>
        <link rel="stylesheet" href="/translator/resources/jquery-ui.css">
        <link rel="stylesheet" href="/translator/resources/speakeasy.css">
        <script type="text/javascript" src="/translator/resources/jquery-1.11.3.min.js"></script>
        <script type="text/javascript" src="/translator/resources/speakeasy.js"></script>
        <script type="text/javascript">
     		window.onbeforeunload = function() {
     			if($("#current option:selected").val() === "" ||
				   $("#target option:selected").val() === "" ||
     			   $("#difficulty option:selected").val() === "") {
     				return "Your Speak Easy profile setup isn't complete!";
     			}
     		}
		</script>
    </head>
    <body>
    <form name="userProfileForm" id="userProfileForm" action="/translator/rest/user/save" method="post">
	    <div id="page1" class="page">
	    	<div id="banner">
	           	<img id="icon" alt="speakeasy" src="/translator/resources/Marquee.png"/>
	        	<div id="heading"><font color="#00b3b3">Let's set you up ...</font></div>    	        
	        </div>
	        <div id="userDiv" class="content">
				<div style="height:25px;">What is your name?</div>
	        	<input name="fullName" id="fullName" type="text" maxlength="100" />
	        	<div style="height:25px;padding-top:20px;">What is your email address?</div>
	        	<input name="email" id="email" type="text" maxlength="100" />
	        	<div style="height:25px;padding-top:20px;">What do you do for work?</div>
				<select name="occupation" id="occupation">
  					<option value="" id="q4a">Select your occupation or field of work</option>
  					<option value="Accounting">Accounting</option>
  					<option value="Advertising/Marketing Services/Communications">Advertising/Marketing Services/Communications</option>
  					<option value="Aerospace/Aviation">Aerospace/Aviation</option>
  					<option value="Agribusiness">Agribusiness</option>
  					<option value="Arts/Media/Entertainment">Arts/Media/Entertainment</option>
  					<option value="Automotive/Transportation Equipment">Automotive/Transportation Equipment </option>
  					<option value="Biotech & Life Sciences">Biotech & Life Sciences</option>
  					<option value="Chemicals/Plastics">Chemicals/Plastics</option>
  					<option value="Computer-Related Services">Computer-Related Services</option>
  					<option value="Construction">Construction</option>
  					<option value="Consulting">Consulting</option>				
  					<option value="Consumer Products">Consumer Products</option>
  					<option value="Consumer Research">Consumer Research</option>
  					<option value="eCommerce and Internet">eCommerce and Internet</option>
  					<option value="Education">Education</option>				
  					<option value="Employment/Executive Search">Employment/Executive Search</option>
  					<option value="Energy/Petroleum">Energy/Petroleum</option>
  					<option value="Environment/Natural Resources">Environment/Natural Resources</option>
  					<option value="Financial Services">Financial Services</option>				
  					<option value="Food Service/Lodging">Food Service/Lodging</option>
  					<option value="Food/Beverage/Tobacco">Food/Beverage/Tobacco</option>
  					<option value="Forest Products/Packaging">Forest Products/Packaging</option>
  					<option value="Government">Government</option>
  					<option value="Healthcare">Healthcare</option>
  					<option value="Import/Export/Trading Companies">Import/Export/Trading Companies</option>
  					<option value="Law">Law</option>
					<option value="Manufacturing">Manufacturing</option>
  					<option value="Military">Military</option>
  					<option value="Non-Profit">Non-Profit</option>
					<option value="Pharmaceutical Products">Pharmaceutical Products</option>
  					<option value="Printing/Publishing">Printing/Publishing</option>
  					<option value="Real Estate">Real Estate</option>
					<option value="Recreation/Leisure/Sports">Recreation/Leisure/Sports</option>
  					<option value="Retail">Retail</option>
  					<option value="Technology">Technology</option>
					<option value="Telecommunications">Telecommunications</option>
  					<option value="Textiles/Clothing">Textiles/Clothing</option>
  					<option value="Transportation Services">Transportation Services</option>
					<option value="Utilities">Utilities</option>
  					<option value="Other" id="q4oo">Other</option>
  				</select>
				<br/><br/>
				<input type="button" value="Next >>" id="next" class="button"/>
	        </div> 
	    </div>
	    <div id="page2" class="page" style="display: none;">
	    	<div id="banner">
	           	<img id="icon" alt="speakeasy" src="/translator/resources/Marquee.png"/>
	        	<div id="heading"><font color="#00b3b3">Almost done ...</font></div>    	        
	        </div>
	        <div id="languageDiv" class="content">
				<div style="height:25px;">What is your primary language?</div>
	        	<select name="current" id="current">
		        	<option value="" selected="selected">Select your current language</option>
					<option value="en">English</option>
					<option value="fr">French</option>
					<option value="de">German</option>
					<option value="el">Greek</option>
					<option value="it">Italian</option>
					<option value="la">Latin</option>
					<option value="pt">Portugese</option>
					<option value="ru">Russian</option>
					<option value="es">Spanish</option>
				</select>
				<div style="height:25px;padding-top:20px;">Which foreign language do you want to learn?</div>
		        <select name="target" id="target">
		        	<option value="" selected="selected">Select your target language</option>
					<option value="en">English</option>
					<option value="fr">French</option>
					<option value="de">German</option>
					<option value="el">Greek</option>
					<option value="it">Italian</option>
					<option value="la">Latin</option>
					<option value="pt">Portugese</option>
					<option value="ru">Russian</option>
					<option value="es">Spanish</option>
				</select>
				<div style="height:25px;padding-top:20px;">What is your level of expertise in the foreign language you want to learn?</div>
	 	    	<select name="difficulty" id="difficulty">
		        	<option value="" selected="selected">Select your level of expertise</option>
					<option value=2>Beginner</option>
					<option value=5>I know a little</option>
					<option value=10>I've been there before</option>
					<option value=20>Intermediate</option> 	
				</select>   
				<br/><br/>
				<input type="button" value="Let's get started!" id="completeSetup" class="button"/>
	        </div> 
	    </div>
	</form>
	</body>
</html>