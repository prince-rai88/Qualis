import io
from pypdf import PdfReader
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract clean text content from PDF file bytes."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        full_text = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                full_text.append(f"--- Page {i + 1} ---\n{text}")
        result = "\n\n".join(full_text).strip()
        if not result:
            return "Warning: No readable text extracted from PDF."
        return result
    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
        return f"Error extracting PDF text: {str(e)}"
