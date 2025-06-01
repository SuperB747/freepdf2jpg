import { useState } from "react";
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';

const API_URL = "https://freepdf2jpg-server.onrender.com/api";
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes

export default function PdfToJpg() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 15MB limit. Please choose a smaller file.");
      return;
    }
    setPdfFile(file);
    setIsUploaded(false); 
    setShowSuccess(false);
    setConversionMessage("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds 15MB limit. Please choose a smaller file.");
        return;
      }
      setPdfFile(file);
      setIsUploaded(false);
      setShowSuccess(false);
      setConversionMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setPdfFile(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    setIsUploaded(false);
    setShowSuccess(false);
    setConversionMessage("");
    setUploadProgress(0);
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file first.");
      return;
    }

    setIsConverting(true);
    setConversionMessage("Starting conversion...");
    setUploadProgress(0);
    setIsUploaded(false);
    setShowSuccess(false);

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch(`${API_URL}/pdf-to-jpg`, {
        method: "POST",
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          setConversionMessage(`Uploading: ${percentCompleted}%`);
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "An unexpected error occurred during conversion." }));
        let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
        throw new Error(errorMessage);
      }
      
      setIsUploaded(true);
      setConversionMessage("Processing... Please wait.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted_images.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setConversionMessage("Conversion successful! Your download has started.");
      setShowSuccess(true);

    } catch (error) {
      console.error("Conversion error:", error);
      setConversionMessage(`Conversion failed: ${error.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Convert PDF to JPG | FreePDF2JPG</title>
        <meta name="description" content="Convert your PDF files to high-quality JPG images for free. Fast and easy PDF to JPG conversion." />
        <link rel="canonical" href="https://freepdf2jpg.ca/pdf-to-jpg" />
      </Helmet>
      <SEO 
        title="Convert PDF to JPG Online - Free PDF to Image Converter | FreePDF2JPG"
        description="Convert PDF files to high-quality JPG images online for free. Easy to use, no registration required. Maintain original quality with our PDF to JPG converter."
        keywords="pdf to jpg, convert pdf to jpg, pdf to image converter, free pdf converter, online pdf to jpg, pdf to jpeg"
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">PDF to JPG Converter</h2>
          <p className="text-gray-300 mb-6">
            Convert your PDF files to high-quality JPG images. Each page of your PDF will be converted to a separate JPG image.
            Maximum file size: 15MB.
          </p>

          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdfInput"
            />
            <label
              htmlFor="pdfInput"
              className="block cursor-pointer"
            >
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-300 mb-2">Drag & drop your PDF here, or</p>
              <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block">
                Select PDF File
              </span>
            </label>
            {pdfFile && (
              <div className="mt-4">
                <p className="text-gray-300">Selected file: {pdfFile.name}</p>
                <button
                  onClick={handleReset}
                  className="text-red-400 hover:text-red-300 mt-2"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {uploadProgress > 0 && !isUploaded && (
            <div className="mb-4">
              <div className="h-2 bg-gray-700 rounded">
                <div
                  className="h-full bg-blue-500 rounded transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-300 text-sm mt-1 text-center">{conversionMessage}</p>
            </div>
          )}

          {isUploaded && !showSuccess && (
            <p className="text-center text-gray-300 mb-4">{conversionMessage}</p>
          )}

          {showSuccess && (
            <div className="text-center mb-4 p-3 bg-green-600 text-white rounded">
              {conversionMessage}
            </div>
          )}

          {!showSuccess && !isUploaded && conversionMessage && !isConverting && pdfFile && (
            <div className="text-center mb-4 p-3 bg-red-600 text-white rounded">
              {conversionMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleConvert}
              disabled={isConverting || !pdfFile}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConverting ? "Converting..." : "Convert to JPG"}
            </button>
            <button
              onClick={handleReset}
              disabled={isConverting}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">How to Use PDF to JPG Converter</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Step-by-Step Guide</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Click "Select PDF File" or drag and drop your PDF into the upload area</li>
                <li>Your selected PDF will appear below the upload area</li>
                <li>Click the "Convert to JPG" button to start the conversion</li>
                <li>Your converted images will download as a ZIP file when ready</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Features</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Convert each PDF page to a high-quality JPG image</li>
                <li>Maintain original document quality</li>
                <li>Download all images in a convenient ZIP file</li>
                <li>Secure and private conversion</li>
                <li>Support for multi-page PDF documents</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Tips</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>For best results, use a high-quality PDF file</li>
                <li>Each page will be converted to a separate JPG image</li>
                <li>The conversion time depends on the number of pages in your PDF</li>
                <li>Images will be named according to their page numbers</li>
                <li>Use the Reset button to remove the selected file and start over</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}