package com.speakeasy.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.speakeasy.translator.service.UserTranslationService;

@Service("scheduler")
public class ScheduledProcessor {
	private static final Logger logger = LoggerFactory.getLogger(ScheduledProcessor.class);

	@Autowired
	private UserTranslationService userTranslationService;

	@Scheduled(fixedDelay = 1000)
	public void processOrig() {
		int count = 0;
		for (int i = 0; i < 25; i++) {
			boolean isProcessed = userTranslationService.insertUserOrig();
			
			if(isProcessed) {
				count++;
			}
		}
		
		if(count > 0) {
			logger.info("processOrig inserted .. " + count);
		}
	}

	@Scheduled(fixedDelay = 5000)
	public void processTrans() {
		int count = 0;
		for (int i = 0; i < 10; i++) {
			boolean isProcessed = userTranslationService.insertUserTrans();
			
			if(isProcessed) {
				count++;
			}
		}
		
		if(count > 0) {
			logger.info("processTrans inserted .. " + count);
		}
	}
}
