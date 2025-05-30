import AdUnit from '../components/AdUnit';

export default function Home() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Free PDF to JPG & JPG to PDF Converter</h1>
      
      <AdUnit slot="1234567890" /> {/* Replace with your actual ad slot ID */}
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Convert Your Files for Free</h2>
        <p className="text-gray-300 mb-4">
          Welcome to FreePDF2JPG, your go-to solution for quick and easy file conversions. Our tool helps you convert PDF files to high-quality JPG images and combine multiple JPG images into a single PDF document.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">PDF to JPG</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Convert PDF pages to high-quality JPG images</li>
              <li>Maintain original quality and resolution</li>
              <li>Download all images in a convenient ZIP file</li>
              <li>Process multiple pages at once</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">JPG to PDF</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Combine multiple JPG images into one PDF</li>
              <li>Drag and drop to reorder pages</li>
              <li>Preserve image quality</li>
              <li>Instant PDF download</li>
            </ul>
          </div>
        </div>
      </section>

      <AdUnit slot="9876543210" format="rectangle" /> {/* Replace with your actual ad slot ID */}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Why Choose Our Converter?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">100% Free</h3>
            <p className="text-gray-300">No hidden costs or subscriptions required. Convert as many files as you need.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
            <p className="text-gray-300">Your files are processed securely and deleted immediately after conversion.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Easy to Use</h3>
            <p className="text-gray-300">Simple interface with drag-and-drop support. No technical knowledge needed.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-3">
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