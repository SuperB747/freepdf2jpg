import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
  const location = useLocation();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#1f1f1f]">
      {/* Title Section */}
      <div className="text-center py-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight px-2">Free PDF to JPG & JPG to PDF Converter</h1>
        <p className="text-gray-300">Convert your files easily and securely</p>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-800 mb-1 overflow-x-auto relative">
        <div className="max-w-4xl mx-auto">
          <ul className="flex justify-center items-center min-w-max">
            <li>
              <Link
                to="/"
                className={`text-white px-3 sm:px-6 py-3 sm:py-4 inline-block hover:bg-blue-600 transition-colors ${isActive('/')}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`text-white px-3 sm:px-6 py-3 sm:py-4 inline-block hover:bg-blue-600 transition-colors ${isActive('/about')}`}
              >
                About
              </Link>
            </li>
            <li className="relative group" ref={toolsRef}>
              <button
                type="button"
                className={`text-white px-3 sm:px-6 py-3 sm:py-4 inline-flex items-center hover:bg-blue-600 transition-colors ${
                  isActive('/pdf-to-jpg') || isActive('/jpg-to-pdf') || isToolsOpen ? 'bg-blue-700' : ''
                }`}
                onClick={() => setIsToolsOpen(!isToolsOpen)}
              >
                Tools
                <span 
                  className={`ml-1 transition-transform duration-200 inline-block ${isToolsOpen ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>
              {isToolsOpen && (
                <div
                  className="absolute left-0 mt-0 w-48 bg-gray-800 shadow-lg rounded-md overflow-hidden border border-gray-700"
                  style={{
                    zIndex: 50,
                  }}
                >
                  <Link
                    to="/pdf-to-jpg"
                    className={`block px-4 py-2 text-white hover:bg-blue-600 transition-colors ${isActive('/pdf-to-jpg')}`}
                    onClick={() => setIsToolsOpen(false)}
                  >
                    PDF to JPG
                  </Link>
                  <Link
                    to="/jpg-to-pdf"
                    className={`block px-4 py-2 text-white hover:bg-blue-600 transition-colors ${isActive('/jpg-to-pdf')}`}
                    onClick={() => setIsToolsOpen(false)}
                  >
                    JPG to PDF
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link
                to="/qa"
                className={`text-white px-3 sm:px-6 py-3 sm:py-4 inline-block hover:bg-blue-600 transition-colors ${isActive('/qa')}`}
              >
                Q&A
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`text-white px-3 sm:px-6 py-3 sm:py-4 inline-block hover:bg-blue-600 transition-colors ${isActive('/contact')}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
} 