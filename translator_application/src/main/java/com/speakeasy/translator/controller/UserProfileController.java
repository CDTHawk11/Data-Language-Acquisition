/**
 * 
 */
package com.speakeasy.translator.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.speakeasy.translator.model.UserProfile;
import com.speakeasy.translator.service.UserTranslationService;

/**
 * Handles requests for the User service.
 * 
 * @author Suman Majumder
 *
 */
@Controller
public class UserProfileController {

	private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);
	
	@Autowired
	private UserTranslationService userTranslationService;

	@RequestMapping(value = TranslatorConstants.SETUP_PROFILE, method = RequestMethod.GET)
	public String setupProfile() {
		logger.info("Start setupProfile.");
		return "profileSetup";
	}

	@RequestMapping(value = TranslatorConstants.SAVE_PROFILE, method = RequestMethod.POST)
	public @ResponseBody Map<String, String> saveProfile(
			@RequestBody UserProfile userProfile) {
		logger.info("Start saveProfile.");
		userTranslationService.createOrUpdateUser(userProfile);
		logger.info("Completed saveProfile.");
		Map<String, String> returnMap = new HashMap<String, String>();
		returnMap.put("message", "done");
		return returnMap;
	}
}
