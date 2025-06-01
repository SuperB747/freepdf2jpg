import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
          <div className="mt-4">
            <p className="text-gray-400">Or try these popular tools:</p>
            <div className="mt-4 space-x-4">
              <Link
                to="/pdf-to-jpg"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                PDF to JPG
              </Link>
              <Link
                to="/jpg-to-pdf"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                JPG to PDF
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 