import { useState } from "react";

export default function PdfToJpg() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setPdfFile(droppedFiles[0]);
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
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch("http://localhost:5001/api/pdf-to-jpg", {
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
      a.download = "converted.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error converting PDF: " + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white">PDF to JPG Converter</h1>
      <p className="mt-2 text-gray-300">Upload a PDF file to convert each page into high-resolution JPG images. Fast, secure, and no file storage.</p>
      <h2 className="mt-4 text-lg font-semibold text-white">How to Use</h2>
      <ul className="mt-2 text-gray-300 list-disc list-inside">
        <li>Select a PDF file using the upload box below.</li>
        <li>Each page of the PDF will be converted into a JPG image.</li>
        <li>Click <strong>Convert Now</strong> to start the conversion.</li>
        <li>The converted images will be automatically downloaded as a ZIP file.</li>
        <li>Click <strong>Reset</strong> to clear the file and start over.</li>
      </ul>

      <div className="relative mt-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="py-16 px-8 border-2 border-gray-400 border-dashed rounded text-center cursor-pointer hover:border-gray-300"
        >
          <p className="text-white">Drag & drop a PDF file here, or</p>
          <label className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            Select Files
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {pdfFile && (
          <div className="absolute bottom-4 left-0 right-0 text-white text-center">
            📄 File Selected: <span className="font-normal">{pdfFile.name}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-4 justify-center">
        <button
          onClick={handleConvert}
          disabled={!pdfFile || isConverting}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isConverting ? "Converting..." : "Convert Now"}
        </button>
        <button
          onClick={handleReset}
          disabled={!pdfFile}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}