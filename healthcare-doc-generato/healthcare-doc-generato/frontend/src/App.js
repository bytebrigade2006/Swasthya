import React, { useState } from 'react';
import './App.css';
import DocumentPreview from './components/DocumentPreview';
import DocumentUpload from './components/DocumentUpload';
import PatientForm from './components/PatientForm';

function App() {
  const [text, setText] = useState('');
  const [docType, setDocType] = useState('Insurance Claim Letter');
  const [patientData, setPatientData] = useState({});
  const [claimDetails, setClaimDetails] = useState({});

  return (
    <div className="app-container">
      <aside>
        <div>
          <h2>📁 Document Upload & Auto-Fill</h2>
          <DocumentUpload onTextExtracted={setText} />
        </div>
        
        <div>
          <h3>⚙️ Document Settings</h3>
          <label>Select Document Type</label>
          <select value={docType} onChange={e => setDocType(e.target.value)}>
            <option>Insurance Claim Letter</option>
            <option>Medical Report</option>
            <option>Appeal Letter</option>
          </select>
        </div>
        
        <div>
          <h3>📋 Instructions</h3>
          <ol className="instructions">
            <li>Upload a document (optional) to auto-fill form fields</li>
            <li>Fill in remaining required fields (marked with *)</li>
            <li>Select the appropriate document type</li>
            <li>Click 'Generate Document'</li>
            <li>Review and download the generated document</li>
          </ol>
        </div>
      </aside>

      <main>
        <div className="header">AI Healthcare Document Generator</div>
        <div className="subheader">
          Generate professional claim letters, appeals, and healthcare documents automatically using Google Gemini AI
        </div>
        
        <PatientForm
          text={text}
          docType={docType}
          onDataExtracted={data => {
            setPatientData(data);
            setClaimDetails(data);
          }}
        />
        
        <DocumentPreview
          docType={docType}
          patientData={patientData}
          claimDetails={claimDetails}
        />
      </main>
    </div>
  );
}

export default App;
