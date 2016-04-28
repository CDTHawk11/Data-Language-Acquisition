package com.speakeasy.translator.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.speakeasy.translator.model.TranslationRequest;
import com.speakeasy.translator.service.UserProfileManager;

@Service
public class SpringAsyncConfig {
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

	@Async
	public void insertUserOrig(TranslationRequest request) {
		List<List<String>> sentences = request.getQ(); 
		List<String> words = flatten(sentences);
		String origLang = request.getSourceLang();
		UserProfileManager userProfileManager = new UserProfileManager();
		userProfileManager.createOrUpdateUserOrig(request.getEmail(), words, origLang);
	}
	
	@Async
	public void insertUserTrans(String email, Map<String, String> translationData, String target) {
		UserProfileManager userProfileManager = new UserProfileManager();
		userProfileManager.createOrUpdateUserTrans(email, translationData, target);
	}
}
