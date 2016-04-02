/**
 * 
 */
package com.speakeasy.translator.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.speakeasy.translator.model.FeedbackRequest;
import com.speakeasy.translator.model.TranslationRequest;
import com.speakeasy.translator.service.FeedbackManager;
import com.speakeasy.translator.service.TranslationManager;
import com.speakeasy.translator.service.UserProfileManager;

/**
 * Handles requests for the Translation service.
 * 
 * @author Suman Majumder
 *  any request comes, come here.
 *  a pool of thread 
 *  need to test if each 
 *  make sure no object 
 *
 */
@Controller
public class TranslationController {

	//UserProfileManager userProfileManager = new UserProfileManager();
	// Declear it in a new thread, not outside of the thread.
	
	
	private static final Logger logger = LoggerFactory.getLogger(TranslationController.class);

	// Map to store employees, ideally we should use database
	Map<String, String> translationData = new HashMap<String, String>();

	@RequestMapping(value = TranslatorRestURIConstants.DUMMY_TRANSLATE, method = RequestMethod.GET)
	public @ResponseBody Map<String, String> getDummyTranslation() {
		logger.info("Start getDummyTranslation");
		List<String> wordsToTranslate = new ArrayList<String>();
		wordsToTranslate.add("the");
		wordsToTranslate.add("a");
		wordsToTranslate.add("an");
		wordsToTranslate.add("and");
		wordsToTranslate.add("hello");
		translationData = TranslationManager.translate(wordsToTranslate, "es");
		return translationData;
	}

	
	@RequestMapping(value = TranslatorRestURIConstants.GET_TRANSLATION, method = RequestMethod.GET)
	public @ResponseBody Map<String, String> getTranslation(
			@PathVariable("word") String q,
			@PathVariable("target") String target) {
		
		//Thread thread = new Thread();
		
		logger.info("Start getTranslation. Word=" + q);
		System.out.println("Start getTranslation. Word=" + q);
		List<String> wordsToTranslate = new ArrayList<String>();
		wordsToTranslate.add(q);
		translationData = TranslationManager.translate(wordsToTranslate, target);
		return translationData;
	}
	
	// search translation
	// call method in uerprofileManager in separate thread
	// UserProfileManager.
	
	// changed it to final
	@RequestMapping(value = TranslatorRestURIConstants.TRANSLATE, method = RequestMethod.POST)
	public @ResponseBody Map<String, String> searchTranslations(
			@RequestBody final TranslationRequest request,
			@PathVariable("target") final String target) {
		
		Thread insertUserOrigThread = new Thread() {
		    public void run() {
		    	String origLang = request.getSourceLang(); 
		    	UserProfileManager userProfileManager = new UserProfileManager();
		    	userProfileManager.createOrUpdateUserOrig(request.getEmail(), request.getQ(), origLang);
		    }
		};
		insertUserOrigThread.start();
				
		logger.info("Start searchTranslations with language immersion limit .. " + request.getTranLimit());
		
		UserProfileManager userProfileManager = new UserProfileManager();
		List<String> wordsToTranslate = userProfileManager.getWordsToTranslate(30, request.getTranLimit());
		
		//translationData = TranslationManager.translate(request.getQ(), target);
		translationData = TranslationManager.translate(wordsToTranslate, target);
		logger.info("Obtained translationsin searchTranslations." + translationData.toString());
		
		Thread insertUserTransThread = new Thread(){
			public void run(){
				UserProfileManager userProfileManager = new UserProfileManager();
				userProfileManager.createOrUpdateUserTrans(request.getEmail(), translationData, target);
			}
		};
		insertUserTransThread.start();
		
		return translationData;
	}

	@RequestMapping(value = TranslatorRestURIConstants.SUBMIT_FEEDBACK, method = RequestMethod.POST)
	public @ResponseBody Map<String, String> submitFeedback(
			@RequestBody FeedbackRequest feedbackForm) {
		logger.info("Start submitFeedback.");
		FeedbackManager.putFeedback(feedbackForm);
		logger.info("Completed submitFeedback.");
		Map<String, String> returnMap = new HashMap<String, String>();
		returnMap.put("message", "Thank you, for your feedback!");
		return returnMap;
	}
}

/*
class OperateTalbes{
	
}*/



