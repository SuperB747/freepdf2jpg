import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Free PDF to JPG & JPG to PDF Converter | FreePDF2JPG</title>
        <meta name="description" content="Easily convert PDF to JPG or JPG to PDF online for free. Fast, secure, and high-quality file conversion for all your needs." />
        <link rel="canonical" href="https://freepdf2jpg.ca/" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Convert Your Files for Free</h2>
          <p className="text-gray-300 mb-6">
            Welcome to FreePDF2JPG, your go-to solution for quick and easy file conversions. Our tool helps you convert PDF files to high-quality JPG images and combine multiple JPG images into a single PDF document.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              to="/pdf-to-jpg"
              className="block bg-gray-800 p-6 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-white mb-3">PDF to JPG</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Convert PDF pages to high-quality JPG images</li>
                <li>Maintain original quality and resolution</li>
                <li>Download all images in a convenient ZIP file</li>
                <li>Process multiple pages at once</li>
              </ul>
            </Link>
            <Link 
              to="/jpg-to-pdf"
              className="block bg-gray-800 p-6 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-white mb-3">JPG to PDF</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Combine multiple JPG images into one PDF</li>
                <li>Drag and drop to reorder pages</li>
                <li>Preserve image quality</li>
                <li>Instant PDF download</li>
              </ul>
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Why Choose Our Converter?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">100% Free</h3>
              <p className="text-gray-300">No hidden costs or subscriptions required. Convert as many files as you need.</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
              <p className="text-gray-300">Your files are processed securely and deleted immediately after conversion.</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Easy to Use</h3>
              <p className="text-gray-300">Simple interface with drag-and-drop support. No technical knowledge needed.</p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-3">
            <li>Select your conversion type (PDF to JPG or JPG to PDF)</li>
            <li>Upload your file(s) by dragging and dropping or using the file selector</li>
            <li>Wait for the conversion to complete</li>
            <li>Download your converted file(s)</li>
          </ol>
        </section>
      </div>
    </>
  );
}