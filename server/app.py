from flask import Flask, request, send_file
from flask_cors import CORS
from pdf2image import convert_from_bytes
from PIL import Image
import io
import zipfile
import os
import uuid

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB 제한

@app.route("/api/pdf-to-jpg", methods=["POST"])
def convert_pdf_to_jpg():
    if 'pdf' not in request.files:
        return "No PDF file uploaded", 400

    pdf_file = request.files['pdf']
    # Optional: file extension check
    if not pdf_file.filename.lower().endswith(".pdf"):
        return "Invalid file type", 400

    pdf_bytes = pdf_file.read()
    print("파일 수신 완료:", pdf_file.filename)
    print("PDF 바이트 길이:", len(pdf_bytes))

    try:
        images = convert_from_bytes(pdf_bytes, dpi=150)

        # Zip으로 묶기
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w") as zip_file:
            for i, img in enumerate(images):
                img_io = io.BytesIO()
                img.save(img_io, format="JPEG")
                img_io.seek(0)
                zip_file.writestr(f"page_{i+1}.jpg", img_io.read())

        zip_buffer.seek(0)
        return send_file(
            zip_buffer,
            as_attachment=True,
            download_name="converted_images.zip",
            mimetype="application/zip"
        )
    except Exception as e:
        return str(e), 500

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