from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from document_processor import *
from doc_generator import *
import os
import io

app = Flask(__name__)
CORS(app)

@app.route('/extract-text', methods=['POST'])
def handle_extraction():
    file = request.files['file']
    doc_type = request.form['document_type']
    
    if file.filename.endswith('.pdf'):
        text = extract_text_from_pdf(file)
    elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        text = extract_text_from_image(file)
    else:
        return jsonify({"error": "Unsupported file type"}), 400
    
    return jsonify({"text": text})

@app.route('/extract-info', methods=['POST'])
def handle_info_extraction():
    data = request.json
    extracted_data = extract_information(data['text'], data['document_type'])
    return jsonify(extracted_data)

@app.route('/generate-document', methods=['POST'])
def handle_document_generation():
    try:
        data = request.json
        print("Received data:", data)
        
        # Map frontend data to backend format

        patient_data = data['patient_data']
        claim_details = data['claim_details']

        
        claim_details = {
            'service_date': data['claim_details'].get('service_date', ''),
            'diagnosis': data['claim_details'].get('diagnosis', ''),
            'treatment': data['claim_details'].get('treatment', ''),
            'amount': data['claim_details'].get('claim_amount', ''),
            'reason': data['claim_details'].get('reason', ''),
            'provider_name': data['claim_details'].get('provider_name', ''),
            'insurance_company': data['claim_details'].get('insurance_company', '')
        }
        
        content = generate_document_content(
            data['doc_type'],
            patient_data,
            claim_details
        )
        
        if not content:
            return jsonify({"error": "Failed to generate content"}), 500
            
        doc_bytes = create_word_document(
            content,
            data['doc_type'],
            patient_data.get('patient_name', 'Patient')
        )
        
        return send_file(
            io.BytesIO(doc_bytes),
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            download_name=f"{data['doc_type']}.docx"
        )
        
    except Exception as e:
        print("Generation error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
