/**
 * 
 */
package com.speakeasy.translator.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.google.api.services.translate.Translate;
import com.google.api.services.translate.model.TranslationsListResponse;
import com.google.api.services.translate.model.TranslationsResource;

/**
 * Translating a text
 * 
 * @author Suman Majumder
 *
 */
public class TranslationManager {
	public static Map<String,String> translate(List<String> wordsToTranslate, String targetLanguage) {
		Map<String,String> translations = new HashMap<String,String>();
		Iterator<String> toTranslateIter = wordsToTranslate.iterator();
		try {
			// See comments on
			// https://developers.google.com/resources/api-libraries/documentation/translate/v2/java/latest/
			// on options to set
			Translate translate = new Translate.Builder(
					com.google.api.client.googleapis.javanet.GoogleNetHttpTransport.newTrustedTransport(),
					com.google.api.client.json.jackson2.JacksonFactory.getDefaultInstance(), null)
							.setApplicationName("SpeakEasy-Translator") // App-Name
							.build();
			int j = 0;
			while(j < wordsToTranslate.size()){
				j+=120;
				int maximum = wordsToTranslate.size()-1;
				List<String> batch = wordsToTranslate.subList(j-120, Math.min(j,maximum));
			
				Translate.Translations.List list = translate.new Translations().list(batch, targetLanguage);
				// Set your API-Key from https://console.developers.google.com/
				list.setKey("AIzaSyCKErN77nZ6xwXNxdLT7onHcLPFGnjd6PA");
				TranslationsListResponse response = list.execute();
				for (TranslationsResource tr : response.getTranslations()) {
					translations.put(toTranslateIter.next(), tr.getTranslatedText());
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return translations;
	}
}
