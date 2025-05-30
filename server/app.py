from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2image import convert_from_bytes
from PIL import Image
import io
import zipfile
import os
import uuid

app = Flask(__name__)
CORS(app, resources={
    r"/*": {  # Allow CORS for all routes
        "origins": [
            "http://localhost:5173",  # Local development
            "https://freepdf2jpg-client.onrender.com",  # Production
            "https://freepdf2jpg.onrender.com"  # Alternative production URL
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# File size limits
MAX_PDF_SIZE = 15 * 1024 * 1024  # 15MB for PDF files
MAX_TOTAL_JPG_SIZE = 15 * 1024 * 1024  # 15MB for combined JPG files
app.config['MAX_CONTENT_LENGTH'] = MAX_TOTAL_JPG_SIZE  # Maximum total request size

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
    print("Received PDF to JPG request")
    
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

    # Check file size
    pdf_file.seek(0, os.SEEK_END)
    file_size = pdf_file.tell()
    pdf_file.seek(0)
    
    if file_size > MAX_PDF_SIZE:
        return jsonify({
            "error": "File too large",
            "details": f"Maximum file size is 15MB. Your file is {file_size / (1024 * 1024):.1f}MB"
        }), 413

    pdf_bytes = pdf_file.read()
    if not pdf_bytes:
        return jsonify({
            "error": "Empty file",
            "details": "The uploaded PDF file is empty"
        }), 400
    
    print(f"Processing PDF: {pdf_file.filename} ({file_size / (1024 * 1024):.1f}MB)")

    try:
        print("Starting PDF conversion...")
        images = convert_from_bytes(pdf_bytes, dpi=150)
        print(f"Converted {len(images)} pages")

        # Create ZIP file
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w") as zip_file:
            for i, img in enumerate(images):
                img_io = io.BytesIO()
                img.save(img_io, format="JPEG", quality=85)  # Slightly reduced quality for better file size
                img_io.seek(0)
                zip_file.writestr(f"page_{i+1}.jpg", img_io.read())
                print(f"Added page {i+1} to zip")

        zip_buffer.seek(0)
        print("Sending zip file response...")
        return send_file(
            zip_buffer,
            as_attachment=True,
            download_name="converted_images.zip",
            mimetype="application/zip"
        )
    except Exception as e:
        print("Conversion error:", str(e))
        return jsonify({
            "error": "Conversion failed",
            "details": str(e)
        }), 500

@app.route("/api/jpg-to-pdf", methods=["POST"])
def convert_jpg_to_pdf():
    image_files = request.files.getlist("images")
    if not image_files:
        return jsonify({
            "error": "No images uploaded",
            "details": "Please select at least one JPG image to convert"
        }), 400

    # Calculate total size
    total_size = 0
    for file in image_files:
        file.seek(0, os.SEEK_END)
        total_size += file.tell()
        file.seek(0)
    
    if total_size > MAX_TOTAL_JPG_SIZE:
        return jsonify({
            "error": "Combined file size too large",
            "details": f"Maximum combined size is 15MB. Your files total {total_size / (1024 * 1024):.1f}MB"
        }), 413

    print(f"Processing {len(image_files)} images, total size: {total_size / (1024 * 1024):.1f}MB")

    try:
        images = []
        for file in image_files:
            if not file.filename.lower().endswith(('.jpg', '.jpeg')):
                return jsonify({
                    "error": "Invalid file type",
                    "details": f"File '{file.filename}' is not a JPG image"
                }), 400
            
            img = Image.open(file.stream).convert("RGB")
            img = img.resize((612, 792), Image.Resampling.LANCZOS)
            images.append(img)

        pdf_bytes_io = io.BytesIO()
        images[0].save(
            pdf_bytes_io,
            format="PDF",
            save_all=True,
            append_images=images[1:],
            optimize=True
        )
        pdf_bytes_io.seek(0)

        return send_file(
            pdf_bytes_io,
            as_attachment=True,
            download_name="converted.pdf",
            mimetype="application/pdf"
        )
    except Exception as e:
        return jsonify({
            "error": "Conversion failed",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)