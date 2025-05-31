from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import io
import zipfile
import os
import tempfile
import magic
import logging
import sys
import datetime
from PyPDF2 import PdfReader
import fitz  # PyMuPDF

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(process)d] [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

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

def convert_pdf_to_images(pdf_path, output_dir):
    """Convert PDF to images using PyMuPDF (fitz)"""
    pdf_document = fitz.open(pdf_path)
    images = []
    
    for page_number in range(pdf_document.page_count):
        page = pdf_document[page_number]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better quality
        image_path = os.path.join(output_dir, f'page_{page_number + 1}.jpg')
        pix.save(image_path)
        images.append(image_path)
        logger.info(f"Converted page {page_number + 1} to image")
    
    pdf_document.close()
    return images

@app.route("/health", methods=["GET", "HEAD"])
def health_check():
    logger.info("Health check request received")
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat()
    })

@app.route("/", methods=["GET", "HEAD"])
def index():
    logger.info("Index request received")
    return jsonify({
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "pdf_to_jpg": "/api/pdf-to-jpg",
            "jpg_to_pdf": "/api/jpg-to-pdf"
        }
    })

@app.route("/api/pdf-to-jpg", methods=["POST"])
def convert_pdf_to_jpg():
    logger.info("=== Starting PDF to JPG conversion ===")
    
    if 'file' not in request.files:
        logger.error("No file part in the request")
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        logger.error(f"Invalid file type: {file.filename}")
        return jsonify({"error": "Only PDF files are allowed"}), 400

    try:
        # Create a unique temporary directory
        temp_dir = tempfile.mkdtemp(prefix='pdf2jpg_')
        logger.info(f"Created temporary directory: {temp_dir}")

        # Save the uploaded PDF
        pdf_path = os.path.join(temp_dir, 'input.pdf')
        file.save(pdf_path)
        pdf_size = os.path.getsize(pdf_path)
        logger.info(f"Saved PDF file: {pdf_path} (size: {pdf_size} bytes)")

        if pdf_size == 0:
            logger.error("Uploaded PDF is empty")
            return jsonify({"error": "Empty PDF file"}), 400

        # Create output directory for images
        images_dir = os.path.join(temp_dir, 'images')
        os.makedirs(images_dir)
        logger.info(f"Created images directory: {images_dir}")

        # Convert PDF to images
        logger.info("Starting PDF to image conversion...")
        try:
            image_files = convert_pdf_to_images(pdf_path, images_dir)
            logger.info(f"Successfully converted PDF to {len(image_files)} images")
        except Exception as e:
            logger.error(f"Failed to convert PDF: {str(e)}")
            return jsonify({"error": "Failed to convert PDF"}), 500

        # Verify images were created
        if not image_files:
            logger.error("No images were generated")
            return jsonify({"error": "No images were generated from PDF"}), 500

        # Log image files and their sizes
        for img_path in image_files:
            size = os.path.getsize(img_path)
            logger.info(f"Generated image: {img_path} (size: {size} bytes)")
            if size == 0:
                logger.error(f"Generated empty image: {img_path}")
                return jsonify({"error": "Generated empty image file"}), 500

        # Create ZIP file
        zip_path = os.path.join(temp_dir, 'converted.zip')
        logger.info(f"Creating ZIP file: {zip_path}")
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for i, img_path in enumerate(image_files, 1):
                arcname = f'page_{i}.jpg'
                logger.info(f"Adding to ZIP: {img_path} as {arcname}")
                zipf.write(img_path, arcname)
                
        # Verify ZIP file
        zip_size = os.path.getsize(zip_path)
        logger.info(f"Created ZIP file: {zip_path} (size: {zip_size} bytes)")
        
        if zip_size == 0:
            logger.error("Created ZIP file is empty")
            return jsonify({"error": "Failed to create ZIP file"}), 500

        # Read ZIP file into memory
        with open(zip_path, 'rb') as f:
            zip_data = f.read()
            
        # Clean up
        import shutil
        shutil.rmtree(temp_dir)
        logger.info("Cleaned up temporary directory")

        # Send response
        logger.info(f"Sending ZIP file (size: {len(zip_data)} bytes)")
        return send_file(
            io.BytesIO(zip_data),
            mimetype='application/zip',
            as_attachment=True,
            download_name=f"{os.path.splitext(file.filename)[0]}_converted.zip"
        )

    except Exception as e:
        logger.error(f"Conversion failed: {str(e)}", exc_info=True)
        # Clean up on error
        if 'temp_dir' in locals():
            shutil.rmtree(temp_dir)
            logger.info("Cleaned up temporary directory after error")
        return jsonify({"error": str(e)}), 500

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