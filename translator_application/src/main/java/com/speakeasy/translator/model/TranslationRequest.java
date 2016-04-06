/**
 * 
 */
package com.speakeasy.translator.model;

import java.io.Serializable;
import java.util.List;

/**
 * @author Suman Majumder
 *
 */
public class TranslationRequest implements Serializable {
	private static final long serialVersionUID = 123456789L;
    
    private List<List<String>> q;
    private String email;
    private String sourceLang;
    private int tranLimit;
    
    
    public List<List<String>> getQ() {
        return q;
    }
    public void setQ(List<List<String>> q) {
        this.q = q;
    }
	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}
	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	/**
	 * @return the sourceLang
	 */
	public String getSourceLang() {
		return sourceLang;
	}
	/**
	 * @param sourceLang the sourceLang to set
	 */
	public void setSourceLang(String sourceLang) {
		this.sourceLang = sourceLang;
	}
	/**
	 * @return the tranLimit
	 */
	public int getTranLimit() {
		return tranLimit;
	}
	/**
	 * @param tranLimit the tranLimit to set
	 */
	public void setTranLimit(int tranLimit) {
		this.tranLimit = tranLimit;
	}
}
