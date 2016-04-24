package com.speakeasy.user.model;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="user")
public class UserProfile implements Serializable {
	private static final long serialVersionUID = 123456897L;
	
	private String fullName;
	private String email;
	private String occupation;
	private String current;
	private String target;
	private String difficulty;
	private String registrationDate;

	/**
	 * @return the fullName
	 */
	@DynamoDBAttribute(attributeName="name")
	public String getFullName() {
		return fullName;
	}

	/**
	 * @param fullName
	 */
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

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
	 * @return the occupation
	 */
	@DynamoDBAttribute(attributeName="occupation")
	public String getOccupation() {
		return occupation;
	}

	/**
	 * @param occupation
	 */
	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	/**
	 * @return the current
	 */
	@DynamoDBAttribute(attributeName="primaryLanguage")
	public String getCurrent() {
		return current;
	}

	/**
	 * @param current
	 */
	public void setCurrent(String current) {
		this.current = current;
	}

	/**
	 * @return the target
	 */
	@DynamoDBAttribute(attributeName="target")
	public String getTarget() {
		return target;
	}

	/**
	 * @param target
	 */
	public void setTarget(String target) {
		this.target = target;
	}

	/**
	 * @return the difficulty
	 */
	public String getDifficulty() {
		return difficulty;
	}

	/**
	 * @param difficulty
	 */
	public void setDifficulty(String difficulty) {
		this.difficulty = difficulty;
	}
	
	
	@DynamoDBAttribute(attributeName="regisDt")
	public String getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(String registrationDate) {
		this.registrationDate = registrationDate;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("UserProfile [fullName=");
		builder.append(fullName);
		builder.append(", email=");
		builder.append(email);
		builder.append(", occupation=");
		builder.append(occupation);
		builder.append(", current=");
		builder.append(current);
		builder.append(", target=");
		builder.append(target);
		builder.append(", difficulty=");
		builder.append(difficulty);
		builder.append(", registrationDate=");
		builder.append(registrationDate);
		builder.append("]");
		return builder.toString();
	}
}
