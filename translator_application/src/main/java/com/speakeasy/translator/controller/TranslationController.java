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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.speakeasy.translator.model.FeedbackRequest;
import com.speakeasy.translator.model.TranslationRequest;
import com.speakeasy.translator.service.FeedbackManager;
import com.speakeasy.translator.service.TranslationManager;

/**
 * Handles requests for the Translation service.
 * 
 * @author Suman Majumder
 *
 */
@Controller
public class TranslationController {

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
		logger.info("Start getTranslation. Word=" + q);
		List<String> wordsToTranslate = new ArrayList<String>();
		wordsToTranslate.add(q);
		translationData = TranslationManager.translate(wordsToTranslate, target);
		return translationData;
	}

	@RequestMapping(value = TranslatorRestURIConstants.TRANSLATE, method = RequestMethod.POST)
	public @ResponseBody Map<String, String> searchTranslations(
			@RequestBody TranslationRequest request,
			@PathVariable("target") String target) {
		logger.info("Start searchTranslations.");
		translationData = TranslationManager.translate(request.getQ(), target);
		logger.info("Obtained translationsin searchTranslations." + translationData.toString());
		return translationData;
	}
	
	@RequestMapping(value = TranslatorRestURIConstants.SUBMIT_FEEDBACK, method = RequestMethod.POST)
	public @ResponseBody String submitFeedback(@ModelAttribute("feedbackForm") FeedbackRequest feedbackForm) {
		logger.info("Start submitFeedback.");
		FeedbackManager.putFeedback(feedbackForm);
		logger.info("Completed submitFeedback.");
		return "Thank you, for your feedback!";
	}
}
