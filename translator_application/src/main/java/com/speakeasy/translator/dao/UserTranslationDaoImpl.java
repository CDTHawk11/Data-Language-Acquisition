package com.speakeasy.translator.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.QueryResultPage;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator;
import com.amazonaws.services.dynamodbv2.model.Condition;
import com.speakeasy.translator.controller.TranslatorConstants;
import com.speakeasy.translator.model.UserLevel;
import com.speakeasy.translator.model.UserOriginal;
import com.speakeasy.translator.model.UserProfile;
import com.speakeasy.translator.model.UserTrans;

@Repository("userTranslationDao")
public class UserTranslationDaoImpl implements UserTranslationDao {
	private static final Logger logger = LoggerFactory.getLogger(UserTranslationDaoImpl.class);

// user table	 ----------------------------------------------------
	public void createOrUpdateUser(UserProfile userProfile) {
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		//AmazonDynamoDBClient client = new AmazonDynamoDBClient();
		//client.setEndpoint("http://localhost:8000");
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);
		Date regisDate = new Date();
		userProfile.setRegistrationDate(regisDate.toString());
		logger.info("Saving in createUpdateUser .. " + userProfile);
		dynamoDBMapper.save(userProfile);
	}
	
// user_orig table	-----------------------------------------------
	public void createOrUpdateUserOrig(UserOriginal userOriginal){
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		//AmazonDynamoDBClient client = new AmazonDynamoDBClient();
		//client.setEndpoint("http://localhost:8000");
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);
		
		UserOriginal item = dynamoDBMapper.load(UserOriginal.class, 
				userOriginal.getEmail(), 
				userOriginal.getLangWord()); 
		if(item == null){
			dynamoDBMapper.save(userOriginal);
		}else{
			userOriginal.setFreq(userOriginal.getFreq() + item.getFreq());
			dynamoDBMapper.save(userOriginal);
		}
	}
	
//user_trans table ----------------------------------------------------------------

	public void createOrUpdateUserTrans(UserTrans userTrans){
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		//AmazonDynamoDBClient client = new AmazonDynamoDBClient();
		//client.setEndpoint("http://localhost:8000");
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);
		
		UserTrans item = dynamoDBMapper.load(UserTrans.class, 
				userTrans.getEmail(), 
				userTrans.getLangWord()); 
		if(item == null){
			dynamoDBMapper.save(userTrans);
		}else{
			userTrans.setFreq(userTrans.getFreq() + item.getFreq());
			dynamoDBMapper.save(userTrans);
		}
	}
	
	/*
	 * return words in the user_orig to be translated
	 */
	public List<String> getWordsToTranslate(int immersionRate, String lang, String email){
		logger.info("In getWordsToTranslate for " + email + " with immersion rate " + immersionRate);

		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		//AmazonDynamoDBClient client = new AmazonDynamoDBClient();
		//client.setEndpoint("http://localhost:8000");
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);

		Map<String, AttributeValue> expressionAttributeValues = 
			    new HashMap<String, AttributeValue>();
			expressionAttributeValues.put(":lang", new AttributeValue().withS(lang)); 
			
		Condition rangeKeyConditionLearned = new Condition();
		rangeKeyConditionLearned.withComparisonOperator(ComparisonOperator.GT)
		     .withAttributeValueList(new AttributeValue().withN(String.valueOf(TranslatorConstants.LEARNED_WORDS_THRESHOLD)));

		UserTrans learnedWordKey = new UserTrans();
		learnedWordKey.setEmail(email);
		
		DynamoDBQueryExpression<UserTrans> queryExpressionLearned = new DynamoDBQueryExpression<UserTrans>()
		     .withHashKeyValues(learnedWordKey)
		     .withRangeKeyCondition("freq", rangeKeyConditionLearned)
		     .withFilterExpression("begins_with(lang_word, :lang)")
		     .withExpressionAttributeValues(expressionAttributeValues);
		
		int learnedCount = dynamoDBMapper.count(UserTrans.class, queryExpressionLearned);
		logger.info("Retrieved LearnedCount in getWordsToTranslate " + learnedCount);

		Condition rangeKeyConditionExtra = new Condition();
		rangeKeyConditionExtra.withComparisonOperator(ComparisonOperator.GE)
		     .withAttributeValueList(new AttributeValue().withN(String.valueOf(1)));

		int extra = immersionRate + learnedCount;
		
		UserOriginal extraWordKey = new UserOriginal();
		extraWordKey.setEmail(email);

		DynamoDBQueryExpression<UserOriginal> queryExpressionExtra = new DynamoDBQueryExpression<UserOriginal>()
			     .withHashKeyValues(extraWordKey)
			     .withRangeKeyCondition("freq", rangeKeyConditionExtra)
			     .withFilterExpression("begins_with(lang_word, :lang)")
			     .withExpressionAttributeValues(expressionAttributeValues);

		List<UserOriginal> wordsToTranslate = new ArrayList<UserOriginal>();
		do {
		    QueryResultPage<UserOriginal> resultPage = dynamoDBMapper.queryPage(UserOriginal.class, queryExpressionExtra);
		    wordsToTranslate.addAll(resultPage.getResults());
		    queryExpressionExtra.setExclusiveStartKey(resultPage.getLastEvaluatedKey());

		} while (queryExpressionExtra.getExclusiveStartKey() != null);
		
		Collections.sort(wordsToTranslate);

    	List<String> result = new ArrayList<String>();
    	
    	int index = wordsToTranslate.size()-1;

    	do {
    		result.add(wordsToTranslate.get(index).getLangWord().split("_")[1]);
    		index--;
    	} while(index >= (wordsToTranslate.size() - extra));

 		logger.info("Obtained result in getWordsToTranslate " + result);

		return result;
	}
	
	public UserLevel checkUserLevel(String email, String lang){
		logger.info("In checkUserLevel with email " + email);
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		//AmazonDynamoDBClient client = new AmazonDynamoDBClient();
		//client.setEndpoint("http://localhost:8000");
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);
		UserLevel userLevel = new UserLevel();
				
		Condition rangeKeyConditionLearned = new Condition();
		rangeKeyConditionLearned.withComparisonOperator(ComparisonOperator.GT)
		     .withAttributeValueList(new AttributeValue().withN(String.valueOf(TranslatorConstants.LEARNED_WORDS_THRESHOLD)));

		Condition rangeKeyConditionLearning = new Condition();
		rangeKeyConditionLearning.withComparisonOperator(ComparisonOperator.BETWEEN)
		     .withAttributeValueList(
		    		 new AttributeValue().withN(String.valueOf(TranslatorConstants.LEARNING_WORDS_THRESHOLD)), 
		    		 new AttributeValue().withN(String.valueOf(TranslatorConstants.LEARNED_WORDS_THRESHOLD)));

		UserTrans learnedWordKey = new UserTrans();
		learnedWordKey.setEmail(email);
		
		logger.info("Setting expressionAttributeValues updateUserLevel with lang " + lang);
		Map<String, AttributeValue> expressionAttributeValues = 
			    new HashMap<String, AttributeValue>();
			expressionAttributeValues.put(":lang", new AttributeValue().withS(lang)); 
			
		DynamoDBQueryExpression<UserTrans> queryExpressionLearned = new DynamoDBQueryExpression<UserTrans>()
		     .withHashKeyValues(learnedWordKey)
		     .withRangeKeyCondition("freq", rangeKeyConditionLearned)
		     .withFilterExpression("begins_with(lang_word, :lang)")
		     .withExpressionAttributeValues(expressionAttributeValues);
		
		DynamoDBQueryExpression<UserTrans> queryExpressionLearning = new DynamoDBQueryExpression<UserTrans>()
			     .withHashKeyValues(learnedWordKey)
			     .withRangeKeyCondition("freq", rangeKeyConditionLearning)
			     .withFilterExpression("begins_with(lang_word, :lang)")
			     .withExpressionAttributeValues(expressionAttributeValues);

		int resultCount = dynamoDBMapper.count(UserTrans.class, queryExpressionLearned);
		userLevel.setLearnedCount(resultCount);
		logger.info("Retrieved LearnedCount in checkUserLevel " + resultCount);

		int learningCount = dynamoDBMapper.count(UserTrans.class, queryExpressionLearning);
		userLevel.setLearningCount(learningCount);
		logger.info("Retrieved learningCount in checkUserLevel " + learningCount);

		String level = "";
		
		if(resultCount <= 75) {
			level = "No Proficiency - No practical understanding of the language";
			if((resultCount+learningCount)<=75){
				userLevel.setLearningBeginner(learningCount);
				userLevel.setRemainingBeginner(75-(resultCount+learningCount));
			} else if((resultCount+learningCount)<=200){
				userLevel.setLearningBeginner(75-resultCount);
				userLevel.setLearningElementary(resultCount+learningCount-75);
				userLevel.setRemainingElementary(200-(resultCount+learningCount-75));
			} else {
				userLevel.setLearningBeginner(75-resultCount);
				userLevel.setLearningElementary(200);
				userLevel.setLearningConversational(resultCount+learningCount-275);				
				userLevel.setRemainingConversational(500-(resultCount+learningCount-275));
			}
		} else if(resultCount > 75 && resultCount <= 200) {
			level = "Beginner - Understand familiar everyday expressions and very basic phrases in areas of immediate needs";
			if((resultCount+learningCount)<=200){
				userLevel.setLearningElementary(learningCount);
				userLevel.setRemainingElementary(200-(resultCount+learningCount));
			} else if((resultCount+learningCount)<=500){
				userLevel.setLearningElementary(200-resultCount);
				userLevel.setLearningConversational(resultCount+learningCount-200);
				userLevel.setRemainingConversational(500-(resultCount+learningCount-200));
			} else {
				userLevel.setLearningElementary(200-resultCount);
				userLevel.setLearningConversational(500);
				userLevel.setLearningThreshold(resultCount+learningCount-700);				
				userLevel.setRemainingThreshold(1250-(resultCount+learningCount-700));
			}
		} else if(resultCount > 200 && resultCount <= 500) {
			level = "Elementary - Comprehend upto short conversations about basic survival needs and minimum courtesy";
			if((resultCount+learningCount)<=500){
				userLevel.setLearningConversational(learningCount);
				userLevel.setRemainingConversational(500-(resultCount+learningCount));
			} else if((resultCount+learningCount)<=1250){
				userLevel.setLearningConversational(500-resultCount);
				userLevel.setLearningThreshold(resultCount+learningCount-500);
				userLevel.setRemainingThreshold(1250-(resultCount+learningCount-500));
			} else {
				userLevel.setLearningConversational(500-resultCount);
				userLevel.setLearningThreshold(1250);
				userLevel.setLearningIntermediate(resultCount+learningCount-1750);				
				userLevel.setRemainingIntermediate(2500-(resultCount+learningCount-1750));
			}
		} else if(resultCount > 500 && resultCount <= 1250) {
			level = "Conversational - Understand matters regularly encountered and conversational in face-to-face dialogue";
			if((resultCount+learningCount)<=1250){
				userLevel.setLearningThreshold(learningCount);
				userLevel.setRemainingThreshold(1250-(resultCount+learningCount));
			} else if((resultCount+learningCount)<=2500){
				userLevel.setLearningThreshold(1250-resultCount);
				userLevel.setLearningIntermediate(resultCount+learningCount-1250);
				userLevel.setRemainingIntermediate(2500-(resultCount+learningCount-1250));
			} else {
				userLevel.setLearningThreshold(1250-resultCount);
				userLevel.setLearningIntermediate(2500);
				userLevel.setLearningOperational(resultCount+learningCount-3750);				
				userLevel.setRemainingOperational(6000-(resultCount+learningCount-3750));
			}
		} else if(resultCount > 1250 && resultCount <= 2500) {
			level = "Threshold - Can deal with most situations likely to arise while traveling in area where the language is spoken";
			if((resultCount+learningCount)<=2500){
				userLevel.setLearningIntermediate(learningCount);
				userLevel.setRemainingIntermediate(2500-(resultCount+learningCount));
			} else if((resultCount+learningCount)<=6000){
				userLevel.setLearningIntermediate(2500-resultCount);
				userLevel.setLearningOperational(resultCount+learningCount-2500);
				userLevel.setRemainingOperational(6000-(resultCount+learningCount-2500));
			} else {
				userLevel.setLearningIntermediate(2500-resultCount);
				userLevel.setLearningOperational(6000);
				userLevel.setLearningFluent(resultCount+learningCount-8500);				
				userLevel.setRemainingFluent(12000-(resultCount+learningCount-8500));
			}
		} else if(resultCount > 2500 && resultCount <= 6000) {
			level = "Intermediate - Understand the essentials of all speech, including technical discussions in one's field of specialization";
			if((resultCount+learningCount)<=6000){
				userLevel.setLearningOperational(learningCount);
				userLevel.setRemainingOperational(6000-(resultCount+learningCount));
			} else if((resultCount+learningCount)<=12000){
				userLevel.setLearningOperational(6000-resultCount);
				userLevel.setLearningFluent(resultCount+learningCount-6000);
				userLevel.setRemainingFluent(12000-(resultCount+learningCount-6000));
			} else {
				userLevel.setLearningOperational(6000-resultCount);
				userLevel.setLearningFluent(12000);
				userLevel.setLearningAdvanced(resultCount+learningCount-18000);				
				userLevel.setRemainingAdvanced(20000-(resultCount+learningCount-18000));
			}
		} else if(resultCount > 6000 && resultCount <= 12000) {
			level = "Operational - Use language flexibly and effectively without much obvious searching for expressions";
			if((resultCount+learningCount)<=12000){
				userLevel.setLearningFluent(learningCount);
				userLevel.setRemainingFluent(12000-(resultCount+learningCount));
			} else if((resultCount+learningCount)<=20000){
				userLevel.setLearningFluent(12000-resultCount);
				userLevel.setLearningAdvanced(resultCount+learningCount-12000);
				userLevel.setRemainingAdvanced(20000-(resultCount+learningCount-12000));
			} else {
				userLevel.setLearningFluent(12000-resultCount);
				userLevel.setLearningAdvanced(20000);
			}
		} else if(resultCount > 12000 && resultCount <= 20000) {
			level = "Fluent - Express fluently and spontaneously in face-to-face dialogue or social gathering";
			if((resultCount+learningCount)<=20000){
				userLevel.setLearningAdvanced(learningCount);
				userLevel.setRemainingAdvanced(20000-(resultCount+learningCount));
			} else {
				userLevel.setLearningAdvanced(20000-resultCount);
			}
		} else if(resultCount > 20000) {
			level = "Advanced - Can understand virtually everything heard or read with expert comprehension proficiency";
		} 
		
		userLevel.setLevel(level);
				
		return userLevel;
	}
}
