import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://freepdf2jpg-server.onrender.com:5001";
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
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setPdfFile(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleConvert = async () => {
    if (!pdfFile) return;
    setIsConverting(true);
    setIsUploaded(false);
    setUploadProgress(0);
    setShowSuccess(false);
    setConversionMessage("Uploading PDF file...");
    
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
            if (percentComplete === 100) {
              setIsUploaded(true);
              setConversionMessage("Converting PDF to images...");
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.response.type === 'application/json') {
              // If the response is JSON, it's probably an error
              const reader = new FileReader();
              reader.onload = () => {
                const error = JSON.parse(reader.result);
                reject(new Error(error.details || error.error || 'Conversion failed'));
              };
              reader.onerror = () => reject(new Error('Failed to read error response'));
              reader.readAsText(xhr.response);
            } else {
              resolve(xhr.response);
            }
          } else {
            if (xhr.responseType === 'blob') {
              // Try to read error message from blob
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const error = JSON.parse(reader.result);
                  reject(new Error(error.details || error.error || 'Upload failed'));
                } catch {
                  reject(new Error('Upload failed'));
                }
              };
              reader.onerror = () => reject(new Error('Upload failed'));
              reader.readAsText(xhr.response);
            } else {
              reject(new Error(xhr.responseText || 'Upload failed'));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };

        xhr.open('POST', `${API_URL}/api/pdf-to-jpg`);
        xhr.responseType = 'blob';
        xhr.send(formData);
      });

      const blob = response;
      console.log("Received blob:", blob.type, blob.size);
      
      setConversionMessage("Conversion complete! Starting download...");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.zip";
      a.click();
      window.URL.revokeObjectURL(url);

      // Show success message
      setIsConverting(false);
      setShowSuccess(true);
      setConversionMessage("Conversion completed successfully! Your download should begin automatically.");
      
      // Clear success state after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setConversionMessage("");
        setUploadProgress(0);
        setIsUploaded(false);
      }, 3000);
    } catch (err) {
      console.error("Conversion error:", err);
      setConversionMessage("Error during conversion: " + err.message);
      setUploadProgress(0);
      setIsUploaded(false);
      setShowSuccess(false);
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">PDF to JPG Converter</h2>
        <p className="text-gray-300 mb-6">
          Convert your PDF files to high-quality JPG images. Maximum file size: 15MB.
        </p>

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6">
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
                onClick={() => setPdfFile(null)}
                className="text-red-400 hover:text-red-300 mt-2"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {(isConverting || showSuccess) && (
          <div className="mb-6">
            <div className={`text-center text-sm mb-2 ${
              showSuccess ? 'text-green-400' : 'text-gray-300'
            }`}>
              {conversionMessage}
            </div>
            {isConverting && (
              <>
                <div className="h-2 bg-gray-700 rounded overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ease-in-out bg-blue-500 ${
                      isUploaded ? 'animate-pulse w-full' : ''
                    }`}
                    style={!isUploaded ? { width: `${uploadProgress}%` } : undefined}
                  ></div>
                </div>
                {!isUploaded && (
                  <div className="text-center text-sm text-gray-400 mt-1">
                    {uploadProgress}%
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleConvert}
            disabled={!pdfFile || isConverting}
            className="px-6 py-2 bg-green-500 text-white rounded disabled:opacity-50 hover:bg-green-600 transition-colors"
          >
            {isConverting ? "Converting..." : "Convert to JPG"}
          </button>
          {pdfFile && (
            <button
              onClick={() => setPdfFile(null)}
              disabled={isConverting}
              className="px-6 py-2 bg-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">How to Use PDF to JPG Converter</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Step-by-Step Guide</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Click the "Select PDF File" button or drag and drop your PDF file (max 15MB)</li>
              <li>Your PDF file will appear in the upload area once selected</li>
              <li>Click the "Convert to JPG" button to start the conversion</li>
              <li>Wait for the conversion process to complete</li>
              <li>Your converted images will be downloaded automatically as a ZIP file</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">Features</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Convert PDF documents to high-quality JPG images</li>
              <li>Maintain original image quality and resolution</li>
              <li>Process multiple pages at once</li>
              <li>Secure and private conversion</li>
              <li>Download all images in a convenient ZIP format</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">Tips</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>For best results, ensure your PDF file is less than 50MB</li>
              <li>Each page of your PDF will be converted to a separate JPG image</li>
              <li>The conversion process time depends on the file size and number of pages</li>
              <li>You can convert a new PDF file after the current conversion is complete</li>
              <li>Use the Reset button to clear the current file and start over</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}