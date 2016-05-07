package com.speakeasy.translator.service;

import java.util.List;
import java.util.Map;

import com.speakeasy.translator.model.TranslationRequest;
import com.speakeasy.translator.model.UserLevel;
import com.speakeasy.translator.model.UserProfile;

public interface UserTranslationService {
	
	public void createOrUpdateUser(UserProfile userProfile);
	public void enqueueUserOrig(TranslationRequest request);
	public void enqueueUserTrans(String email, Map<String, String> translationData, String target);
	public void insertUserOrig();
	public void insertUserTrans();
	public List<String> getWordsToTranslate(TranslationRequest request);
	public UserLevel checkUserLevel(String email, String lang);
}
