from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2image import convert_from_bytes
from PIL import Image
import io
import zipfile
import os
import tempfile
import magic
import logging.handlers
import sys

# Configure logging
log_format = '[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s'
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for more detailed logs
    format=log_format,
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.handlers.RotatingFileHandler(
            'app.log',
            maxBytes=10000000,  # 10MB
            backupCount=3
        )
    ]
)

# Set third-party loggers to INFO to reduce noise
logging.getLogger('PIL').setLevel(logging.INFO)
logging.getLogger('pdf2image').setLevel(logging.INFO)

logger = logging.getLogger(__name__)

app = Flask(__name__)

# Get allowed origins from environment variable with default
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
logger.info(f"Allowed origins: {allowed_origins}")

CORS(app, resources={
    r"/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# File size limits
MAX_PDF_SIZE = 15 * 1024 * 1024  # 15MB for PDF files
MAX_TOTAL_JPG_SIZE = 15 * 1024 * 1024  # 15MB for combined JPG files
app.config['MAX_CONTENT_LENGTH'] = MAX_TOTAL_JPG_SIZE

# Configure Flask app
app.config['UPLOAD_FOLDER'] = '/tmp'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Error handlers
@app.errorhandler(413)
def request_entity_too_large(error):
    logger.error("File too large error")
    return jsonify({
        "error": "File too large",
        "details": "The file exceeds the maximum allowed size of 15MB"
    }), 413

@app.errorhandler(500)
def internal_server_error(error):
    logger.error(f"Internal server error: {str(error)}", exc_info=True)
    return jsonify({
        "error": "Internal server error",
        "details": "An unexpected error occurred. Please try again later."
    }), 500

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
        logger.error("No file in request")
        return jsonify({
            "error": "No PDF file uploaded",
            "details": "Please select a PDF file to convert"
        }), 400

    pdf_file = request.files['file']
    logger.info(f"Received file: {pdf_file.filename}")
    
    if not pdf_file.filename.lower().endswith(".pdf"):
        logger.error(f"Invalid file extension: {pdf_file.filename}")
        return jsonify({
            "error": "Invalid file type",
            "details": "Only PDF files are accepted"
        }), 400

    try:
        # Create a temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            logger.info(f"Created temp directory: {temp_dir}")
            
            # Save uploaded PDF to temporary file
            temp_pdf_path = os.path.join(temp_dir, "input.pdf")
            pdf_file.save(temp_pdf_path)
            
            file_size = os.path.getsize(temp_pdf_path)
            logger.info(f"Saved PDF to temporary file: {temp_pdf_path} (size: {file_size / 1024:.1f}KB)")
            
            if file_size > MAX_PDF_SIZE:
                logger.error(f"File too large: {file_size / (1024 * 1024):.1f}MB")
                return jsonify({
                    "error": "File too large",
                    "details": f"Maximum file size is 15MB. Your file is {file_size / (1024 * 1024):.1f}MB"
                }), 413

            if file_size == 0:
                logger.error("Empty file")
                return jsonify({
                    "error": "Empty file",
                    "details": "The uploaded PDF file is empty"
                }), 400

            # Validate PDF content
            with open(temp_pdf_path, 'rb') as f:
                if not is_valid_pdf(f.read()):
                    logger.error("Invalid PDF content")
                    return jsonify({
                        "error": "Invalid PDF file",
                        "details": "The uploaded file is not a valid PDF"
                    }), 400

            # Create output directory for images
            images_dir = os.path.join(temp_dir, "images")
            os.makedirs(images_dir, exist_ok=True)
            
            # Convert PDF to images
            logger.info("Starting PDF conversion...")
            try:
                images = convert_from_bytes(
                    open(temp_pdf_path, 'rb').read(),
                    dpi=200,
                    fmt="jpeg",
                    thread_count=1,
                    use_pdftocairo=True,
                    output_folder=images_dir,
                    output_file="page"
                )
                logger.info(f"Successfully converted {len(images)} pages")
            except Exception as e:
                logger.error(f"PDF conversion failed: {str(e)}", exc_info=True)
                raise Exception(f"PDF conversion failed: {str(e)}")

            if not images:
                logger.error("No images were generated from the PDF")
                raise Exception("No images were generated from the PDF")

            # Create ZIP file path
            zip_path = os.path.join(temp_dir, "converted.zip")
            
            # Create ZIP file from the images directory
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for i, img_path in enumerate(sorted(os.listdir(images_dir)), 1):
                    if img_path.endswith('.jpg'):
                        full_path = os.path.join(images_dir, img_path)
                        file_size = os.path.getsize(full_path)
                        
                        if file_size == 0:
                            logger.error(f"Generated image {img_path} is empty")
                            continue
                            
                        logger.info(f"Adding {img_path} to zip (size: {file_size / 1024:.1f}KB)")
                        zip_file.write(full_path, f"page_{i}.jpg")

            # Check if ZIP file was created successfully
            if not os.path.exists(zip_path):
                logger.error("ZIP file was not created")
                raise Exception("Failed to create ZIP file")

            zip_size = os.path.getsize(zip_path)
            logger.info(f"Created zip file (size: {zip_size / 1024:.1f}KB)")

            if zip_size == 0:
                logger.error("Generated ZIP file is empty")
                raise Exception("Generated ZIP file is empty")

            logger.info("Sending response...")
            return send_file(
                zip_path,
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
    # Get port from environment variable with default
    port = int(os.environ.get('PORT', 5001))
    
    # Log startup information
    logger.info(f"Starting server on port {port}")
    logger.info(f"Debug mode: {app.debug}")
    logger.info(f"Environment: {os.environ.get('FLASK_ENV', 'development')}")
    
    app.run(host="0.0.0.0", port=port, debug=True)