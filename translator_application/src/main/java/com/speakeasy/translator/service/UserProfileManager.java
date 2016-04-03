package com.speakeasy.translator.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator;
import com.amazonaws.services.dynamodbv2.model.Condition;
import com.speakeasy.user.model.UserLevel;
import com.speakeasy.user.model.UserOriginal;
import com.speakeasy.user.model.UserProfile;
import com.speakeasy.user.model.UserTrans;

public class UserProfileManager {
	private static final Logger logger = LoggerFactory.getLogger(UserProfileManager.class);

// user table	 ----------------------------------------------------
	public void createOrUpdateUser(UserProfile userProfile) {
		DynamoDBMapper dynamoDBMapper = getMapper();
		logger.info("Saving in createUpdateUser .. " + userProfile);
		dynamoDBMapper.save(userProfile);
	}
	
	public UserProfile loadUserItem(UserProfile userProfile){
		return loadUserItem(userProfile.getEmail());
	}
	
	public UserProfile loadUserItem(String email){
		DynamoDBMapper dynamoDBMapper = getMapper();
		UserProfile item = dynamoDBMapper.load(UserProfile.class, email);
		return item;
	}
	
// user_orig table	-----------------------------------------------
	public void createOrUpdateUserOrig(UserOriginal userOriginal){
		DynamoDBMapper dynamoDBMapper = getMapper();
		logger.info("Saving in createUpdateUserOrig .. " + userOriginal);
		
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
	
	
	public void createOrUpdateUserOrig(String email, List<String> origList, String origLang){
		logger.info("Saving in createUpdateUserOrig .. " + "request list");
		Map<String, Integer> wordCount = countWordNumber(origList);
		UserOriginal userOriginal = new UserOriginal();
		
		for(String str : wordCount.keySet()){
			userOriginal.setEmail(email);
			userOriginal.setLangWord(origLang + "_" + str);
			userOriginal.setFreq(wordCount.get(str));
			createOrUpdateUserOrig(userOriginal);
		}
	}

	
	public UserOriginal loadUserOrigItem(UserOriginal userOriginal){
		return loadUserOrigItem(userOriginal.getEmail(), userOriginal.getLangWord());
	}
	
	public UserOriginal loadUserOrigItem(String email, String langWord){
		DynamoDBMapper dynamoDBMapper = getMapper();
		return dynamoDBMapper.load(UserOriginal.class, email, langWord);
	}
	
//user_trans table ----------------------------------------------------------------

	public void createOrUpdateUserTrans(UserTrans userTrans){
		DynamoDBMapper dynamoDBMapper = getMapper();
		logger.info("Saving in createUpdateUserTrans .. " + userTrans);
		
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
	
	
	public void createOrUpdateUserTrans(String email, Map<String, String> transList, String transLang){
		Map<String, Integer> wordCount = countWordNumber(transList);
		logger.info("Saving in createUpdateUserTrans .. " + "request list");
		
		UserTrans userTrans = new UserTrans();
		
		for(String str : wordCount.keySet()){
			userTrans.setEmail(email);
			userTrans.setLangWord(transLang + "_" + str);
			userTrans.setFreq(wordCount.get(str));
			createOrUpdateUserTrans(userTrans);
		}
	}
	
	public UserTrans loadUserTransItem(UserTrans userTrans){
		return loadUserTransItem(userTrans.getEmail(), userTrans.getLangWord());
	}
	
	public UserTrans loadUserTransItem(String user, String langWord){
		DynamoDBMapper dynamoDBMapper = getMapper();
		return dynamoDBMapper.load(UserTrans.class, user, langWord);
	}
	
	
	/*
	 * get mapper instance
	 */
	public DynamoDBMapper getMapper(){
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		//AmazonDynamoDBClient client = new AmazonDynamoDBClient();
		//client.setEndpoint("http://localhost:8000");
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);
		return dynamoDBMapper;
	}
	 
	
	/*
	 * return words in the user_orig to be translated
	 */
	public List<String> getWordsToTranslate(int threshold, int extra){
		DynamoDBMapper dynamoDBMapper = getMapper();

    	HashMap<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
    	eav.put(":v1", new AttributeValue().withN("1"));
    	       
    	DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
    	/*
    	    .withFilterExpression("freq >= :v1")
    	    .withExpressionAttributeValues(eav);*/
    	List<UserOriginal> replies =  dynamoDBMapper.scan(UserOriginal.class, scanExpression);
    	
    	List<String> result = new ArrayList<String>();
    	
    	PriorityQueue<UserOriginal> backup = new PriorityQueue<UserOriginal>();
    	for(UserOriginal uo : replies){
    		if(uo.getFreq() >= threshold){
    			result.add(uo.getLangWord().split("_")[1]);
    		}else{
    			backup.offer(uo);
    		}
    	}
    	while(!backup.isEmpty() && extra > 0){
    		System.out.println("extra: " + extra + "\t" + backup.peek().getLangWord());
    		result.add(backup.poll().getLangWord().split("_")[1]);
    		--extra;
    	}
		return result;
	}

	
	
	/*
	 * count occurrence of each word
	 */
	public Map<String, Integer> countWordNumber(Map<String, String> map){		
		Map<String, Integer> wordCount = new HashMap<String, Integer>();
		for(String str : map.values()){
			if(wordCount.containsKey(str)){
				wordCount.put(str, 1 + wordCount.get(str));
			}else{
				wordCount.put(str, 1);
			}
		}
		return wordCount;
	}
	
	public Map<String, Integer> countWordNumber(List<String> list){
		Map<String, Integer> wordCount = new HashMap<String, Integer>();
		for(String str : list){
			if(wordCount.containsKey(str)){
				wordCount.put(str, 1 + wordCount.get(str));
			}else{
				wordCount.put(str, 1);
			}
		}
		return wordCount;
	}

	public UserLevel checkUserLevel(String email){
		logger.info("In updateUserLevel with email " + email);
		DynamoDBMapper dynamoDBMapper = getMapper();
		UserLevel userLevel = new UserLevel();
				
		Condition rangeKeyConditionLearned = new Condition();
		rangeKeyConditionLearned.withComparisonOperator(ComparisonOperator.GE)
		     .withAttributeValueList(new AttributeValue().withN(String.valueOf(25)));

		Condition rangeKeyConditionLearning = new Condition();
		rangeKeyConditionLearning.withComparisonOperator(ComparisonOperator.LT)
		     .withAttributeValueList(new AttributeValue().withN(String.valueOf(25)));

		UserTrans learnedWordKey = new UserTrans();
		learnedWordKey.setEmail(email);
		
		DynamoDBQueryExpression<UserTrans> queryExpressionLearned = new DynamoDBQueryExpression<UserTrans>()
		     .withHashKeyValues(learnedWordKey)
		     .withRangeKeyCondition("freq", rangeKeyConditionLearned);
		
		DynamoDBQueryExpression<UserTrans> queryExpressionLearning = new DynamoDBQueryExpression<UserTrans>()
			     .withHashKeyValues(learnedWordKey)
			     .withRangeKeyCondition("freq", rangeKeyConditionLearning);

		int resultCount = dynamoDBMapper.count(UserTrans.class, queryExpressionLearned);
		userLevel.setLearnedCount(resultCount);
		userLevel.setLearningCount(dynamoDBMapper.count(UserTrans.class, queryExpressionLearning));
		
		String level = "No Proficiency - No practical understanding of the language";
		
		if(resultCount > 75 && resultCount <= 200) {
			level = "Beginner - Understand familiar everyday expressions and very basic phrases in areas of immediate needs";
		} else if(resultCount > 200 && resultCount <= 500) {
			level = "Elementary - Comprehend upto short conversations about basic survival needs and minimum courtesy";
		} else if(resultCount > 500 && resultCount <= 1250) {
			level = "Conversational - Understand matters regularly encountered and conversational in face-to-face dialogue";
		} else if(resultCount > 1250 && resultCount <= 2500) {
			level = "Threshold - Can deal with most situations likely to arise while traveling in area where the language is spoken";
		} else if(resultCount > 2500 && resultCount <= 6000) {
			level = "Intermediate - Understand the essentials of all speech, including technical discussions in one's field of specialization";
		} else if(resultCount > 6000 && resultCount <= 12000) {
			level = "Operational - Use language flexibly and effectively without much obvious searching for expressions";
		} else if(resultCount > 12000 && resultCount <= 20000) {
			level = "Fluent - Express fluently and spontaneously in face-to-face dialogue or social gathering";
		} else if(resultCount > 20000) {
			level = "Advanced - Can understand virtually everything heard or read with expert comprehension proficiency";
		} 
		
		userLevel.setLevel(level);
		
		logger.info("Returning from updateUserLevel, resultCount .. " + resultCount);
		
		return userLevel;
	}
}
