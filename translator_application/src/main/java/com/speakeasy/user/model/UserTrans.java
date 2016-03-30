package com.speakeasy.user.model;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="user_trans")
public class UserTrans implements Serializable {
	private static final long serialVersionUID = 999000001L;
	
	private String email;
	private String langWord;
	private Integer freq;

	/**
	 * @return the email
	 */
	@DynamoDBHashKey(attributeName="email")
	public String getEmail() {
		return email;
	}

	/**
	 * @param email
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the lang_word
	 */
	@DynamoDBRangeKey(attributeName="lang_word")
	public String getLangWord() {
		return langWord;
	}

	/**
	 * @param lang_word
	 */
	public void setLangWord(String langWord) {
		this.langWord = langWord;
	}

	/**
	 * @return the count
	 */
	@DynamoDBAttribute(attributeName="freq")
	public int getFreq() {
		return freq;
	}

	/**
	 * @param count
	 */
	public void setFreq(int freq) {
		this.freq = new Integer(freq);
	}

	@Override
	public String toString() {
		return "UserTrans [email=" + email + ", langWord=" + langWord + ", freq=" + freq + "]";
	}
}
