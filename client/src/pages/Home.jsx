import AdUnit from '../components/AdUnit';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <AdUnit slot="1234567890" /> {/* Replace with your actual ad slot ID */}
      
      <section className="mb-3">
        <h2 className="text-xl font-semibold text-white mb-1">Convert Your Files for Free</h2>
        <p className="text-gray-300 mb-2">
          Welcome to FreePDF2JPG, your go-to solution for quick and easy file conversions. Our tool helps you convert PDF files to high-quality JPG images and combine multiple JPG images into a single PDF document.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-1">PDF to JPG</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-0.5">
              <li>Convert PDF pages to high-quality JPG images</li>
              <li>Maintain original quality and resolution</li>
              <li>Download all images in a convenient ZIP file</li>
              <li>Process multiple pages at once</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-1">JPG to PDF</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-0.5">
              <li>Combine multiple JPG images into one PDF</li>
              <li>Drag and drop to reorder pages</li>
              <li>Preserve image quality</li>
              <li>Instant PDF download</li>
            </ul>
          </div>
        </div>
      </section>

      <AdUnit slot="9876543210" format="rectangle" /> {/* Replace with your actual ad slot ID */}

      <section className="mb-3">
        <h2 className="text-xl font-semibold text-white mb-1">Why Choose Our Converter?</h2>
        <div className="grid md:grid-cols-3 gap-2">
          <div className="bg-gray-800 p-2 rounded-lg">
            <h3 className="text-base font-semibold text-white mb-0.5">100% Free</h3>
            <p className="text-gray-300 text-sm">No hidden costs or subscriptions required. Convert as many files as you need.</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <h3 className="text-base font-semibold text-white mb-0.5">Secure</h3>
            <p className="text-gray-300 text-sm">Your files are processed securely and deleted immediately after conversion.</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <h3 className="text-base font-semibold text-white mb-0.5">Easy to Use</h3>
            <p className="text-gray-300 text-sm">Simple interface with drag-and-drop support. No technical knowledge needed.</p>
          </div>
        </div>
      </section>

      <section className="mb-3">
        <h2 className="text-xl font-semibold text-white mb-1">How It Works</h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-1 text-sm">
          <li>Select your conversion type (PDF to JPG or JPG to PDF)</li>
          <li>Upload your file(s) by dragging and dropping or using the file selector</li>
          <li>Wait for the conversion to complete</li>
          <li>Download your converted file(s)</li>
        </ol>
      </section>

      <AdUnit slot="5432109876" /> {/* Replace with your actual ad slot ID */}
    </div>
  );
}