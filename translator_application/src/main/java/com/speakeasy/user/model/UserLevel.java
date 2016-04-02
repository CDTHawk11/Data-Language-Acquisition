package com.speakeasy.user.model;

public class UserLevel {
	private static final long serialVersionUID = 123498765L;
	
	private String level;
	private int learnedCount;
	private int learningCount;
	
	/**
	 * @return the level
	 */
	public String getLevel() {
		return level;
	}
	/**
	 * @param level the level to set
	 */
	public void setLevel(String level) {
		this.level = level;
	}
	/**
	 * @return the learnedCount
	 */
	public int getLearnedCount() {
		return learnedCount;
	}
	/**
	 * @param learnedCount the learnedCount to set
	 */
	public void setLearnedCount(int learnedCount) {
		this.learnedCount = learnedCount;
	}
	/**
	 * @return the learningCount
	 */
	public int getLearningCount() {
		return learningCount;
	}
	/**
	 * @param learningCount the learningCount to set
	 */
	public void setLearningCount(int learningCount) {
		this.learningCount = learningCount;
	}
	
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("UserLevel [level=");
		builder.append(level);
		builder.append(", learnedCount=");
		builder.append(learnedCount);
		builder.append(", learningCount=");
		builder.append(learningCount);
		builder.append("]");
		return builder.toString();
	}
}
