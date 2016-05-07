package com.speakeasy.translator.dao;

import java.util.List;

import com.speakeasy.translator.model.UserLevel;
import com.speakeasy.translator.model.UserOriginal;
import com.speakeasy.translator.model.UserProfile;
import com.speakeasy.translator.model.UserTrans;

public interface UserTranslationDao {
	
	public void createOrUpdateUser(UserProfile userProfile);
	public void createOrUpdateUserOrig(UserOriginal userOriginal);
	public void createOrUpdateUserTrans(UserTrans userTrans);
	public List<String> getWordsToTranslate(int immersionRate, String lang, String email);
	public UserLevel checkUserLevel(String email, String lang);
}