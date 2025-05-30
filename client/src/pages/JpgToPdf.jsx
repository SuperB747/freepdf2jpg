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
    const formData = new FormData();
    jpgFiles.forEach((entry) => {
      formData.append("images", entry.file);
    });

    try {
      const response = await fetch(`${API_URL}/api/jpg-to-pdf`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "combined.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error converting JPGs: " + err.message);
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

              <div className="mt-4 max-h-48 overflow-y-auto flex flex-col items-start justify-center mx-auto w-full max-w-xs">
                {jpgFiles.map((entry, index) => (
                  <Draggable key={entry.id} draggableId={entry.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-full max-w-md text-sm text-white px-3 py-2 flex items-center justify-start"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span className="truncate inline-block max-w-[180px] align-middle overflow-hidden whitespace-nowrap text-ellipsis">
                            {entry.file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-400 hover:text-red-600"
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

      <div className="flex gap-4 mt-4 justify-center">
        <button
          onClick={handleConvert}
          disabled={jpgFiles.length === 0 || isConverting}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
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
  );
}