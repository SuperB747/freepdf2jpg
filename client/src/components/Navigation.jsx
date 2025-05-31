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
      <div className="text-center py-3">
        <h1 className="text-2xl font-bold text-white">Free PDF to JPG & JPG to PDF Converter</h1>
        <p className="text-gray-300 mt-1">Convert your files easily and securely</p>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <ul className="flex justify-center items-center">
            <li>
              <Link
                to="/"
                className={`text-white px-4 py-2 inline-block hover:bg-blue-600 transition-colors ${isActive('/')}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`text-white px-4 py-2 inline-block hover:bg-blue-600 transition-colors ${isActive('/about')}`}
              >
                About
              </Link>
            </li>
            <li 
              className="relative" 
              ref={toolsRef}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button
                className={`text-white px-4 py-2 inline-block hover:bg-blue-600 transition-colors ${
                  isActive('/pdf-to-jpg') || isActive('/jpg-to-pdf') || isToolsOpen ? 'bg-blue-700' : ''
                }`}
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                onMouseEnter={() => setIsToolsOpen(true)}
              >
                Tools
                <span className={`ml-1 transition-transform duration-200 inline-block ${isToolsOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isToolsOpen && (
                <ul
                  className="absolute left-0 w-48 bg-gray-800 shadow-lg py-1 z-50"
                >
                  <li>
                    <Link
                      to="/pdf-to-jpg"
                      className={`block px-3 py-1 text-white hover:bg-blue-600 transition-colors ${isActive('/pdf-to-jpg')}`}
                      onClick={() => setIsToolsOpen(false)}
                    >
                      PDF to JPG
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/jpg-to-pdf"
                      className={`block px-3 py-1 text-white hover:bg-blue-600 transition-colors ${isActive('/jpg-to-pdf')}`}
                      onClick={() => setIsToolsOpen(false)}
                    >
                      JPG to PDF
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                to="/qa"
                className={`text-white px-4 py-2 inline-block hover:bg-blue-600 transition-colors ${isActive('/qa')}`}
              >
                Q&A
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`text-white px-4 py-2 inline-block hover:bg-blue-600 transition-colors ${isActive('/contact')}`}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
} 