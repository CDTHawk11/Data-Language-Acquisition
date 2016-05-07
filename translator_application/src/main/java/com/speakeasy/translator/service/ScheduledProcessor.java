package com.speakeasy.translator.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service("scheduler")
public class ScheduledProcessor {

	@Autowired
	private UserTranslationService userTranslationService;

	@Scheduled(fixedDelay = 120)
	public void processOrig() {
		for (int i = 0; i < 10; i++) {
			userTranslationService.insertUserOrig();
		}
	}

	@Scheduled(fixedDelay = 850)
	public void processTrans() {
		for (int i = 0; i < 10; i++) {
			userTranslationService.insertUserTrans();
		}
	}
}
