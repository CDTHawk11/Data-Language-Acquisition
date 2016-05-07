package com.speakeasy.translator.service;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service("scheduler")
public class ScheduledProcessor {
	private static final Logger logger = LoggerFactory.getLogger(ScheduledProcessor.class);

	@Autowired
	private UserTranslationService userTranslationService;

	@Scheduled(fixedDelay = 500)
	public void processOrig() {
		logger.info("processOrig next chunk .. " + new Date());
		for (int i = 0; i < 25; i++) {
			userTranslationService.insertUserOrig();
		}
	}

	@Scheduled(fixedDelay = 1000)
	public void processTrans() {
		logger.info("processTrans next chunk .. " + new Date());
		for (int i = 0; i < 10; i++) {
			userTranslationService.insertUserTrans();
		}
	}
}
