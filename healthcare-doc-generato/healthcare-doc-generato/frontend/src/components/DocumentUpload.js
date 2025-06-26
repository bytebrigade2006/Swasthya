import React, { useState } from 'react';
import { extractText } from '../services/api';

const DocumentUpload = ({ onTextExtracted }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first');
      return;
    }
    
    setUploading(true);
    try {
      const response = await extractText(file, 'Medical Report');
      onTextExtracted(response.data.text);
      alert('File uploaded and text extracted successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

return (
  <form onSubmit={handleSubmit}>
    <div 
      className={`upload-box ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div>
        {file ? `Selected: ${file.name}` : 'Drag and drop file here'}
      </div>
      <div style={{ fontSize: '0.9em', color: '#b2b8c6', marginTop: '0.5rem' }}>
        Limit 200MB per file • PDF, PNG, JPG, JPEG
      </div>
      <label>
        <input 
          type="file" 
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />
        Browse files
      </label>
    </div>
    <button type="submit" disabled={uploading}>
      {uploading ? 'Uploading...' : 'Upload Document'}
    </button>
  </form>
);

};

export default DocumentUpload;
