from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2image import convert_from_bytes
from PIL import Image
import io
import zipfile
import os
import tempfile
import magic
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Get allowed origins from environment variable
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
logger.info(f"Allowed origins: {allowed_origins}")

CORS(app, resources={
    r"/*": {  # Allow CORS for all routes
        "origins": allowed_origins,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# File size limits
MAX_PDF_SIZE = 15 * 1024 * 1024  # 15MB for PDF files
MAX_TOTAL_JPG_SIZE = 15 * 1024 * 1024  # 15MB for combined JPG files
app.config['MAX_CONTENT_LENGTH'] = MAX_TOTAL_JPG_SIZE  # Maximum total request size

def is_valid_pdf(file_content):
    """Check if the file content is actually a PDF."""
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(file_content)
    return file_type == 'application/pdf'

def is_valid_jpeg(file_content):
    """Check if the file content is actually a JPEG."""
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(file_content)
    return file_type.startswith('image/jpeg')

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "running",
        "endpoints": {
            "pdf_to_jpg": "/api/pdf-to-jpg",
            "jpg_to_pdf": "/api/jpg-to-pdf"
        },
        "limits": {
            "pdf_max_size": "15MB",
            "jpg_total_max_size": "15MB"
        }
    })

@app.route("/api/pdf-to-jpg", methods=["POST"])
def convert_pdf_to_jpg():
    logger.info("Received PDF to JPG request")
    
    if 'file' not in request.files:
        return jsonify({
            "error": "No PDF file uploaded",
            "details": "Please select a PDF file to convert"
        }), 400

    pdf_file = request.files['file']
    
    # Check file extension
    if not pdf_file.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Invalid file type",
            "details": "Only PDF files are accepted"
        }), 400

    # Read file content
    pdf_content = pdf_file.read()
    
    # Check file size
    file_size = len(pdf_content)
    if file_size > MAX_PDF_SIZE:
        return jsonify({
            "error": "File too large",
            "details": f"Maximum file size is 15MB. Your file is {file_size / (1024 * 1024):.1f}MB"
        }), 413

    if not pdf_content:
        return jsonify({
            "error": "Empty file",
            "details": "The uploaded PDF file is empty"
        }), 400
    
    # Validate PDF content
    if not is_valid_pdf(pdf_content):
        return jsonify({
            "error": "Invalid PDF file",
            "details": "The uploaded file is not a valid PDF"
        }), 400

    logger.info(f"Processing PDF: {pdf_file.filename} ({file_size / (1024 * 1024):.1f}MB)")

    try:
        # Create a temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            logger.info(f"Created temp directory: {temp_dir}")
            
            # Save PDF content to a temporary file
            temp_pdf_path = os.path.join(temp_dir, "temp.pdf")
            with open(temp_pdf_path, "wb") as f:
                f.write(pdf_content)
            logger.info(f"Saved PDF to temporary file: {temp_pdf_path}")
            
            # Convert PDF to images
            images = convert_from_bytes(
                pdf_content,
                dpi=200,
                fmt="jpeg",
                thread_count=2,
                use_pdftocairo=True,
                paths_only=False,
                output_folder=temp_dir,
                output_file="page"
            )
            logger.info(f"Converted {len(images)} pages")

            if not images:
                raise Exception("No images were generated from the PDF")

            # Create ZIP file
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                for i, img in enumerate(images, 1):
                    img_buffer = io.BytesIO()
                    img.save(img_buffer, format="JPEG", quality=90, optimize=True)
                    img_buffer.seek(0)
                    img_data = img_buffer.read()
                    
                    if len(img_data) == 0:
                        raise Exception(f"Generated image for page {i} is empty")
                        
                    logger.info(f"Adding page {i} to zip (size: {len(img_data) / 1024:.1f}KB)")
                    zip_file.writestr(f"page_{i}.jpg", img_data)

            zip_buffer.seek(0)
            zip_size = len(zip_buffer.getvalue())
            logger.info(f"Created zip file (size: {zip_size / 1024:.1f}KB)")

            if zip_size == 0:
                raise Exception("Generated zip file is empty")

            return send_file(
                zip_buffer,
                as_attachment=True,
                download_name=f"{os.path.splitext(pdf_file.filename)[0]}_converted.zip",
                mimetype="application/zip"
            )

    except Exception as e:
        logger.error(f"Conversion error: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Conversion failed",
            "details": str(e)
        }), 500

@app.route("/api/jpg-to-pdf", methods=["POST"])
def convert_jpg_to_pdf():
    logger.info("Received JPG to PDF request")
    
    if 'images' not in request.files:
        return jsonify({
            "error": "No images uploaded",
            "details": "Please select at least one JPG image to convert"
        }), 400

    image_files = request.files.getlist("images")
    if not image_files:
        return jsonify({
            "error": "No images uploaded",
            "details": "Please select at least one JPG image to convert"
        }), 400

    # Validate and process images
    images = []
    total_size = 0

    try:
        for img_file in image_files:
            # Check file extension
            if not img_file.filename.lower().endswith(('.jpg', '.jpeg')):
                return jsonify({
                    "error": "Invalid file type",
                    "details": f"File '{img_file.filename}' is not a JPG image"
                }), 400

            # Read image content
            img_content = img_file.read()
            file_size = len(img_content)
            total_size += file_size

            # Check individual file size
            if file_size > MAX_PDF_SIZE:
                return jsonify({
                    "error": "File too large",
                    "details": f"Image '{img_file.filename}' exceeds 15MB limit"
                }), 413

            # Validate JPEG content
            if not is_valid_jpeg(img_content):
                return jsonify({
                    "error": "Invalid JPEG file",
                    "details": f"File '{img_file.filename}' is not a valid JPEG image"
                }), 400

            # Create PIL Image from bytes
            img_buffer = io.BytesIO(img_content)
            img = Image.open(img_buffer)
            
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            images.append(img)
            logger.info(f"Processed image: {img_file.filename} ({file_size / 1024:.1f}KB)")

        # Check total size
        if total_size > MAX_TOTAL_JPG_SIZE:
            return jsonify({
                "error": "Total size too large",
                "details": f"Combined file size exceeds 15MB limit"
            }), 413

        # Create PDF
        pdf_buffer = io.BytesIO()
        if images:
            images[0].save(
                pdf_buffer,
                format="PDF",
                save_all=True,
                append_images=images[1:],
                resolution=200.0,
                quality=90,
                optimize=True
            )
            pdf_buffer.seek(0)
            
            pdf_size = len(pdf_buffer.getvalue())
            logger.info(f"Created PDF (size: {pdf_size / 1024:.1f}KB)")

            if pdf_size == 0:
                raise Exception("Generated PDF file is empty")

            return send_file(
                pdf_buffer,
                as_attachment=True,
                download_name="converted.pdf",
                mimetype="application/pdf"
            )
        else:
            raise Exception("No valid images were processed")

    except Exception as e:
        logger.error(f"Conversion error: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Conversion failed",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)