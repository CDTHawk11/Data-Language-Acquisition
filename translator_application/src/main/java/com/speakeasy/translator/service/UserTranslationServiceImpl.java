package com.speakeasy.translator.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.speakeasy.translator.dao.UserTranslationDao;
import com.speakeasy.translator.model.TranslationRequest;
import com.speakeasy.translator.model.UserLevel;
import com.speakeasy.translator.model.UserOriginal;
import com.speakeasy.translator.model.UserProfile;
import com.speakeasy.translator.model.UserTrans;

@Service("userTranslationService")
public class UserTranslationServiceImpl implements UserTranslationService {
	private static final Logger logger = LoggerFactory.getLogger(UserTranslationServiceImpl.class);
	
	private static ConcurrentLinkedQueue<UserOriginal> originalWordPipe = new ConcurrentLinkedQueue<UserOriginal>();
	private static ConcurrentLinkedQueue<UserTrans> translationWordPipe = new ConcurrentLinkedQueue<UserTrans>();
	
	@Autowired
	private UserTranslationDao userTranslationDao;

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
	
	private Map<String, Integer> countWordNumber(List<String> list){
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

	private Map<String, Integer> countWordNumber(Map<String, String> map){		
		Map<String, Integer> wordCount = new HashMap<String, Integer>();
		List<String> words = new ArrayList<String>();
		for(String str : map.values()){
			words.addAll(Arrays.asList(str.trim().split(" ")));
		}
		for(String word : words){
			if(wordCount.containsKey(word)){
				wordCount.put(word, 1 + wordCount.get(word));
			}else{
				wordCount.put(word, 1);
			}
		}
		return wordCount;
	}

	@Async
	public void enqueueUserOrig(TranslationRequest request){
		logger.info("Saving in enqueueUserOrig for .. " + request.getEmail());
		
		List<String> words = flatten(request.getQ());
		
		Map<String, Integer> wordCount = countWordNumber(words);
		
		for(String str : wordCount.keySet()){
			UserOriginal userOriginal = new UserOriginal();
			userOriginal.setEmail(request.getEmail());
			userOriginal.setLangWord(request.getSourceLang() + "_" + str);
			userOriginal.setFreq(wordCount.get(str));
			originalWordPipe.add(userOriginal);
		}
	}

	@Async
	public void enqueueUserTrans(String email, Map<String, String> translationData, String target){
		logger.info("Saving in enqueueUserTrans for .. " + email);
				
		Map<String, Integer> wordCount = countWordNumber(translationData);
		
		for(String str : wordCount.keySet()){
			UserTrans userTrans = new UserTrans();
			userTrans.setEmail(email);
			userTrans.setLangWord(target + "_" + str);
			userTrans.setFreq(wordCount.get(str));
			translationWordPipe.add(userTrans);
		}
	}

	public void insertUserOrig(){
		UserOriginal userOriginal = originalWordPipe.poll();

		if(userOriginal != null) {
			userTranslationDao.createOrUpdateUserOrig(userOriginal);
		}
	}

	public void insertUserTrans(){
		UserTrans userTrans = translationWordPipe.poll();

		if(userTrans != null) {
			userTranslationDao.createOrUpdateUserTrans(userTrans);
		}
	}
	
	public List<String> getWordsToTranslate(TranslationRequest request) {
		return userTranslationDao.getWordsToTranslate(request.getTranLimit(), request.getSourceLang(), request.getEmail());
	}
	
	public UserLevel checkUserLevel(String email, String lang) {
		return userTranslationDao.checkUserLevel(email, lang);
	}
	
	public void createOrUpdateUser(UserProfile userProfile) {
		userTranslationDao.createOrUpdateUser(userProfile);
	}
}
