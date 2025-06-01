from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import io
import zipfile
import os
import tempfile
import logging
import sys
import datetime
import fitz  # PyMuPDF
import shutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(process)d] [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# Constants
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15MB limit for both PDF and JPG files

def create_app():
app = Flask(__name__)
    
    # Configure CORS
    allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
    logger.info(f"Allowed origins: {allowed_origins}")
CORS(app, resources={
        r"/*": {
            "origins": allowed_origins,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

    # Configure upload size limit
    app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
    
    return app

app = create_app()

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

def create_pdf_from_images(image_paths, output_path):
    """Create PDF from multiple images with letter size pages"""
    if not image_paths:
        raise ValueError("No images provided")
    
    # Letter size in pixels at 150 DPI
    LETTER_WIDTH = int(8.5 * 150)  # 8.5 inches * 150 DPI = 1275 pixels
    LETTER_HEIGHT = int(11 * 150)  # 11 inches * 150 DPI = 1650 pixels
    
    # Create PDF with the first image
    with Image.open(image_paths[0]) as first_img:
        # Convert to RGB if needed
        if first_img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', first_img.size, (255, 255, 255))
            if first_img.mode == 'P':
                first_img = first_img.convert('RGBA')
            rgb_img.paste(first_img, mask=first_img.split()[-1] if first_img.mode in ('RGBA', 'LA') else None)
            first_img = rgb_img

        # Calculate resize dimensions while maintaining aspect ratio
        img_ratio = first_img.width / first_img.height
        letter_ratio = LETTER_WIDTH / LETTER_HEIGHT

        if img_ratio > letter_ratio:
            # Image is wider than letter size
            new_width = LETTER_WIDTH
            new_height = int(LETTER_WIDTH / img_ratio)
        else:
            # Image is taller than letter size
            new_height = LETTER_HEIGHT
            new_width = int(LETTER_HEIGHT * img_ratio)

        # Resize first image
        resized_img = first_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Create white background of letter size
        letter_page = Image.new('RGB', (LETTER_WIDTH, LETTER_HEIGHT), 'white')
        
        # Center the image on the page
        x = (LETTER_WIDTH - new_width) // 2
        y = (LETTER_HEIGHT - new_height) // 2
        letter_page.paste(resized_img, (x, y))
        
        # Save first page and prepare to append others
        letter_page.save(
            output_path,
            "PDF",
            resolution=150.0,  # Set to 150 DPI
            save_all=True,
            append_images=[
                process_image_for_pdf(img_path, LETTER_WIDTH, LETTER_HEIGHT)
                for img_path in image_paths[1:]
            ]
        )
    
    return output_path

def process_image_for_pdf(img_path, target_width, target_height):
    """Process a single image for PDF inclusion"""
    with Image.open(img_path) as img:
        # Convert to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = rgb_img

        # Calculate resize dimensions
        img_ratio = img.width / img.height
        target_ratio = target_width / target_height

        if img_ratio > target_ratio:
            # Image is wider than target
            new_width = target_width
            new_height = int(target_width / img_ratio)
        else:
            # Image is taller than target
            new_height = target_height
            new_width = int(target_height * img_ratio)

        # Resize image
        resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Create white background
        letter_page = Image.new('RGB', (target_width, target_height), 'white')
        
        # Center the image
        x = (target_width - new_width) // 2
        y = (target_height - new_height) // 2
        letter_page.paste(resized_img, (x, y))
        
        return letter_page

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
        logger.error("No file in request")
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        logger.error(f"Invalid file type: {file.filename}")
        return jsonify({"error": "Only PDF files are allowed"}), 400

    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp(prefix='pdf2jpg_')
        logger.info(f"Created temporary directory: {temp_dir}")

        # Save and process PDF
        pdf_path = os.path.join(temp_dir, 'input.pdf')
        file.save(pdf_path)
        pdf_size = os.path.getsize(pdf_path)
        logger.info(f"Saved PDF file: {pdf_path} (size: {pdf_size} bytes)")

        if pdf_size == 0:
            logger.error("Empty PDF file")
            return jsonify({"error": "Empty PDF file"}), 400

        # Convert PDF to images
        images_dir = os.path.join(temp_dir, 'images')
        os.makedirs(images_dir)
        logger.info("Starting PDF to image conversion...")
        
        try:
            image_files = convert_pdf_to_images(pdf_path, images_dir)
            logger.info(f"Successfully converted PDF to {len(image_files)} images")
        except Exception as e:
            logger.error(f"Failed to convert PDF: {str(e)}")
            return jsonify({"error": "Failed to convert PDF"}), 500

        # Create ZIP file
        zip_path = os.path.join(temp_dir, 'converted.zip')
        logger.info(f"Creating ZIP file: {zip_path}")
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for i, img_path in enumerate(image_files, 1):
                size = os.path.getsize(img_path)
                if size == 0:
                    logger.error(f"Empty image generated: page_{i}.jpg")
                    continue
                logger.info(f"Adding to ZIP: page_{i}.jpg (size: {size} bytes)")
                zipf.write(img_path, f"page_{i}.jpg")

        # Verify and send ZIP
        zip_size = os.path.getsize(zip_path)
        if zip_size == 0:
            logger.error("Generated ZIP file is empty")
            return jsonify({"error": "Failed to create ZIP file"}), 500

        logger.info(f"Sending ZIP file (size: {zip_size} bytes)")
        return send_file(
            zip_path,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f"{os.path.splitext(file.filename)[0]}_converted.zip"
        )

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

            # Save and check image
            img_path = os.path.join(temp_dir, f"image_{i}.jpg")
            img_file.save(img_path)
            file_size = os.path.getsize(img_path)
            
            if file_size == 0:
                logger.error(f"Empty image file: {img_file.filename}")
                continue

            total_size += file_size
            if total_size > MAX_FILE_SIZE:
                logger.error("Total size exceeds limit")
                return jsonify({"error": "Total file size exceeds 15MB limit"}), 413

            try:
                # Process image
                with Image.open(img_path) as img:
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

        # Create PDF
        pdf_path = os.path.join(temp_dir, "output.pdf")
        logger.info("Creating PDF...")

        try:
            create_pdf_from_images(processed_images, pdf_path)
            pdf_size = os.path.getsize(pdf_path)
            logger.info(f"Created PDF: {pdf_path} (size: {pdf_size} bytes)")

            if pdf_size == 0:
                logger.error("Generated PDF is empty")
                return jsonify({"error": "Failed to create PDF"}), 500

            # Send PDF
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