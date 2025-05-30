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
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB 제한

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "running",
        "endpoints": {
            "pdf_to_jpg": "/api/pdf-to-jpg",
            "jpg_to_pdf": "/api/jpg-to-pdf"
        }
    })

@app.route("/api/pdf-to-jpg", methods=["POST"])
def convert_pdf_to_jpg():
    print("Received PDF to JPG request")
    print("Files in request:", list(request.files.keys()))
    
    if 'file' not in request.files:
        print("No file found in request.files")
        print("Request form data:", request.form)
        print("Request headers:", dict(request.headers))
        return "No PDF file uploaded", 400

    pdf_file = request.files['file']
    print("File received:", pdf_file.filename)
    
    # Optional: file extension check
    if not pdf_file.filename.lower().endswith(".pdf"):
        print("Invalid file type:", pdf_file.filename)
        return "Invalid file type", 400

    pdf_bytes = pdf_file.read()
    if not pdf_bytes:
        print("Empty PDF file received")
        return "PDF file is empty", 400
    
    print("파일 수신 완료:", pdf_file.filename)
    print("PDF 바이트 길이:", len(pdf_bytes))

    try:
        print("Starting PDF conversion...")
        images = convert_from_bytes(pdf_bytes, dpi=150)
        print(f"Converted {len(images)} pages")

        # Zip으로 묶기
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w") as zip_file:
            for i, img in enumerate(images):
                img_io = io.BytesIO()
                img.save(img_io, format="JPEG")
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
        print("PDF 변환 오류:", str(e))
        print("Error details:", type(e).__name__)
        return f"Error converting PDF: {str(e)}", 500

@app.route("/api/jpg-to-pdf", methods=["POST"])
def convert_jpg_to_pdf():
    image_files = request.files.getlist("images")
    if not image_files:
        return "No images uploaded", 400

    print("Number of uploaded images:", len(image_files))
    for f in image_files:
        print("File name:", f.filename)

    images = []
    try:
        for file in image_files:
            img = Image.open(file.stream).convert("RGB")
            img = img.resize((612, 792), Image.Resampling.LANCZOS)
            images.append(img)

        pdf_bytes_io = io.BytesIO()
        images[0].save(pdf_bytes_io, format="PDF", save_all=True, append_images=images[1:])
        pdf_bytes_io.seek(0)

        return send_file(
            pdf_bytes_io,
            as_attachment=True,
            download_name="converted.pdf",
            mimetype="application/pdf"
        )
    except Exception as e:
        return str(e), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)