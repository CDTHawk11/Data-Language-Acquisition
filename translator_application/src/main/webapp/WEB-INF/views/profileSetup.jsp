<!DOCTYPE html>
<%@ page session="false" %>
<html>
    <head> 
    
        <meta charset="utf-8">
        <title>Speak Easy</title>
		<link rel="icon" href="/translator/resources/favicon.ico" type="image/x-icon" >
        <link rel="stylesheet" href="/translator/resources/jquery-ui.css">
        <link rel="stylesheet" href="/translator/resources/speakeasy.css">
        <script type="text/javascript" src="/translator/resources/jquery-1.11.3.min.js"></script>
        <script type="text/javascript" src="/translator/resources/jquery-ui.min.js"></script>
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
    <form name="userProfileForm" id="userProfileForm">
	    <div id="page1" class="page" style="text-align:center;">
	    	<div id="banner">
	           	<img id="icon" alt="speakeasy" src="/translator/resources/logo.png"/>     
	    		<div id="heading">Effortless Language Learning</div>
	        </div>
	        <div id="registration" class="content">
	        	<label for="email" style="padding-right:10px; font-size: 13pt">Email</label>
	        	<input name="email" id="email" type="text" maxlength="100" style="width: 225px;" />
	        	<br/><br/>
	        	<input type="button" value="Continue with registration" id="next" class="button"/>
	    	</div>
		</div>
	    <div id="page2" class="page" style="text-align:center; display: none;">
	    	<div id="banner">
	           	<img id="icon" alt="speakeasy" src="/translator/resources/logo.png"/>     
	    		<div id="heading"><div>Effortless</div><div>Language</div><div>Learning</div></div>
	        </div>
	        <div id="userDiv" class="content">
	        	<table border="0" cellspacing="0" cellpadding="0" class="form-table"><tbody>
					<tr><td>Full name</td>
						<td><input name="fullName" id="fullName" type="text" maxlength="100" /></td></tr>
		        	<tr><td>Occupation</td>
		        		<td>
		        			<select name="occupation" id="occupation">
			  					<option value="">Select your field of work</option>
			  					<option value="Accounting/Financial Services">Accounting/Financial Services</option>
			  					<option value="Advertising/Marketing Services/Communications">Advertising/Marketing Services/Communications</option>
			  					<option value="Aerospace/Aviation">Aerospace/Aviation</option>
			  					<option value="Agribusiness">Agribusiness</option>
			  					<option value="Arts/Media/Entertainment">Arts/Media/Entertainment</option>
			  					<option value="Automotive/Transportation Equipment">Automotive/Transportation Equipment </option>
			  					<option value="Biotech/Life Sciences/Pharmaceutical Products">Biotech/Life Sciences/Pharmaceutical Products</option>
			  					<option value="Chemicals/Plastics">Chemicals/Plastics</option>
			  					<option value="Construction">Construction</option>
			  					<option value="Consulting">Consulting</option>				
			  					<option value="Consumer Products">Consumer Products</option>
			  					<option value="Consumer Research">Consumer Research</option>
			  					<option value="eCommerce and Internet">eCommerce and Internet</option>
			  					<option value="Education">Education</option>				
			  					<option value="Employment/Executive Search">Employment/Executive Search</option>
			  					<option value="Energy/Petroleum">Energy/Petroleum</option>
			  					<option value="Environment/Natural Resources">Environment/Natural Resources</option>
			  					<option value="Food Service/Lodging">Food Service/Lodging</option>
			  					<option value="Food/Beverage/Tobacco">Food/Beverage/Tobacco</option>
			  					<option value="Forest Products/Packaging">Forest Products/Packaging</option>
			  					<option value="Government">Government</option>
			  					<option value="Insurance/Healthcare">Insurance/Healthcare</option>
			  					<option value="Import/Export/Trading Companies">Import/Export/Trading Companies</option>
			  					<option value="Law">Law</option>
								<option value="Manufacturing">Manufacturing</option>
			  					<option value="Military">Military</option>
			  					<option value="Non-Profit">Non-Profit</option>
			  					<option value="Printing/Publishing">Printing/Publishing</option>
			  					<option value="Real Estate">Real Estate</option>
								<option value="Recreation/Leisure/Sports">Recreation/Leisure/Sports</option>
			  					<option value="Retail">Retail</option>
			  					<option value="Technology/Computer-Related Services">Technology/Computer-Related Services</option>
								<option value="Telecommunications">Telecommunications</option>
			  					<option value="Textiles/Clothing">Textiles/Clothing</option>
			  					<option value="Transportation Services">Transportation Services</option>
								<option value="Utilities">Utilities</option>
			  					<option value="Other">Other</option>
		  					</select>
		        		</td></tr>
		        	<tr><td>Primary language</td>
		        		<td>
		        		<select name="current" id="current">
		        		<option value="" selected="selected">Select your primary language</option>
						<option value="af">Afrikaans</option>
						<option value="sq">Albanian</option>
						<option value="ar">Arabic</option>
						<option value="eu">Basque</option>
						<option value="bs">Bosnian</option>
						<option value="my">Burmese</option>
						<option value="ca">Catalan</option>
						<option value="ceb">Cebuano</option>
						<option value="zh-CN">Chinese</option>
						<option value="hr">Croatian</option>
						<option value="cs">Czech</option>
						<option value="da">Danish</option>
						<option value="nl">Dutch</option>
						<option value="en">English</option>
						<option value="eo">Esperanto</option>
						<option value="et">Estonian</option>
						<option value="tl">Filipino</option>
						<option value="fi">Finnish</option>
						<option value="fr">French</option>
						<option value="gl">Galician</option>
						<option value="de">German</option>
						<option value="el">Greek</option>
						<option value="ht">Haitian</option>
						<option value="hi">Hindi</option>
						<option value="hu">Hungarian</option>
						<option value="id">Indonesian</option>
						<option value="ga">Irish</option>
						<option value="it">Italian</option>
						<option value="ja">Japanese</option>
						<option value="ko">Korean</option>
						<option value="la">Latin</option>
						<option value="lv">Latvian</option>
						<option value="lt">Lithuanian</option>
						<option value="no">Norwegian</option>
						<option value="pl">Polish</option>
						<option value="pt">Portuguese</option>
						<option value="ro">Romanian</option>
						<option value="ru">Russian</option>
						<option value="sk">Slovak</option>
						<option value="sl">Slovenian</option>
						<option value="so">Somali</option>
						<option value="es">Spanish</option>
						<option value="su">Sudanese</option>
						<option value="sw">Swahili</option>
						<option value="sv">Swedish</option>
						<option value="zh-TW">Taiwanese</option>
						<option value="tr">Turkish</option>
						<option value="uz">Uzbek</option>
						<option value="vi">Vietnamese</option>
						<option value="cy">Welsh</option>
						<option value="zu">Zulu</option>
					</select>
				</td></tr>
		        	<tr><td>Language to learn</td>
		        	<td>
		        	<select name="target" id="target">
		        		<option value="" selected="selected">Select target language</option>
						<option value="af">Afrikaans</option>
						<option value="sq">Albanian</option>
						<option value="ar">Arabic</option>
						<option value="eu">Basque</option>
						<option value="bs">Bosnian</option>
						<option value="my">Burmese</option>
						<option value="ca">Catalan</option>
						<option value="ceb">Cebuano</option>
						<option value="zh-CN">Chinese</option>
						<option value="hr">Croatian</option>
						<option value="cs">Czech</option>
						<option value="da">Danish</option>
						<option value="nl">Dutch</option>
						<option value="en">English</option>
						<option value="eo">Esperanto</option>
						<option value="et">Estonian</option>
						<option value="tl">Filipino</option>
						<option value="fi">Finnish</option>
						<option value="fr">French</option>
						<option value="gl">Galician</option>
						<option value="de">German</option>
						<option value="el">Greek</option>
						<option value="ht">Haitian</option>
						<option value="hi">Hindi</option>
						<option value="hu">Hungarian</option>
						<option value="id">Indonesian</option>
						<option value="ga">Irish</option>
						<option value="it">Italian</option>
						<option value="ja">Japanese</option>
						<option value="ko">Korean</option>
						<option value="la">Latin</option>
						<option value="lv">Latvian</option>
						<option value="lt">Lithuanian</option>
						<option value="no">Norwegian</option>
						<option value="pl">Polish</option>
						<option value="pt">Portuguese</option>
						<option value="ro">Romanian</option>
						<option value="ru">Russian</option>
						<option value="sk">Slovak</option>
						<option value="sl">Slovenian</option>
						<option value="so">Somali</option>
						<option value="es">Spanish</option>
						<option value="su">Sudanese</option>
						<option value="sw">Swahili</option>
						<option value="sv">Swedish</option>
						<option value="zh-TW">Taiwanese</option>
						<option value="tr">Turkish</option>
						<option value="uz">Uzbek</option>
						<option value="vi">Vietnamese</option>
						<option value="cy">Welsh</option>
						<option value="zu">Zulu</option>
					</select>
				</td></tr>
				
				<tr><td>Proficiency</td><td>
				<select name="difficulty" id="difficulty">
		        	<option value="" selected="selected">Select your expertise in target language</option>
					<option class="difficultyDescription" title="No practical understanding of the language" value=3>No Proficiency - No practical understanding</option>
					<option class="difficultyDescription" title="Understand familiar everyday expressions and very basic phrases in areas of immediate needs" value=7>Beginner - Understand very basic phrases</option>
					<option class="difficultyDescription" title="Understand short conversations about basic survival needs and minimum courtesy" value=10>Elementary - Comprehend up to basic survival needs</option>
					<option class="difficultyDescription" title="Can deal with most situations likely to arise while traveling in area where the language is spoken" value=15>Threshold - Understand matters regularly encountered</option>
					<option class="difficultyDescription" title="Understand the essentials of all speech, including technical discussions in one's field of specialization" value=20>Intermediate - Conversational in face-to-face dialogue</option> 	
					<option class="difficultyDescription" title="Express fluently and spontaneously without much obvious searching for expressions" value=30>Operational - Use language flexibly and effectively</option> 	
					<option class="difficultyDescription" title="Can understand virtually everything heard or read" value=50>Advanced - Expert comprehension proficiency</option> 	
				</select> </td></tr>
				
	        	</tbody></table>
	        	<div><input type="button" value="Start learning!" id="completeSetup" class="button"/></div>
	    	</div>

		</div>
	</form>
	</body>
</html>