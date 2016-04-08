/**
 * 
 */
package com.speakeasy.translator.controller;

/**
 * @author Suman Majumder
 *
 */
public class TranslatorConstants {
	public static final String DUMMY_TRANSLATE = "/rest/trans/dummy";
	public static final String GET_TRANSLATION = "/rest/trans/{target}/{word}";
	public static final String TRANSLATE = "/rest/trans/{target}";
	public static final String SUBMIT_FEEDBACK = "/rest/submit/feedback";
	public static final String VIEW_PROGRESS = "/rest/view/progress";
	
	public static final int LEARNED_WORDS_THRESHOLD = 25;
	public static final int IMMERSION_THRESHOLD = 100;
}
