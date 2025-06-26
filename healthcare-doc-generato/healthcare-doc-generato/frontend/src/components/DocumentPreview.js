import React, { useState } from 'react';
import { generateDocument } from '../services/api';

const DocumentPreview = ({ docType, patientData, claimDetails }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
  console.log("Generating:", { docType, patientData, claimDetails });
  
  setLoading(true);
  try {
    const response = await generateDocument({
      doc_type: docType,
      patient_data: patientData || {},
      claim_details: claimDetails || {}
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${docType}_${patientData?.patient_name || 'Patient'}.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    alert('Generation failed: ' + error.message);
  }
  setLoading(false);
};


  return (
    <div>
      <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : `Generate ${docType}`}
      </button>
    </div>
  );

};

export default DocumentPreview;
