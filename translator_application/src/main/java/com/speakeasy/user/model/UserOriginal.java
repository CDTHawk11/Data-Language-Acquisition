package com.speakeasy.user.model;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="user_orig")
public class UserOriginal implements Serializable {
	private static final long serialVersionUID = 999000000L;
	
	private String email;
	private String langWord;
	private Integer count;

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
	@DynamoDBAttribute(attributeName="count")
	public int getCount() {
		return count;
	}

	/**
	 * @param count
	 */
	public void setCount(int count) {
		this.count = new Integer(count);
	}

	@Override
	public String toString() {
		return "UserOriginal [email=" + email + ", langWord=" + langWord + ", count=" + count + "]";
	}
}
