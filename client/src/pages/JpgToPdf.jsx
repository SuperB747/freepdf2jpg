import { useState, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const API_URL = "https://freepdf2jpg-server.onrender.com/api";
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15MB total limit

export default function JpgToPdf() {
  const [jpgFiles, setJpgFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [uniqueId, setUniqueId] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");

  const fileInputRef = useRef(null);

  const getTotalSize = (files) => {
    return files.reduce((total, entry) => total + entry.file.size, 0);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check individual file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the 15MB limit:\n${oversizedFiles.map(f => f.name).join('\n')}`);
      return;
    }

    // Check total size including existing files
    const newFiles = selectedFiles.map((file, i) => ({
      id: `file-${uniqueId + i}`,
      file,
    }));
    const totalSize = getTotalSize([...jpgFiles, ...newFiles]);
    
    if (totalSize > MAX_TOTAL_SIZE) {
      alert("Total file size exceeds 15MB limit. Please remove some files first.");
      return;
    }

    setUniqueId((prev) => prev + newFiles.length);
    setJpgFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Check individual file sizes
    const oversizedFiles = droppedFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the 15MB limit:\n${oversizedFiles.map(f => f.name).join('\n')}`);
      return;
    }

    // Check total size including existing files
    const newFiles = droppedFiles.map((file, i) => ({
      id: `file-${uniqueId + i}`,
      file,
    }));
    const totalSize = getTotalSize([...jpgFiles, ...newFiles]);
    
    if (totalSize > MAX_TOTAL_SIZE) {
      alert("Total file size exceeds 15MB limit. Please remove some files first.");
      return;
    }

    if (droppedFiles.length > 0) {
      setUniqueId((prev) => prev + newFiles.length);
      setJpgFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setJpgFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setJpgFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploaded(false);
    setShowSuccess(false);
    setConversionMessage("");
    setUploadProgress(0);
  };

  const handleConvert = async () => {
    if (jpgFiles.length === 0) return;

    setIsConverting(true);
    setIsUploaded(false);
    setUploadProgress(0);
    setShowSuccess(false);
    setConversionMessage("Uploading images...");

    const formData = new FormData();
    jpgFiles.forEach((entry) => {
      formData.append("images", entry.file);
    });

    try {
      const response = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
            if (percentComplete === 100) {
              setIsUploaded(true);
              setConversionMessage("Converting images to PDF...");
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

        xhr.open('POST', `${API_URL}/jpg-to-pdf`);
        xhr.responseType = 'blob';
        xhr.send(formData);
      });

      const blob = response;
      console.log("Received blob:", blob.type, blob.size);
      
      setConversionMessage("Conversion complete! Starting download...");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "combined.pdf";
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(jpgFiles);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setJpgFiles(reordered);
  };

  return (
    <>
      <Helmet>
        <title>Convert JPG to PDF | FreePDF2JPG</title>
        <meta name="description" content="Combine multiple JPG images into a single PDF document for free. Easy to use JPG to PDF converter." />
        <link rel="canonical" href="https://freepdf2jpg.ca/jpg-to-pdf" />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">JPG to PDF Converter</h2>
          <p className="text-gray-300 mb-6">
            Combine multiple JPG images into a single PDF document. Maximum total size: 15MB.
            Drag and drop to reorder images.
          </p>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="jpgList">
              {(provided) => (
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <input
                    type="file"
                    accept="image/jpeg"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="jpgInput"
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="jpgInput"
                    className="block cursor-pointer"
                  >
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-300 mb-2">Drag & drop JPG files here, or</p>
                    <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block">
                      Select JPG Files
                    </span>
                  </label>

                  <div className="mt-6 max-h-48 overflow-y-auto">
                    {jpgFiles.map((entry, index) => (
                      <Draggable key={entry.id} draggableId={entry.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-between p-2 mb-2 rounded ${
                              snapshot.isDragging ? 'bg-gray-700' : 'bg-gray-900'
                            }`}
                          >
                            <span className="flex items-center text-gray-300 flex-grow min-w-0 mr-2">
                              <span className="mr-2 text-sm text-gray-500 flex-shrink-0">{index + 1}.</span>
                              <span className="truncate">{entry.file.name}</span>
                            </span>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-400 hover:text-red-300 flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>

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
              disabled={jpgFiles.length === 0 || isConverting}
              className="px-6 py-2 bg-green-500 text-white rounded disabled:opacity-50 hover:bg-green-600 transition-colors"
            >
              {isConverting ? "Converting..." : "Convert to PDF"}
            </button>
            {jpgFiles.length > 0 && (
              <button
                onClick={handleReset}
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
          <h2 className="text-xl font-semibold text-white mb-4">How to Use JPG to PDF Converter</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Step-by-Step Guide</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Click "Select JPG Files" or drag and drop multiple JPG images into the upload area</li>
                <li>Your selected images will appear in a list below the upload area</li>
                <li>Drag and drop the images in the list to reorder them as needed</li>
                <li>Click the "Convert to PDF" button to combine the images</li>
                <li>Your combined PDF will download automatically when ready</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Features</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Combine multiple JPG images into a single PDF</li>
                <li>Drag-and-drop interface for easy file ordering</li>
                <li>Maintain original image quality</li>
                <li>Secure and private conversion</li>
                <li>No file limit - convert as many images as you need</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Tips</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Images will appear in the PDF in the same order as shown in the list</li>
                <li>You can remove individual images by clicking the "✕" button</li>
                <li>Use the Reset button to clear all selected images at once</li>
                <li>For best results, use high-quality JPG images</li>
                <li>The conversion time depends on the number and size of your images</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}