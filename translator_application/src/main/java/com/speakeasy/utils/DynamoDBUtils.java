package com.speakeasy.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.QueryResultPage;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator;
import com.amazonaws.services.dynamodbv2.model.Condition;
import com.speakeasy.user.model.UserOriginal;
import com.speakeasy.user.model.UserTrans;

public class DynamoDBUtils {

	public static void deleteFromUserOrig(String email, String lang) {
	    System.err.println("Starting deleteFromUserOrig .. ");
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);

		UserOriginal extraWordKey = new UserOriginal();
		extraWordKey.setEmail(email);

		Map<String, AttributeValue> expressionAttributeValues = 
			    new HashMap<String, AttributeValue>();
			expressionAttributeValues.put(":lang", new AttributeValue().withS(lang)); 

		Condition rangeKeyConditionExtra = new Condition();
		rangeKeyConditionExtra.withComparisonOperator(ComparisonOperator.GE)
		     .withAttributeValueList(new AttributeValue().withN(String.valueOf(1)));

		DynamoDBQueryExpression<UserOriginal> queryExpressionExtra = new DynamoDBQueryExpression<UserOriginal>()
			     .withHashKeyValues(extraWordKey)
			     .withRangeKeyCondition("freq", rangeKeyConditionExtra)
			     .withFilterExpression("begins_with(lang_word, :lang)")
			     .withExpressionAttributeValues(expressionAttributeValues);

		List<UserOriginal> wordsToDelete = new ArrayList<UserOriginal>();
		do {
		    QueryResultPage<UserOriginal> resultPage = dynamoDBMapper.queryPage(UserOriginal.class, queryExpressionExtra);
		    wordsToDelete.addAll(resultPage.getResults());
		    System.err.println("wordsToDelete .. " + wordsToDelete);
		    dynamoDBMapper.batchDelete(wordsToDelete);
		    queryExpressionExtra.setExclusiveStartKey(resultPage.getLastEvaluatedKey());
		} while (queryExpressionExtra.getExclusiveStartKey() != null);
		
	    System.err.println("Exiting deleteFromUserOrig .. ");
	}

	public static void deleteFromUserTrans(String email) {
	    System.err.println("Starting deleteFromUserTrans .. ");
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);
		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);

		UserTrans wordKey = new UserTrans();
		wordKey.setEmail(email);

		Condition rangeKeyCondition = new Condition();
		rangeKeyCondition.withComparisonOperator(ComparisonOperator.GE)
		     .withAttributeValueList(new AttributeValue().withN(String.valueOf(1)));

		DynamoDBQueryExpression<UserTrans> queryExpression = new DynamoDBQueryExpression<UserTrans>()
			     .withHashKeyValues(wordKey)
			     .withRangeKeyCondition("freq", rangeKeyCondition);

		List<UserTrans> wordsToDelete = new ArrayList<UserTrans>();
		do {
		    QueryResultPage<UserTrans> resultPage = dynamoDBMapper.queryPage(UserTrans.class, queryExpression);
		    wordsToDelete.addAll(resultPage.getResults());
		    System.err.println("wordsToDelete .. " + wordsToDelete);
		    dynamoDBMapper.batchDelete(wordsToDelete);
		    queryExpression.setExclusiveStartKey(resultPage.getLastEvaluatedKey());
		} while (queryExpression.getExclusiveStartKey() != null);
		
	    System.err.println("Exiting deleteFromUserTrans .. ");
	}

	public static void main (String args[]) {
		DynamoDBUtils.deleteFromUserOrig("jlancecunningham@gmail.com", "en");
		//DynamoDBUtils.deleteFromUserTrans("sumanm.82@gmail.com");
	}
}
