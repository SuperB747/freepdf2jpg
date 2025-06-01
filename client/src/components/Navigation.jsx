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

  const handleMouseEnter = () => {
    setIsToolsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsToolsOpen(false);
  };

  const toggleDropdown = () => {
    setIsToolsOpen(!isToolsOpen);
  };

  return (
    <header className="bg-[#1f1f1f]">
      {/* Title Section */}
      <div className="text-center py-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight px-2">Free PDF to JPG & JPG to PDF Converter</h1>
        <p className="text-gray-300">Convert your files easily and securely</p>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-800 mb-1 relative">
        <div className="max-w-4xl mx-auto">
          <ul className="flex justify-center items-center min-w-max px-4">
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
            <li 
              className="relative" 
              style={{ position: 'relative' }} 
              ref={toolsRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`text-white px-3 sm:px-6 py-3 sm:py-4 inline-flex items-center justify-center gap-1 hover:bg-blue-600 transition-colors ${
                  isActive('/pdf-to-jpg') || isActive('/jpg-to-pdf') || isToolsOpen ? 'bg-blue-700' : ''
                }`}
                onClick={toggleDropdown}
                aria-expanded={isToolsOpen}
              >
                <span>Tools</span>
                <span 
                  className={`transition-transform duration-200 inline-block ${isToolsOpen ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`dropdown-menu absolute left-0 min-w-[12rem] bg-gray-800 shadow-lg rounded-md overflow-hidden border border-gray-700 transition-all duration-200 ${
                  isToolsOpen 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-[-8px] pointer-events-none'
                }`}
                style={{
                  position: 'absolute',
                  top: '100%',
                  zIndex: 9999,
                  marginTop: '1px',
                }}
              >
                <Link
                  to="/pdf-to-jpg"
                  className={`block w-full px-4 py-2 text-white hover:bg-blue-600 transition-colors ${isActive('/pdf-to-jpg')}`}
                  onClick={() => setIsToolsOpen(false)}
                >
                  PDF to JPG
                </Link>
                <Link
                  to="/jpg-to-pdf"
                  className={`block w-full px-4 py-2 text-white hover:bg-blue-600 transition-colors ${isActive('/jpg-to-pdf')}`}
                  onClick={() => setIsToolsOpen(false)}
                >
                  JPG to PDF
                </Link>
              </div>
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