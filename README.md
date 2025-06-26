# सWASTHYA – AI-Powered Medical Insurance Claim Assistant

सWASTHYA is a web-based AI assistant designed to streamline and simplify the post-treatment medical insurance claim process. The platform leverages document automation, AI-driven analysis, and multilingual interaction to ensure an accessible, transparent, and user-friendly experience for patients navigating complex insurance claims.

## 🧠 Problem Statement

Filing medical insurance claims is often a frustrating process—especially for patients from non-technical, rural, or underserved backgrounds. Many struggle with:

- Unclear documentation requirements
- Language and literacy barriers
- Time-consuming and error-prone manual submissions
- Lack of real-time assistance or status updates

## 💡 Our Solution

सWASTHYA combines **AI automation**, **OCR technologies**, and **multilingual support** to solve these problems effectively.

---

## 🔧 Features

### 📄 Document Summarization
- Extracts and simplifies long medical reports
- Highlights key information necessary for claims

### 🤖 Insurance Advisor
- AI-driven insights to determine claim eligibility
- Personalized advice based on uploaded medical documents

### 🧾 Auto Document Generator
- Automatically creates professional claim letters, appeals, and emails

### 💬 Multilingual Patient Chatbot
- Real-time answers to queries
- Supports regional languages for greater accessibility

### 🔐 Secure Document Storage
- HIPAA-compliant storage of sensitive medical data

### 📊 Claims Dashboard
- Track status, progress, and timelines of submitted claims
- Visual indicators for pending and completed stages

---

## ⚙️ How It Works

1. **Upload Documents**  
   Upload your medical bills, prescriptions, insurance forms, etc.

2. **AI Analysis**  
   Uses tools like `pdfplumber` and `pytesseract` to extract key information.

3. **Review & Submit**  
   View the auto-generated documents and submit your insurance claim.

4. **Track Progress**  
   Use the Claims Dashboard for real-time updates on your claim status.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (React or Vanilla)
- **Backend:** Python (Flask/FastAPI recommended)
- **OCR Tools:** `pdfplumber`, `pytesseract`
- **AI & NLP:** OpenAI / Hugging Face APIs (for document summarization & chatbot)
- **Storage & Hosting:** GitHub Pages (static) or AWS/GCP (dynamic)

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/nilardri2006/Swasthya.git
   cd Swasthya
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run locally:
   ```bash
   python app.py
   ```

---

## 🧪 Demo

🔗 [Live Demo](https://nilardri2006.github.io/Swasthya/)

Explore how the AI advisor works, try out document uploads, and interact with the multilingual chatbot.

---

## 📌 Future Enhancements

- Integration with hospital and insurer APIs for end-to-end automation
- Enhanced chatbot intelligence with context memory
- WhatsApp-based claim updates for rural users
- Speech-to-text document interpretation for illiterate users

---

## 🤝 Contributors

- Nilardri (Frontend & Deployment)
- Shreesh Chakraborty (Project Analyst)
- Ankit Talukder(AI & Backend)
- Rishan Kumar(UI designer & DBMS manager)
- सWASTHYA – Hackathon Project, 2025

---

## 📜 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
