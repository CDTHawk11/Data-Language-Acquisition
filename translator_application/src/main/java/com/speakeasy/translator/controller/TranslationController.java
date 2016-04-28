/**
 * 
 */
package com.speakeasy.translator.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
import com.speakeasy.user.model.UserLevel;

/**
 * Handles requests for the Translation service.
 * 
 * @author Suman Majumder any request comes, come here. a pool of thread need to
 *         test if each make sure no object
 *
 */
@Controller
public class TranslationController {

	// UserProfileManager userProfileManager = new UserProfileManager();
	// Declear it in a new thread, not outside of the thread.

	private static final Logger logger = LoggerFactory.getLogger(TranslationController.class);
	
	@Autowired
	private SpringAsyncConfig asyncConfig;

	// Map to store employees, ideally we should use database
	Map<String, String> translationData = new HashMap<String, String>();

	@RequestMapping(value = TranslatorConstants.DUMMY_TRANSLATE, method = RequestMethod.GET)
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

	@RequestMapping(value = TranslatorConstants.GET_TRANSLATION, method = RequestMethod.GET)
	public @ResponseBody Map<String, String> getTranslation(@PathVariable("word") String q,
			@PathVariable("target") String target) {

		// Thread thread = new Thread();

		logger.info("Start getTranslation. Word=" + q);
		List<String> wordsToTranslate = new ArrayList<String>();
		wordsToTranslate.add(q);
		translationData = TranslationManager.translate(wordsToTranslate, target);
		return translationData;
	}

	private List<String> wordsToTranslate(List<String> words, Integer tranLimit){
		Map<String, Integer> wordCounts = new HashMap<String, Integer>();
		List<String> toTranslate = new ArrayList<String>();
		for(int i=0;i<words.size();i++){
			String word = words.get(i);
			if (wordCounts.containsKey(words)){
				wordCounts.put(word, wordCounts.get(word)+1);
			}
			else{
				wordCounts.put(word,1);
			}
		}
		// sort by freq
		Set<Entry<String,Integer>> set = wordCounts.entrySet();
		List<Entry<String,Integer>> list = new ArrayList<Entry<String,Integer>>(set);
		Collections.sort(list, new Comparator<Map.Entry<String,Integer>>(){
			public int compare(Map.Entry<String,Integer> o1, Map.Entry<String,Integer>o2){
				return o2.getValue().compareTo(o1.getValue());
			}
		});
		
		for(int j=0;j<tranLimit;j++){
			toTranslate.add(list.get(j).getKey());
		}
		
		return toTranslate;
	}
	
	private List<String> flatten(List<List<String>> sentences){
		List<String> words = new ArrayList<String>(); 
		for (int i = 0; i < sentences.size(); i++) {
			List<String> sentence = sentences.get(i);
			for (int j = 0; j < sentence.size(); j++) {
				words.add(sentence.get(j));
			}
		}
		return words;
	}
	
	private String joinPhrase(List<String> words){
		String phrase = "";
		for (int i=0;i<words.size();i++){
			phrase = phrase.concat(words.get(i));
			if (i<words.size()-1){
				phrase = phrase.concat(" ");
			}
		}
		return phrase;
	}
	private List<String> getPhrases(List<List<String>> sentences,List<String>toTranslate){
		logger.info("Starting getPhrases.");
		List<String> phrasesList = new ArrayList<String>();
		Set<String> phrases = new HashSet<String>();
		List<String> phrase;
		
		int midphrase = 0;
		for(int s=0;s<sentences.size();s++){
			List<String> sentence = sentences.get(s);
			midphrase = 0;
			phrase = new ArrayList<String>();
			for(int i=0;i<sentence.size();i++){
				String word = sentence.get(i);
				// if we're in the middle of a potential phrase:
				if (midphrase == 1){
					// check if it needs to be translated
					if(toTranslate.contains(word)){
						phrase.add(word);
						
						if (i == (sentence.size()-1)){
							if (phrase.size()>1){
								phrases.add(joinPhrase(phrase));
							}
						}
					}
					else{
						if (phrase.size()>1){
							phrases.add(joinPhrase(phrase));
						}
						phrase = new ArrayList<String>();
					}
				}
				else{
					phrase = new ArrayList<String>();
					if (toTranslate.contains(word)){
						phrase.add(word);
						midphrase = 1;
					}
				}
			}
		}
		logger.info("Returning from getPhrases." + phrases);
		phrasesList.addAll(phrases);
		return phrasesList;
		
	}


	// search translation
	@RequestMapping(value = TranslatorConstants.TRANSLATE, method = RequestMethod.POST)
	public @ResponseBody Map<String, String> searchTranslations(@RequestBody final TranslationRequest request,
			@PathVariable("target") final String target) {
		
		asyncConfig.insertUserOrig(request);

		logger.info("Start searchTranslations with language immersion limit .. " + request.getTranLimit());

		UserProfileManager userProfileManager = new UserProfileManager();
		List<String> wordsToTranslate = userProfileManager.getWordsToTranslate(request.getTranLimit(), request.getSourceLang(), request.getEmail());
		
		List<List<String>> sentences = request.getQ(); 
		
		if (wordsToTranslate.size() == 0) {
			List<String> words = new ArrayList<String>();
			
			words = flatten(sentences);
			List<String> toTranslate = wordsToTranslate(words, request.getTranLimit());
			
			logger.info("Most frequent words sent from the request - " + toTranslate);

			List<String> phrases = getPhrases(sentences,toTranslate);
			wordsToTranslate.addAll(phrases);
			wordsToTranslate.addAll(toTranslate);
		}
		else{
			logger.info("Top list of words from database - " + wordsToTranslate);

			List<String> phrases = getPhrases(sentences, wordsToTranslate);
			wordsToTranslate.addAll(phrases);
			logger.info("Sent phrases for translation - " + phrases.size());
			logger.info("Sent wtt for translation - " + wordsToTranslate.size());
		}
		// translationData = TranslationManager.translate(request.getQ(),target);
		translationData = TranslationManager.translate(wordsToTranslate, target);
		logger.info("Obtained translations in searchTranslations." + translationData.toString());
		
		asyncConfig.insertUserTrans(request.getEmail(), translationData, target);

		UserLevel userLevel = userProfileManager.checkUserLevel(request.getEmail(), target);
		logger.info("Obtained userLevel in searchTranslations." + userLevel);

		translationData.put("LearnedWordCount", String.valueOf(userLevel.getLearnedCount()));
		translationData.put("LearningWordCount", String.valueOf(userLevel.getLearningCount()));

		return translationData;
	}

	@RequestMapping(value = TranslatorConstants.VIEW_PROGRESS, method = RequestMethod.POST)
	public String viewProgress(@RequestBody TranslationRequest request, Model model,
			@PathVariable("target") final String target) {
		logger.info("Start viewProgress.");

		UserProfileManager userProfileManager = new UserProfileManager();
		UserLevel userLevel = userProfileManager.checkUserLevel(request.getEmail(), target);
		logger.info("Obtained userLevel in searchTranslations." + userLevel);

		model.addAttribute("progressInfo", userLevel);

		return "progressChart";
	}

	@RequestMapping(value = TranslatorConstants.VIEW_SURVEY, method = RequestMethod.GET)
	public String viewSurvey(Locale locale, Model model) {
		logger.info("Start viewSurvey.");

		return "survey";
	}

	@RequestMapping(value = TranslatorConstants.SUBMIT_FEEDBACK, method = RequestMethod.POST)
	public @ResponseBody Map<String, String> submitFeedback(@RequestBody FeedbackRequest feedbackForm) {
		logger.info("Start submitFeedback.");
		FeedbackManager.putFeedback(feedbackForm);
		logger.info("Completed submitFeedback.");
		Map<String, String> returnMap = new HashMap<String, String>();
		returnMap.put("message", "Thank you, for your feedback!");
		return returnMap;
	}
}
