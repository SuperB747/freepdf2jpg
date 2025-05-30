import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const API_URL = import.meta.env.VITE_API_URL || "https://freepdf2jpg-server.onrender.com";

export default function JpgToPdf() {
  const [jpgFiles, setJpgFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [uniqueId, setUniqueId] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file, i) => ({
      id: `file-${uniqueId + i}`,
      file,
    }));
    setUniqueId((prev) => prev + newFiles.length);
    setJpgFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setJpgFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setJpgFiles([]);
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
            resolve(xhr.response);
          } else {
            reject(new Error(xhr.responseText || 'Upload failed'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };

        xhr.open('POST', `${API_URL}/api/jpg-to-pdf`);
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
    } finally {
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
    <div className="p-4 bg-[#1f1f1f] min-h-screen">
      <h1 className="text-2xl font-bold text-white">JPG to PDF Converter</h1>
      <p className="mt-2 text-gray-300">
        Combine multiple JPG images into a single PDF document. Secure, fast, and easy.
      </p>

      <h2 className="mt-6 text-lg font-semibold text-white">How to Use</h2>
      <ul className="list-disc list-inside text-gray-300 mt-2">
        <li>Select JPG files using the area below</li>
        <li>Drag and drop multiple JPG files to upload</li>
        <li>Reorder images using drag and drop</li>
        <li>Click "Convert Now" to merge into a single PDF</li>
        <li>The result will be downloaded automatically</li>
      </ul>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="jpgList">
          {(provided) => (
            <div
              className="mt-6 border-2 border-dashed border-gray-400 rounded-lg p-6 text-center text-gray-300"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <p className="mb-2">Drag & drop JPG files here, or</p>
              <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                Select Files
                <input
                  type="file"
                  accept="image/jpeg"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="mt-2 max-h-48 overflow-y-auto flex flex-col items-start justify-center mx-auto w-full max-w-xs">
                {jpgFiles.map((entry, index) => (
                  <Draggable key={entry.id} draggableId={entry.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-full max-w-md text-sm text-white py-1 flex items-center justify-start"
                        style={{
                          backgroundColor: snapshot.isDragging ? "rgba(59, 130, 246, 0.1)" : "transparent",
                          border: "none",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <span className="flex items-center gap-1 w-full">
                          <span className="text-gray-400 text-xs mr-1">{index + 1}.</span>
                          <span className="truncate inline-block max-w-[180px] align-middle overflow-hidden whitespace-nowrap text-ellipsis">
                            {entry.file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-400 hover:text-red-600 ml-auto"
                            aria-label="Remove"
                          >
                            🗑️
                          </button>
                        </span>
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

      <div className="mt-4 flex flex-col items-center gap-4">
        {(isConverting || showSuccess) && (
          <div className="w-full max-w-md">
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

        <div className="flex gap-4">
          <button
            onClick={handleConvert}
            disabled={jpgFiles.length === 0 || isConverting}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 min-w-[120px]"
          >
            {isConverting ? "Converting..." : "Convert Now"}
          </button>
          <button
            onClick={handleReset}
            disabled={jpgFiles.length === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}