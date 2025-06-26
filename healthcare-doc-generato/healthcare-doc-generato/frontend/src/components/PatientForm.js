import React, { useState, useEffect, useCallback } from 'react';
import { extractInfo } from '../services/api';

const PatientForm = ({ text, docType, onDataExtracted }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    policy_number: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    service_date: '',
    diagnosis: '',
    treatment: '',
    claim_amount: '',
    reason: '',
    provider_name: '',
    insurance_company: ''
  });
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  // Memoized callback to prevent unnecessary re-renders
  const handleDataExtracted = useCallback((data) => {
    if (onDataExtracted) {
      onDataExtracted(data);
    }
  }, [onDataExtracted]);

  useEffect(() => {
    const extractData = async () => {
      if (text && !extracting) {
        setExtracting(true);
        setLoading(true);
        try {
          const response = await extractInfo(text, docType);
          // Merge with existing data instead of replacing
          const newData = { ...formData, ...(response.data || {}) };
          setFormData(newData);
          handleDataExtracted(newData);
        } catch (error) {
          console.error('Extraction failed:', error);
        }
        setLoading(false);
        setExtracting(false);
      }
    };
    extractData();
  }, [text, docType]); // Remove onDataExtracted from deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    // Only update parent if not currently extracting
    if (!extracting) {
      handleDataExtracted(updatedData);
    }
  };

  return (
    <div className="form-section">
      {loading && <div style={{color: '#3de1c9', padding: '1rem'}}>Extracting data...</div>}
      
      <div className="form-card">
        <h3>🧑‍⚕️ Patient Information</h3>
        <div className="form-group">
          <label>Patient Full Name*</label>
          <input 
            name="patient_name" 
            value={formData?.patient_name || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Policy/Member ID*</label>
          <input 
            name="policy_number" 
            value={formData?.policy_number || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Date of Birth*</label>
          <input 
            name="date_of_birth" 
            value={formData?.date_of_birth || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input 
            name="phone" 
            value={formData?.phone || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            name="email" 
            value={formData?.email || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea 
            name="address" 
            value={formData?.address || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="form-card">
        <h3>📑 Claim/Medical Details</h3>
        <div className="form-group">
          <label>Service Date*</label>
          <input 
            name="service_date" 
            value={formData?.service_date || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Diagnosis/Condition*</label>
          <input 
            name="diagnosis" 
            value={formData?.diagnosis || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Treatment/Service*</label>
          <input 
            name="treatment" 
            value={formData?.treatment || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Claim Amount (₹)*</label>
          <input 
            name="claim_amount" 
            value={formData?.claim_amount || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Provider Name</label>
          <input 
            name="provider_name" 
            value={formData?.provider_name || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Insurance Company</label>
          <input 
            name="insurance_company" 
            value={formData?.insurance_company || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Reason for Claim/Appeal*</label>
          <textarea 
            name="reason" 
            value={formData?.reason || ''} 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
