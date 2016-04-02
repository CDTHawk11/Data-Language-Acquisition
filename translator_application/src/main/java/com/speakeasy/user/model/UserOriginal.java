package com.speakeasy.user.model;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="user_orig")
public class UserOriginal implements Serializable, Comparable<UserOriginal> {
	private static final long serialVersionUID = 999000000L;
	
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
	@DynamoDBIndexRangeKey(attributeName="freq", localSecondaryIndexName="OrigCountIndex")
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
		return "UserOriginal [email=" + email + ", langWord=" + langWord + ", freq=" + freq + "]";
	}

	@Override
	public int compareTo(UserOriginal arg0) {
		// TODO Auto-generated method stub
		if(this.getFreq() > arg0.getFreq()){
			return 1;
		}else if(this.getFreq() == arg0.getFreq()){
			return -1;
		}else{
			return 0;
		}
	}
}
