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
    
    private List<String> q;
    
    public List<String> getQ() {
        return q;
    }
    public void setQ(List<String> q) {
        this.q = q;
    }
}
