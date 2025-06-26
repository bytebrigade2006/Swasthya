# document_processor.py (Fixed Version)
import logging
import json
import io
from PIL import Image, ImageEnhance
import pytesseract
from pypdf import PdfReader  # Replaced PyPDF2 with modern pypdf
import google.generativeai as genai
import os

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------- TEXT EXTRACTION IMPROVEMENTS --------------------

def extract_text_from_pdf(pdf_file):
    """
    Improved PDF text extraction using pypdf instead of PyPDF2
    with layout mode for better structure preservation
    """
    try:
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            # Use layout mode for better structure
            page_text = page.extract_text(layout=True)
            if page_text:
                text += page_text + "\n"
        return text.strip() if text else None
    except Exception as e:
        logger.error(f"PDF extraction error: {str(e)}")
        return None

def extract_text_from_image(image_file):
    """
    Enhanced image processing with pre-processing steps
    for better OCR accuracy
    """
    try:
        image = Image.open(image_file)
        
        # Pre-processing steps for better OCR
        image = image.convert('L')  # Convert to grayscale
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)  # Increase contrast
        
        # OCR with config for improved accuracy
        text = pytesseract.image_to_string(
            image,
            config='--psm 6 -c preserve_interword_spaces=1'
        )
        return text.strip() if text else None
    except Exception as e:
        logger.error(f"Image OCR error: {str(e)}")
        return None

# -------------------- AI PROCESSING OPTIMIZATIONS --------------------

def clean_json_response(response_text):
    """More robust JSON cleaning with error handling"""
    try:
        if not response_text or not isinstance(response_text, str):
            return None
            
        # Remove markdown code blocks
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        elif response_text.startswith("```"):
            response_text = response_text[3:]
            
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        # Strip whitespace
        response_text = response_text.strip()
        
        # Extract JSON content
        start = response_text.find('{')
        end = response_text.rfind('}') + 1
        
        if start == -1 or end == 0:
            logger.warning("No JSON structure found in response")
            return None
            
        json_str = response_text[start:end]
        
        # Validate JSON structure
        return json.loads(json_str)
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"JSON cleaning error: {str(e)}")
        return None

# -------------------- GEMINI CLIENT INITIALIZATION --------------------

def init_gemini_client():
    """Improved error handling for Gemini initialization"""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("Gemini API key not found in environment variables")
            return None
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Test the connection
        logger.info("Gemini client initialized successfully")
        return model
        
    except Exception as e:
        logger.error(f"Gemini init error: {str(e)}")
        return None

# -------------------- ADDITIONAL UTILITY FUNCTIONS --------------------

def validate_file_type(file_path, allowed_extensions):
    """Validate file type before processing"""
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return False
        
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext not in allowed_extensions:
        logger.error(f"Unsupported file type: {file_ext}")
        return False
        
    return True

def process_document(file_path):
    """Main document processing function"""
    try:
        # Validate file type
        pdf_extensions = ['.pdf']
        image_extensions = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']
        
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext in pdf_extensions:
            if not validate_file_type(file_path, pdf_extensions):
                return None
            return extract_text_from_pdf(file_path)
            
        elif file_ext in image_extensions:
            if not validate_file_type(file_path, image_extensions):
                return None
            return extract_text_from_image(file_path)
            
        else:
            logger.error(f"Unsupported file type: {file_ext}")
            return None
            
    except Exception as e:
        logger.error(f"Document processing error: {str(e)}")
        return None