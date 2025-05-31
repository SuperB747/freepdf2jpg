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
    logger.info("=== Starting JPG to PDF conversion ===")
    
    if 'images' not in request.files:
        logger.error("No images uploaded")
        return jsonify({"error": "No images uploaded"}), 400

    image_files = request.files.getlist("images")
    if not image_files:
        logger.error("No images in request")
        return jsonify({"error": "No images uploaded"}), 400

    logger.info(f"Received {len(image_files)} images")

    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp(prefix='jpg2pdf_')
        logger.info(f"Created temporary directory: {temp_dir}")

        # Save and process images
        processed_images = []
        total_size = 0

        for i, img_file in enumerate(image_files, 1):
            if not img_file.filename.lower().endswith(('.jpg', '.jpeg')):
                logger.error(f"Invalid file type: {img_file.filename}")
                continue

            # Save image to temp directory
            img_path = os.path.join(temp_dir, f"image_{i}.jpg")
            img_file.save(img_path)
            file_size = os.path.getsize(img_path)
            logger.info(f"Saved image {i}: {img_path} (size: {file_size} bytes)")

            if file_size == 0:
                logger.error(f"Empty image file: {img_file.filename}")
                continue

            total_size += file_size
            if total_size > MAX_TOTAL_JPG_SIZE:
                logger.error("Total size exceeds limit")
                return jsonify({"error": "Total file size exceeds 15MB limit"}), 413

            try:
                # Open and verify image
                with Image.open(img_path) as img:
                    # Convert to RGB if necessary
                    if img.mode in ('RGBA', 'LA', 'P'):
                        rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                        if img.mode == 'P':
                            img = img.convert('RGBA')
                        rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                        rgb_img.save(img_path, 'JPEG', quality=95)
                        logger.info(f"Converted image {i} to RGB")
                    processed_images.append(img_path)
            except Exception as e:
                logger.error(f"Failed to process image {img_file.filename}: {str(e)}")
                continue

        if not processed_images:
            logger.error("No valid images to process")
            return jsonify({"error": "No valid images were uploaded"}), 400

        logger.info(f"Successfully processed {len(processed_images)} images")

        # Create PDF
        pdf_path = os.path.join(temp_dir, "output.pdf")
        logger.info("Creating PDF...")

        try:
            # Use first image to get target size
            with Image.open(processed_images[0]) as first_img:
                pdf_size = first_img.size

            # Create PDF with consistent page sizes
            with Image.open(processed_images[0]) as first_img:
                first_img.save(
                    pdf_path,
                    "PDF",
                    resolution=300.0,
                    save_all=True,
                    append_images=[Image.open(img_path).resize(pdf_size) for img_path in processed_images[1:]]
                )

            pdf_size = os.path.getsize(pdf_path)
            logger.info(f"Created PDF: {pdf_path} (size: {pdf_size} bytes)")

            if pdf_size == 0:
                logger.error("Generated PDF is empty")
                return jsonify({"error": "Failed to create PDF"}), 500

            # Send the PDF file
            logger.info("Sending PDF response...")
            return send_file(
                pdf_path,
                mimetype='application/pdf',
                as_attachment=True,
                download_name='combined.pdf'
            )

        except Exception as e:
            logger.error(f"Failed to create PDF: {str(e)}")
            return jsonify({"error": f"Failed to create PDF: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Conversion failed: {str(e)}")
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up
        try:
            if 'temp_dir' in locals():
                shutil.rmtree(temp_dir)
                logger.info("Cleaned up temporary directory")
        except Exception as e:
            logger.error(f"Failed to clean up: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get('PORT', '10000'))
    logger.info(f"Starting server on port {port}")
    app.run(host="0.0.0.0", port=port)