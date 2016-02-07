package com.speakeasy.translator.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.speakeasy.translator.model.FeedbackRequest;

public class FeedbackManager {
	private static final Logger logger = LoggerFactory.getLogger(FeedbackManager.class);

	public static void putFeedback(FeedbackRequest feedbackRequest) {
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);

		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);
		
		logger.info("Saving in putFeedback .. " + feedbackRequest);
		dynamoDBMapper.save(feedbackRequest);
	}
}
