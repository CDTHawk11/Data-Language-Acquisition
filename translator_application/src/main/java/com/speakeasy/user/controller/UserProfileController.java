/**
 * 
 */
package com.speakeasy.user.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.speakeasy.translator.service.UserProfileManager;
import com.speakeasy.user.model.UserProfile;

/**
 * Handles requests for the User service.
 * 
 * @author Suman Majumder
 *
 */
@Controller
public class UserProfileController {

	private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);

	@RequestMapping(value = UserProfileRestURIConstants.SETUP_PROFILE, method = RequestMethod.GET)
	public String setupProfile() {
		logger.info("Start setupProfile.");
		return "profileSetup";
	}

	@RequestMapping(value = UserProfileRestURIConstants.SAVE_PROFILE, method = RequestMethod.POST)
	public void saveProfile(@ModelAttribute UserProfile userProfile, Model model) {
		logger.info("Start saveProfile.");
		model.addAttribute("userProfile", userProfile);
		UserProfileManager.createOrUpdateUser(userProfile);
	}
}
