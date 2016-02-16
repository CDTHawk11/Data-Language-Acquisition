package com.speakeasy.translator.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.speakeasy.user.model.UserProfile;

public class UserProfileManager {
	private static final Logger logger = LoggerFactory.getLogger(UserProfileManager.class);

	public static void createOrUpdateUser(UserProfile userProfile) {
		AmazonDynamoDBClient client = new AmazonDynamoDBClient().withRegion(Regions.US_WEST_2);

		DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(client);
		
		logger.info("Saving in createUpdateUser .. " + userProfile);
		dynamoDBMapper.save(userProfile);
	}
}
