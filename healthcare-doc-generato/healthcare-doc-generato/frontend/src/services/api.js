import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const extractText = (file, docType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', docType);
  return API.post('/extract-text', formData);
};

export const extractInfo = (text, docType) => {
  return API.post('/extract-info', { text, document_type: docType });
};

export const generateDocument = (docData) => {
  return API.post('/generate-document', docData, {
    responseType: 'blob' // For file download
  });
};
