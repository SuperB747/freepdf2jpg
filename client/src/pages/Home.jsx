export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-2">
      <section className="mb-4">
        <h2 className="text-2xl font-semibold text-white mb-2">Convert Your Files for Free</h2>
        <p className="text-gray-300 mb-3">
          Welcome to FreePDF2JPG, your go-to solution for quick and easy file conversions. Our tool helps you convert PDF files to high-quality JPG images and combine multiple JPG images into a single PDF document.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">PDF to JPG</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Convert PDF pages to high-quality JPG images</li>
              <li>Maintain original quality and resolution</li>
              <li>Download all images in a convenient ZIP file</li>
              <li>Process multiple pages at once</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">JPG to PDF</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Combine multiple JPG images into one PDF</li>
              <li>Drag and drop to reorder pages</li>
              <li>Preserve image quality</li>
              <li>Instant PDF download</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-2xl font-semibold text-white mb-2">Why Choose Our Converter?</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-1">100% Free</h3>
            <p className="text-gray-300">No hidden costs or subscriptions required. Convert as many files as you need.</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-1">Secure</h3>
            <p className="text-gray-300">Your files are processed securely and deleted immediately after conversion.</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-1">Easy to Use</h3>
            <p className="text-gray-300">Simple interface with drag-and-drop support. No technical knowledge needed.</p>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-2xl font-semibold text-white mb-2">How It Works</h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2">
          <li>Select your conversion type (PDF to JPG or JPG to PDF)</li>
          <li>Upload your file(s) by dragging and dropping or using the file selector</li>
          <li>Wait for the conversion to complete</li>
          <li>Download your converted file(s)</li>
        </ol>
      </section>
    </div>
  );
}