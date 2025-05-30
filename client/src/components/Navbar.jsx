import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-[#121212] text-gray-100 border-b border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 text-center">
          <h1 className="text-3xl font-bold text-gray-100">Free Online File Tools: Convert, Merge &amp; More</h1>
        </div>
        <div className="border-t border-gray-600"></div>
        <nav className="flex gap-6 items-center py-2 bg-[#121212]">
          <Link to="/about" className="text-gray-300 hover:text-white transition">About</Link>
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(window.dropdownTimer);
              setIsDropdownOpen(true);
            }}
            onMouseLeave={() => {
              window.dropdownTimer = setTimeout(() => setIsDropdownOpen(false), 100);
            }}
          >
            <button
              className="text-gray-300 hover:text-white transition w-full text-left"
              onClick={(e) => {
                // Only toggle if it's not already open due to hover
                if (!isDropdownOpen) {
                  setIsDropdownOpen(true);
                }
              }}
            >
              Tools ▾
            </button>
            {isDropdownOpen && (
              <div
                className="absolute bg-[#121212] border border-gray-700 shadow-lg top-full mt-2 rounded-md overflow-hidden z-50 min-w-[180px] transition-all duration-200"
                onMouseLeave={() => {
                  window.dropdownTimer = setTimeout(() => setIsDropdownOpen(false), 100);
                }}
              >
                <button
                  className="block px-5 py-3 text-left text-gray-300 hover:bg-gray-700 w-full whitespace-nowrap"
                  onClick={() => handleNavigate("/pdf-to-jpg")}
                >
                  PDF to JPG
                </button>
                <button
                  className="block px-5 py-3 text-left text-gray-300 hover:bg-gray-700 w-full whitespace-nowrap"
                  onClick={() => handleNavigate("/jpg-to-pdf")}
                >
                  JPG to PDF
                </button>
              </div>
            )}
          </div>
          <Link to="/qa" className="text-gray-300 hover:text-white transition">Q&amp;A</Link>
        </nav>
      </div>
    </header>
  );
}